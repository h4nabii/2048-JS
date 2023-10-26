const ActiveClassName = "active";
const EmptyNumber = 0;
const InvalidNumber = -1;

export default class Game {
    private readonly width: number;
    private readonly height: number;
    private readonly data: Array<number>;
    private readonly doms: NodeListOf<Element>;

    public constructor(doms: NodeListOf<Element>, width: number = 4, height: number = 4) {
        if (doms.length != width * height)
            throw new Error("Length of NodeList does not match the width and count");

        this.width = width;
        this.height = height;
        this.doms = doms;
        this.data = new Array(width * height).fill(EmptyNumber);

        this.doms.forEach((item, index) => {
            item.textContent = this.data[index] + "";
        });
    }

    public get(row: number, col: number): number {
        return this.data[(row - 1) * this.width + (col - 1)];
    }

    private set(num: number, row: number, col: number): void {
        let index = (row - 1) * this.width + (col - 1);
        this.data[index] = num;
        this.doms[index].textContent = num + "";
        if (Game.isDisplayData(num))
            this.doms[index].classList.add(ActiveClassName);
        else
            this.doms[index].classList.remove(ActiveClassName);
    }

    public add(num?: number, row?: number, col?: number): boolean {
        if (this.isFull()) return false;

        let number = num || Game.getRandomNumber();
        if (!row && !col) {
            [row, col] = this.getAvailablePosition();
        } else {
            if (this.get(col, row)) return false;
        }
        this.set(number, row, col);
        return true;
    }

    private isFull() {
        for (let num of this.data)
            if (num === EmptyNumber) return false;
        return true;
    }

    private getAvailablePosition(): [number, number] {
        if (this.isFull()) return [InvalidNumber, InvalidNumber];

        let row: number, col: number;
        do {
            row = Math.floor(Math.random() * this.height) + 1;
            col = Math.floor(Math.random() * this.width) + 1;
        } while (this.get(row, col));

        return [row, col];
    }

    private static getRandomNumber(): number {
        return 2;
    }

    private static isDisplayData(data: number) {
        return data > 0;
    }
}
