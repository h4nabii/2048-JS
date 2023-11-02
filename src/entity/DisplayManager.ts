interface DisplayOptions {
    element: Element,
    width?: number,
    height?: number,
    styleName?: string,
    animateInterval?: number,
}

export default class DisplayManager {
    protected readonly AnimationStyles = Object.freeze({
        active: "active",
        removed: "removed",
        position: (row: number, col: number) => `${this.styleName}-${row}-${col}`,
    });

    protected readonly container: Element;
    protected readonly width: number;
    protected readonly height: number;

    protected readonly styleName: string;

    interval: number;

    protected static translateValue(value: number): string {
        return value + "";
    }

    constructor({
        element: container,
        width = 4,
        height = 4,
        styleName = "tile",
        animateInterval = 200,
    }: DisplayOptions) {
        if (!(container instanceof Element))
            throw Error("DisplayManager: Invalid Construct Parameter");

        this.width = width;
        this.height = height;
        this.styleName = styleName;
        this.interval = animateInterval;

        container.textContent = "";
        this.container = container;
    }

    createTile(value: number, row: number, col: number) {
        if (document.querySelector(`.${this.AnimationStyles.position(row, col)}`))
            return;

        let tile = document.createElement("div");
        tile.textContent = DisplayManager.translateValue(value);
        tile.classList.add(this.styleName);
        tile.classList.add(this.AnimationStyles.position(row, col));
        this.container.append(tile);
    }

    moveTile(fromRow: number, fromCol: number, toRow: number, toCol: number) {
        if (fromRow === toRow && fromCol === toCol) return;
        let tile = document.querySelector(`.${this.AnimationStyles.position(fromRow, fromCol)}`);
        let target = document.querySelector(`.${this.AnimationStyles.position(toRow, toCol)}`);

        tile.classList.replace(
            this.AnimationStyles.position(fromRow, fromCol),
            this.AnimationStyles.position(toRow, toCol),
        );
    }

    mergeTile(row: number, col: number) {
        let tiles = document.querySelectorAll(`.${this.AnimationStyles.position(row, col)}`);
        let tile = tiles[0], oldTile = tiles[1];
        oldTile.remove();
        tile.textContent = +tile.textContent * 2 + "";
        tile.classList.add(this.AnimationStyles.active);
        setTimeout(() => {
            tile.classList.remove(this.AnimationStyles.active);
        }, this.interval);
    }

    private removeTile(tileDOM: Element) {
        tileDOM.classList.add(this.AnimationStyles.removed);
        setTimeout(() => {
            // tileDOM.remove();
        }, this.interval);
    }
}
