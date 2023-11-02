export default class Tile {
    private readonly value: number;

    constructor(value: number = 2) {
        this.value = value;
    }

    valueOf(): number {
        return this.value;
    }

    toString(): string {
        return `[Tile ${this.value}]`;
    }
}
