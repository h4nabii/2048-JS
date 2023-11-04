export default class Tile<T> {
    protected readonly value: T;

    constructor(value: T) {
        this.value = value;
    }

    valueOf(): T {
        return this.value;
    }

    toString(): string {
        return `[Tile ${this.value}]`;
    }
}
