import { GameState } from "./GameCore";

const BEST_SCORE_KEY = "bestScore";
const GAME_STATE_KEY = "gameState";

class TemporaryStorage {
  private data: Map<string, string> = new Map();

  public getItem(id: string): string {
    return this.data.get(id) || "";
  }

  public setItem(id: string, val: string): void {
    this.data.set(id, val);
  }

  public removeItem(id: string): boolean {
    return this.data.delete(id);
  }

  public clear(): void {
    this.data.clear();
  }
}

export default class StorageManager {
  private storage;

  constructor() {
    const supported = StorageManager.localStorageSupported();
    this.storage = supported ? window.localStorage : new TemporaryStorage();
  }

  private static localStorageSupported(): boolean {
    const storage = window.localStorage;
    if (!storage) return false;
    try {
      const testKey = "testKey";
      storage.setItem(testKey, "testVal");
      storage.removeItem(testKey);
    } catch (error) {
      return false;
    }
    return true;
  }

  public loadBestScore(): number {
    return +(this.storage.getItem(BEST_SCORE_KEY) || 0);
  }

  public saveBestScore(score: number) {
    const best = this.loadBestScore();
    if (score > best) {
      this.storage.setItem(BEST_SCORE_KEY, score.toString());
    }
  }

  public loadGameState(): GameState {
    const gameStateJSON = this.storage.getItem(GAME_STATE_KEY) || "{}";
    return JSON.parse(gameStateJSON);
  }

  public saveGameState(state: GameState) {
    const gameStateJSON = JSON.stringify(state);
    this.storage.setItem(GAME_STATE_KEY, gameStateJSON);
  }

  public clearGameState() {
    this.storage.removeItem(GAME_STATE_KEY);
  }
}
