import "./index.html";
import "./normalize.css";

import "./index.scss";

import Game from "./Game";

let doms = {
    blocks: document.querySelectorAll(".game .block"),
};


let game = new Game(doms.blocks);

let max = 10;
let timer = setInterval(() => {
    game.add();
    if (!--max)
        clearInterval(timer);
}, 1000);

