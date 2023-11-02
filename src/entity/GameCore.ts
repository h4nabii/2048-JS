import Grid, {Position} from "./Grid";
import Tile from "./Tile";
import {Direction} from "./KeyInputManager";

export interface GameState {
    score: number,
    over: boolean,
    data: Grid<Tile>,
}

export enum Action {
    MOVE = "move",
    MARGE = "merge",
}

export interface MoveState {
    moveCount: number,
    scoreEarned: number,
    tileChanges: {
        move: Array<{
            origin: Position,
            target: Position,
        }>,
        merge: Array<Position>,
    },
}

export interface CellInfo {
    value: number,
    position: Position
}

interface LoopInfo {
    rowLoop: { start: number, end: number, step: number, offset: number },
    colLoop: { start: number, end: number, step: number, offset: number },
}

export default class GameCore {
    private readonly width: number;
    private readonly height: number;
    private readonly data: Grid<Tile>;


    public constructor(height: number = 4, width: number = 4) {
        this.height = height;
        this.width = width;
        this.data = new Grid<Tile>(height, width);
    }

    private getRandomAvailable(): [number, number] {
        if (this.data.full) return null;
        let availableCells = this.data.availableCells;
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    }

    set(value: number, row: number, col: number): boolean {
        if (this.data.full) return false;
        if (this.data.get(row, col)) return false;

        return this.data.put(new Tile(value), row, col);
    }

    randomAdd(): CellInfo {
        if (this.data.full) return null;
        let value = GameCore.getRandomNumber();
        let [row, col] = this.getRandomAvailable();

        if (!this.data.put(new Tile(value), row, col)) return null;

        return {value, position: [row, col]};
    }

    private getLoopInfo(dir: Direction): LoopInfo {
        switch (dir) {
        case Direction.UP:
            return {
                rowLoop: {start: 2, end: this.height + 1, step: 1, offset: -1},
                colLoop: {start: 1, end: this.width + 1, step: 1, offset: 0},
            };
        case Direction.DOWN:
            return {
                rowLoop: {start: this.height - 1, end: 0, step: -1, offset: 1},
                colLoop: {start: 1, end: this.width + 1, step: 1, offset: 0},
            };
        case Direction.LEFT:
            return {
                rowLoop: {start: 1, end: this.height + 1, step: 1, offset: 0},
                colLoop: {start: 2, end: this.width + 1, step: 1, offset: -1},
            };
        case Direction.RIGHT:
            return {
                rowLoop: {start: 1, end: this.height + 1, step: 1, offset: 0},
                colLoop: {start: this.width - 1, end: 0, step: -1, offset: 1},
            };
        }
    }

    private* moveTraversal(dir: Direction): Generator<{ cur: Position, next: Position, merge: boolean }> {
        let mergePositionList = new Set<string>;

        let info = this.getLoopInfo(dir);
        for (let row = info.rowLoop.start; row !== info.rowLoop.end; row += info.rowLoop.step) {
            for (let col = info.colLoop.start; col !== info.colLoop.end; col += info.colLoop.step) {
                if (!this.data.isAvailable(row, col)) {
                    let [nextRow, nextCol] = [row, col];
                    let merge = false;
                    do {
                        nextRow += info.rowLoop.offset;
                        nextCol += info.colLoop.offset;
                    } while (this.data.isAvailable(nextRow, nextCol));

                    // if (out of bounds || not same value || merged) move back
                    if (this.data.get(nextRow, nextCol) === null ||
                        this.data.get(nextRow, nextCol)?.valueOf() !== this.data.get(row, col)?.valueOf() ||
                        mergePositionList.has(nextRow + "," + nextCol)) {
                        nextRow -= info.rowLoop.offset;
                        nextCol -= info.colLoop.offset;
                    }

                    if (!(nextRow === row && nextCol === col)) {
                        // to merge
                        if (this.data.get(nextRow, nextCol)?.valueOf() === this.data.get(row, col)?.valueOf()) {
                            mergePositionList.add(nextRow + "," + nextCol);
                            merge = true;
                        }
                        yield {cur: [row, col], next: [nextRow, nextCol], merge};
                    }
                }
            }
        }
    }

    move(dir: Direction): MoveState {
        let state: MoveState = {
            moveCount: 0,
            scoreEarned: 0,
            tileChanges: {
                move: [],
                merge: [],
            },
        };

        for (let {cur, next, merge} of this.moveTraversal(dir)) {
            this.data.move(...cur, ...next);
            state.moveCount++;
            state.tileChanges.move.push({origin: cur, target: next});

            if (merge) {
                let mergedValue = this.data.get(...next)?.valueOf() * 2;
                this.data.put(new Tile(mergedValue), ...next);
                state.scoreEarned += mergedValue;
                state.tileChanges.merge.push([...next]);
            }
        }

        return state;
    }

    // TODO: Implement game logic
    get over() {
        return this.data.full;
    }

    public toString(): string {
        return this.data.toString();
    }

    private static getRandomNumber(): number {
        return 2;
    }
}