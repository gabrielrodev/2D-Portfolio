import { K } from "./kaboomCtx";

K.loadSprite("spritesheet", "/spritesheet.png", {
    sliceX: 39,
    sliceY: 31, //every frame is 16 by 16. divide by 16 to get the number of frames in the spritesheet
    anims: {
        "idle": 936,
        "walk-down": { from: 936, to: 939, loop: true, speed: 8},
        "idle-side": 975,
        "walk-side": { from: 975, to: 978, loop: true, speed: 8},
        "idle-up": 1014,
        "walk-up": { from: 1014, to: 1017, loop: true, speed: 8},
    },
});

K.loadSprite("map", "/map.png", );

K.setBackground(K.Color.fromHex("#311047"));