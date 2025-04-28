import { scaleFactor } from "./constants.js"; //importing the scale factor from constants.js file
import { K } from "./kaboomCtx";

K.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39,
    sliceY: 31, //every frame is 16 by 16. divide by 16 to get the number of frames in the spritesheet
    anims: {// i think it specifies how is going to move and in which direction what art is going to be shown
        "idle": 936,
        "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
        "idle-side": 975,
        "walk-side": { from: 975, to: 978, loop: true, speed: 8 },
        "idle-up": 1014,
        "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
    },
});

K.loadSprite("map", "/map.png",);

K.setBackground(K.Color.fromHex("#311047")); // here is basically the color of the background
//here we can specify different scenes
K.scene("main", async () => { //we using fetch call async added
    const mapData = await (await fetch("/map.json")).json(); //fetch the map data from the json file
    const layers = mapData.layers;
    //game object, different components 
    const map = K.make([K.sprite("map"), K.pos(), K.scale(scaleFactor)]);

    const player = K.make([
        K.sprite("spritesheet", { anim: "idle-down" }),
        K.area({
            shape: new K.Rect(K.vec2(0, 3), 10, 10),
        }),
        K.body(),
        K.anchor("center"),
        K.pos(),
        K.scale(scaleFactor),
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
                    K.area({
                        shape: new K.Rect(K.vec2(0), boundary.width, boundary.height),
                    }),
                    K.body({ isStatic: true }), // makes sure that the player can't overlap, it makes walls.
                    K.pos(boundary.x, boundary.y),
                    boundary.name, // we can identify the tag of the game object
                ]);
                if (boundary.name) {
                    player.onCollide(boundary.name, () => {
                        player.isInDialogue = true; // when the player collides with the boundary, it sets the isInDialogue to true
                        //TODO
                    });

                }

            }
        }
    });
K.go("main"); 
