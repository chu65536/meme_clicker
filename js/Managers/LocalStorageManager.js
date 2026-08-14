import { GameState } from "../GameState.js";

export class LocalStorageManager {
  static #loadData(identifier) {
    const dataString = localStorage.getItem(identifier);
    if (dataString) {
      try {
        return JSON.parse(dataString);
      } catch (e) {
        console.error("Error loading save data:", e);
        return null;
      }
    }
    return null;
  }

  static #saveData(identifier, data) {
    localStorage.setItem(identifier, JSON.stringify(data));
  }

  static loadGameState() {
    const localSotrageData = this.#loadData("gameState");
    if (!localSotrageData) {
      return new GameState();
      this.#saveData("gameState", this.gameState);
    } else {
      return this.#loadData("gameState");
    }
  }

  static updateGameState(data) {
    this.#saveData("gameState", data);
  }
}
