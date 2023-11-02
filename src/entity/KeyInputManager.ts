export enum Direction {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

const KeyMap = new Map<string, string>([
    // Arrow Mode
    ["ArrowUp", Direction.UP],
    ["ArrowRight", Direction.RIGHT],
    ["ArrowDown", Direction.DOWN],
    ["ArrowLeft", Direction.LEFT],

    // Vim Mode
    ["k", Direction.UP],
    ["l", Direction.RIGHT],
    ["j", Direction.DOWN],
    ["h", Direction.LEFT],

    // WASD Mode
    ["w", Direction.UP],
    ["d", Direction.RIGHT],
    ["s", Direction.DOWN],
    ["a", Direction.LEFT],
]);

export default class KeyInputManager {
    static readonly MOVE = "move";
    static readonly RESTART = "restart";
    static readonly KEEP_PLAY = "keepPlaying";

    private events: Map<string, Array<(data: any) => void>> = new Map();

    constructor() {
        document.addEventListener("keydown", (evt) => {
            let modifiers = evt.altKey || evt.ctrlKey || evt.metaKey || evt.shiftKey;
            let keyCode = KeyMap.get(evt.key);

            if (modifiers) return;

            if (keyCode !== void 0) {
                evt.preventDefault();
                this.emit(KeyInputManager.MOVE, keyCode);
            }

            // R key restarts the game
            if (evt.key === "r") {
                this.emit(KeyInputManager.RESTART);
            }
        });
    }

    on(eventName: string, callback: (data: any) => void) {
        if (!this.events.get(eventName)) {
            this.events.set(eventName, []);
        }
        this.events.get(eventName)?.push(callback);
    }

    bindButton(selector: string, eventName: string) {
        let button = document.querySelector(selector);
        if (!(button instanceof HTMLButtonElement)) return;
        button.addEventListener("click", () => {
            this.emit(eventName);
        });
    }

    private emit(eventName: string, data?: any) {
        let callbacks = this.events.get(eventName);
        if (callbacks) {
            callbacks.forEach(callback => {
                callback(data);
            });
        }
    }
}
