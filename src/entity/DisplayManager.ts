interface DisplayOptions {
    elements: DOMs,
    width?: number,
    height?: number,
    styleName?: string,
    animateInterval?: number,
}

interface DOMs {
    tileContainer: Element,
    score: Element,
    bestScore: Element,
}

export default class DisplayManager {
    protected readonly AnimationStyles = Object.freeze({
        active: "active",
        removed: "removed",
        color: (value: number) => `${this.styleName}-color-${value}`,
        position: (row: number, col: number) => `${this.styleName}-${row}-${col}`,
    });

    protected readonly doms: DOMs;
    protected readonly width: number;
    protected readonly height: number;

    protected readonly styleName: string;

    interval: number;

    protected static translateValue(value: number): string {
        return value + "";
    }

    constructor({
        elements: {
            tileContainer,
            bestScore,
            score,
        },
        width = 4,
        height = 4,
        styleName = "tile",
        animateInterval = 200,
    }: DisplayOptions) {
        if (!(tileContainer instanceof Element))
            throw Error("DisplayManager: Invalid Construct Parameter");

        this.width = width;
        this.height = height;
        this.styleName = styleName;
        this.interval = animateInterval;

        tileContainer.textContent = "";
        bestScore.textContent = "0";
        score.textContent = "0";
        this.doms = {
            tileContainer,
            bestScore,
            score,
        };
    }

    createTile(value: number, row: number, col: number) {
        if (document.querySelector(`.${this.AnimationStyles.position(row, col)}`))
            return;

        let tile = document.createElement("div");
        tile.textContent = DisplayManager.translateValue(value);
        tile.classList.add(this.styleName);
        tile.classList.add(this.AnimationStyles.color(+tile.textContent));
        tile.classList.add(this.AnimationStyles.position(row, col));
        this.doms.tileContainer.append(tile);
    }

    moveTile(fromRow: number, fromCol: number, toRow: number, toCol: number) {
        if (fromRow === toRow && fromCol === toCol) return;
        let tile = document.querySelector(`.${this.AnimationStyles.position(fromRow, fromCol)}`);

        tile.classList.replace(
            this.AnimationStyles.position(fromRow, fromCol),
            this.AnimationStyles.position(toRow, toCol),
        );
    }

    mergeTile(row: number, col: number) {
        let tiles = document.querySelectorAll(`.${this.AnimationStyles.position(row, col)}`);
        let tile = tiles[0], oldTile = tiles[1];
        let number = +tile.textContent;
        oldTile.remove();
        tile.classList.remove(this.AnimationStyles.color(number));
        tile.textContent = number * 2 + "";
        tile.classList.add(this.AnimationStyles.color(number * 2));
        tile.classList.add(this.AnimationStyles.active);
        setTimeout(() => {
            tile.classList.remove(this.AnimationStyles.active);
        }, this.interval);
    }

    addScore(score: number) {
        this.doms.score.textContent = +this.doms.score.textContent + score + "";
    }

    reset() {
        this.doms.tileContainer.textContent = "";
        this.doms.score.textContent = "0";
        this.doms.bestScore.textContent = "0";
    }
}
