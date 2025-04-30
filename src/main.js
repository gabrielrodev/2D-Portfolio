import { scaleFactor } from "./constants"; //importing the scale factor from constants.js file
import { k } from "./kaboomCtx";
import { displayDialogue, setCamScale} from "./utils";

k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39,
    sliceY: 31, //every frame is 16 by 16. divide by 16 to get the number of frames in the spritesheet
    anims: {// i think it specifies how is going to move and in which direction what art is going to be shown
        "idle-down": 936,
        "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
        "idle-side": 975,
        "walk-side": { from: 975, to: 978, loop: true, speed: 8 },
        "idle-up": 1014,
        "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
    },
});

k.loadSprite("map", "/map.png");

k.setBackground(k.Color.fromHex("#311047")); // here is basically the color of the background
//here we can specify different scenes
k.scene("main", async () => { //we using fetch call async added
    const mapData = await (await fetch("/map.json")).json(); //fetch the map data from the json file
    const layers = mapData.layers;
    //game object, different components 
    const map = k.add([k.sprite("map"), k.pos(0), k.scale(scaleFactor)]);

    const player = k.make([
        k.sprite("spritesheet", { anim: "idle-down" }),
        k.area({
            shape: new k.Rect(k.vec2(0, 3), 10, 10),
        }),
        k.body(),
        k.anchor("center"),
        k.pos(),
        k.scale(scaleFactor),
        {
            speed: 250,
            direction: "down",
            isInDialogue: false,
        },
        "player",
    ]);

    for (const layer of layers) {
        if (layer.name === "boundaries") {
            for (const boundary of layer.objects) {
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                    }),
                    k.body({ isStatic: true }), // makes sure that the player can't overlap, it makes walls.
                    k.pos(boundary.x, boundary.y),
                    boundary.name, // we can identify the tag of the game object
                ]);
                if (boundary.name) {
                    player.onCollide(boundary.name, () => {
                        player.isInDialogue = true; // when the player collides with the boundary, it sets the isInDialogue to true
                        displayDialogue("TODO", ()=> (player.isInDialogue = false)); // this function is called when the player collides with the boundary
                    });

                }

            }
            continue;
        }
        
        if (layer.name === "spawnpoints"){
            for (const entity of layer.objects) {
                if (entity.name === "player") {
                    player.pos = k.vec2( 
                        (map.pos.x + entity.x) * scaleFactor, 
                        (map.pos.y + entity.y) * scaleFactor
                    ); // this is the position of the player
                    k.add(player); 
                }
            }
        }
    }
    setCamScale(k); // this function is called to set the camera scale
    k.onResize(() => {
        setCanscake(k)
    });

    k.onUpdate(() => {
        k.camPos(player.pos.x,player.pos.y + 100)

    });

    k.onMouseDown((mouseBtn) => {
        if (mouseBtn !== "left" || player.isInDialogue) return; // if the mouse button is not left or the player is in dialogue, it returns

        const worldMousePos = k.toWorld(k.mousePos()); 
        player.moveTo(worldMousePos, player.speed); // this is the speed of the player
    
        const mouseAngle = player.pos.angle(worldMousePos);

        const lowerBound = 50;
        const upperBound = 125;

        if(
            mouseAngle > lowerBound &&
            mouseAngle < upperBound &&
            player.curAnim() !== "walk-up"
        ) {
            player.play("walk-up"); // this is the animation of the player
            player.direction = "up"; // this is the direction of the player
            return;
        }
    });
});
k.go("main");
