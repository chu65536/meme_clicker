import { LocalStorageManager } from "./Managers/LocalStorageManager.js";
import { ClickCoin } from "./ClickCoin.js";

export class PassiveIncome {
  static init(scene) {
    scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        const gameState = LocalStorageManager.loadGameState();
        gameState.coins += gameState.coinsPerSecond;
        console.log(scene);
        if (scene.scene.key == "MainScene") {
          new ClickCoin(scene, this.graphics, gameState.coinsPerSecond);
        }
        LocalStorageManager.updateGameState(gameState);
      },
    });
  }
}
