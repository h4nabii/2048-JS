import * as _ from "lodash";

export type Position = [number, number];

export default class Grid<T> {
  protected readonly height: number;
  protected readonly width: number;
  protected readonly cells: Array<T>;

  constructor(height: number = 4, width: number = 4) {
    this.height = height;
    this.width = width;
    this.cells = new Array(height * width);
    this.cells.fill(null);
  }

  protected translate(row: number, col: number): number {
    if (!this.inBounds(row, col)) return -1;
    return (row - 1) * this.width + (col - 1);
  }

  get size() {
    return this.cells.filter((item) => item).length;
  }

  get full() {
    return this.size === this.width * this.height;
  }

  get chunks(): Array<Array<T>> {
    return _.chunk(this.cells, this.width);
  }

  get availableCells(): Array<Position> {
    return this.cells
      .map((item, index) => ({
        item,
        index,
      }))
      .filter((item) => !item.item)
      .map(({ index }) => [
        Math.floor(index / this.width) + 1,
        (index % this.width) + 1,
      ]);
  }

  inBounds(row: number, col: number): boolean {
    return row > 0 && row <= this.height && col > 0 && col <= this.width;
  }

  isAvailable(row: number, col: number): boolean {
    const index = this.translate(row, col);
    if (index === -1) return false;
    return this.cells[index] === null;
  }

  put(item: T, row: number, col: number): boolean {
    const index = this.translate(row, col);
    if (index === -1) return false;

    this.cells[index] = item;
    return true;
  }

  get(row: number, col: number): T {
    const index = this.translate(row, col);
    if (index === -1) return null;

    return this.cells[index];
  }

  remove(row: number, col: number): boolean {
    const index = this.translate(row, col);
    if (index === -1) return false;
    if (this.cells[index] === null) return false;

    this.cells[index] = null;
    return true;
  }

  clear() {
    this.cells.fill(null);
  }

  move(
    rowFrom: number,
    colFrom: number,
    rowTo: number,
    colTo: number,
  ): boolean {
    const indexFrom = this.translate(rowFrom, colFrom);
    const indexTo = this.translate(rowTo, colTo);

    this.cells[indexTo] = this.cells[indexFrom];
    this.cells[indexFrom] = null;
    return true;
  }

  toString(padWidth: number = 10): string {
    return this.chunks
      .map(
        (line) =>
          "| " +
          line
            .map((item) => (item?.toString() || "").padStart(padWidth, " "))
            .join(" | ") +
          " |",
      )
      .join("\n");
  }
}
