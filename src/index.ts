import "./index.html";
import "./normalize.css";

import "./index.scss";

import GameCore, { Direction } from "./entity/GameCore";
import InputManager from "./entity/InputManager";
import DisplayManager from "./entity/DisplayManager";
import StorageManager from "./entity/StorageManager";

enum Event {
  moveUp = "moveUp",
  moveDown = "moveDown",
  moveLeft = "moveLeft",
  moveRight = "moveRight",
  restart = "restart",
}

function init(
  game: GameCore,
  display: DisplayManager,
  storage: StorageManager,
) {
  const cellInfo = game.randomAdd();
  const best = storage.loadBestScore();
  display.createTile(cellInfo.value, ...cellInfo.position);
  display.setBestScore(best);

  // console.log(game.toString());
}

const display = new DisplayManager({
  elements: {
    tileContainer: document.querySelector(".main .tile-list"),
    bestScore: document.querySelector("#best-score"),
    score: document.querySelector("#score"),
    overMask: document.querySelector(".game-over-mask"),
    pauseMask: document.querySelector(".pause-mask"),
  },
});

const storage = new StorageManager();

const game = new GameCore();

const inputManager = new InputManager(
  new Map([
    ["w", Event.moveUp],
    ["a", Event.moveLeft],
    ["s", Event.moveDown],
    ["d", Event.moveRight],
    ["ArrowUp", Event.moveUp],
    ["ArrowLeft", Event.moveLeft],
    ["ArrowDown", Event.moveDown],
    ["ArrowRight", Event.moveRight],
    ["r", Event.restart],
  ]),
);

inputManager.on(
  [Event.moveUp, Event.moveDown, Event.moveLeft, Event.moveRight],
  (event) => {
    let dir: Direction;
    if (event === Event.moveUp) dir = Direction.UP;
    else if (event === Event.moveDown) dir = Direction.DOWN;
    else if (event === Event.moveLeft) dir = Direction.LEFT;
    else if (event === Event.moveRight) dir = Direction.RIGHT;

    if (game.over) {
      // console.log("Game Over");
    } else {
      const state = game.move(dir);
      // console.log(state.tileChanges);

      state.tileChanges.move.forEach((change) => {
        // console.log("origin", ...change.origin, "target", ...change.target);
        display.moveTile(...change.origin, ...change.target);
      });

      console.log(state.moveCount);

      if (state.moveCount) {
        setTimeout(() => {
          display.addScore(state.scoreEarned);
          state.tileChanges.merge.forEach((pos) => {
            display.mergeTile(...pos);
          });

          const cellInfo = game.randomAdd();
          display.createTile(cellInfo.value, ...cellInfo.position);

          console.log(dir);
          console.log(game.toString());

          // console.log(game.over);
          // console.log(game.state.score);
          if (game.over) {
            storage.saveBestScore(game.state.score);
          }
        }, display.interval);
      } else {
        // inputManager.pass();
      }
    }
  },
);

inputManager.on([Event.restart], () => {
  game.restart();
  display.reset();
  init(game, display, storage);
});

init(game, display, storage);

inputManager.bindElement("#over-restart", Event.restart);
inputManager.bindElement("#pause-restart", Event.restart);
inputManager.bindElement("#pause-resume", "resume");

inputManager.bindKey("p", "over");
inputManager.on(["over"], () => {
  display.pause();
});

inputManager.on(["resume"], () => {
  display.resume();
});

console.log(inputManager.getKeyMap());
