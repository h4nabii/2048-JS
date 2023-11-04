export default class InputManager {
    private readonly keyMap: Map<string, string>;
    private readonly keys: Set<string> = new Set();
    private readonly events: Set<string> = new Set();

    private readonly eventRunner = new CallbackRunner(200);
    private readonly callbacks: Map<string, Array<(event: string) => void>> = new Map();

    constructor(keyMap: Map<string, string>) {
        this.keyMap = new Map(keyMap);
        for (let [k, e] of keyMap) {
            this.keys.add(k);
            this.events.add(e);
        }

        document.addEventListener("keydown", (evt) => {
            if (evt.altKey || evt.ctrlKey || evt.metaKey || evt.shiftKey) return;

            let key = evt.key;
            if (this.keys.has(key)) this.pushEvent(this.keyMap.get(key));
        });
    }

    bindKey(key: string, event: string) {
        this.keys.add(key);
        this.events.add(event);
        this.keyMap.set(key, event);
    }

    bindElement(selector: string, event: string) {
        let element = document.querySelector(selector);
        element.addEventListener("click", () => {
            this.pushEvent(event);
        });
    }

    addEvent(event: string) {
        this.events.add(event);
    }

    removeEvent(event: string) {
        if (!this.events.has(event)) return;
        for (let key of this.getKeyMap().get(event)) {
            this.keys.delete(key);
            this.keyMap.delete(key);
        }
        this.events.delete(event);
    }

    getKeyMap() {
        let map: Map<string, Array<string>> = new Map();
        for (let event of this.events) map.set(event, []);
        for (let [key, event] of this.keyMap) map.get(event).push(key);
        return map;
    }

    private pushEvent(event: string) {
        if (!this.events.has(event)) return;
        let callbacks = this.callbacks.get(event);
        if (callbacks) {
            this.eventRunner.push(() => {
                callbacks.forEach(callback => callback(event));
            });
        }
        this.eventRunner.active();
    }

    on(eventList: Array<string>, callback: (event: string) => void) {
        eventList.forEach(event => {
            if (!this.callbacks.get(event)) {
                this.callbacks.set(event, []);
            }
            this.callbacks.get(event).push(callback);
        });
    }

    pass() {
        this.eventRunner.pass();
    }
}

class CallbackRunner {
    private callBackQueue: Array<Function> = [];
    private activated: boolean = false;
    private timer: number;

    public interval: number;
    public maxSize: number;

    constructor(interval: number = 500, maxSize: number = 10) {
        this.interval = interval;
        this.maxSize = maxSize;
    }

    push(callback: Function) {
        if (this.callBackQueue.length === this.maxSize) return;
        this.callBackQueue.push(callback);
        this.active();
    }

    active() {
        if (this.activated) return;
        if (this.callBackQueue.length === 0) return;
        this.activated = true;

        let callback = this.callBackQueue.shift();
        callback();

        this.timer = window.setTimeout(() => {
            this.activated = false;
            this.active();
        }, this.interval);
    }

    pass() {
        this.activated = false;
        window.clearTimeout(this.timer);
        this.active();
    }
}
