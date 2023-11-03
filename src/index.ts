import "./index.html";
import "./normalize.css";

import "./index.scss";

import GameCore, {Direction} from "./entity/GameCore";
import InputManager from "./entity/InputManager";
import DisplayManager from "./entity/DisplayManager";

enum Event {
    moveUp = "moveUp",
    moveDown = "moveDown",
    moveLeft = "moveLeft",
    moveRight = "moveRight",
    restart = "restart",
}

function init(game: GameCore, display: DisplayManager) {
    let cellInfo = game.randomAdd();

    display.createTile(cellInfo.value, ...cellInfo.position);
    console.log(game.toString());
}

let display = new DisplayManager({
    elements: {
        tileContainer: document.querySelector(".main .tile-list"),
        bestScore: document.querySelector("#best-score"),
        score: document.querySelector("#score"),
    },
});

let game = new GameCore();

let inputManager = new InputManager(new Map([
    ["w", Event.moveUp],
    ["a", Event.moveLeft],
    ["s", Event.moveDown],
    ["d", Event.moveRight],
    ["ArrowUp", Event.moveUp],
    ["ArrowLeft", Event.moveLeft],
    ["ArrowDown", Event.moveDown],
    ["ArrowRight", Event.moveRight],
    ["r", Event.restart],
]));

inputManager.on([Event.moveUp, Event.moveDown, Event.moveLeft, Event.moveRight], (event) => {
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
                    display.addScore(state.scoreEarned);
                });

                let cellInfo = game.randomAdd();
                display.createTile(cellInfo.value, ...cellInfo.position);

                console.log(dir);
                console.log(game.toString());
            }, display.interval);
        }
    }
});

inputManager.on([Event.restart], () => {
    game.restart();
    display.reset();
    init(game, display);
});

init(game, display);
