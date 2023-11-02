import "./index.html";
import "./normalize.css";

import "./index.scss";

import GameCore from "./entity/GameCore";
import KeyInputManager from "./entity/KeyInputManager";
import DisplayManager from "./entity/DisplayManager";

// console.log("------------------------------ Grid Test");
//
// let grid = new Grid<Tile>();
// console.log(grid.toString());
// grid.put(new Tile(4), 1, 1);
// console.log(grid.toString());
// grid.put(new Tile(8), 1, 1);
// grid.put(new Tile(16), 2, 1);
// console.log(grid.toString());
// console.log(grid.get(1, 1).toString());
// grid.move(1, 1, 4, 4);
// console.log(grid.toString());
// grid.move(4, 4, 2, 1);
// console.log(grid.toString());
// console.log(grid.availableCells);

console.log("------------------------------ Game Test");

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


let inputManager = new KeyInputManager();
inputManager.on(KeyInputManager.MOVE, (dir) => {
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
