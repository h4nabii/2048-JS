import "./index.html";
import "./normalize.css";

import "./index.scss";

import GameCore, {Direction} from "./entity/GameCore";
import InputManager from "./entity/InputManager";
import DisplayManager from "./entity/DisplayManager";

let doms = {
    blocks: document.querySelector(".main .tile-list"),
};

let display = new DisplayManager({
    element: doms.blocks,
});

let game = new GameCore();
let cellInfo = game.randomAdd();

display.createTile(cellInfo.value, ...cellInfo.position);
console.log(game.toString());

enum Event {
    moveUp = "moveUp",
    moveDown = "moveDown",
    moveLeft = "moveLeft",
    moveRight = "moveRight",
}

let inputManager = new InputManager(new Map([
    ["w", Event.moveUp],
    ["a", Event.moveLeft],
    ["s", Event.moveDown],
    ["d", Event.moveRight],
    ["ArrowUp", Event.moveUp],
    ["ArrowLeft", Event.moveLeft],
    ["ArrowDown", Event.moveDown],
    ["ArrowRight", Event.moveRight],
]));


for (let [event, keys] of inputManager.getKeyMap()) {
    console.log(event, ":", keys.join(", "));
}

inputManager.bindKey("w", "w");
inputManager.bindKey("ArrowUp", "w");
inputManager.removeEvent("a");
inputManager.removeEvent(Event.moveDown);

for (let [event, keys] of inputManager.getKeyMap()) {
    console.log(event, ":", keys.join(", "));
}

inputManager.on(["moveUp", "moveDown", "moveLeft", "moveRight"], (event) => {
    let dir: Direction;
    if (event === Event.moveUp) dir = Direction.UP;
    else if (event === Event.moveDown) dir = Direction.DOWN;
    else if (event === Event.moveLeft) dir = Direction.LEFT;
    else if (event === Event.moveRight) dir = Direction.RIGHT;

    if (game.over) {
        console.log("Game Over");
    } else {
        let state = game.move(dir);
        console.log(state.tileChanges);

        state.tileChanges.move.forEach(change => {
            console.log("origin", ...change.origin, "target", ...change.target);
            display.moveTile(...change.origin, ...change.target);
        });

        if (state.moveCount) {
            setTimeout(() => {
                state.tileChanges.merge.forEach(pos => {
                    display.mergeTile(...pos);
                });

                let cellInfo = game.randomAdd();
                display.createTile(cellInfo.value, ...cellInfo.position);

                console.log(dir);
                console.log(game.toString());
            }, display.interval);
        }
    }
});
