import { ClickCoin } from "./ClickCoin.js";
import config from "./Config.js";
import { LocalStorageManager } from "./Managers/LocalStorageManager.js";
import { SoundManager } from "./Managers/SoundManager.js";

export class MainClicker {
  constructor(scene, graphics) {
    this.scene = scene;
    this.graphics = graphics;

    this.x = config.game.width / 2;
    this.y = config.game.height / 2;
    this.size = config.clicker.size;
    this.sprite = scene.add.sprite(this.x, this.y, "clicker");
    this.scale = this.size / this.sprite.width;

    this.sprite.setScale(this.scale);
    this.sprite.setInteractive();

    this.#setupEvents();
  }

  #setupEvents() {
    this.sprite.on("pointerup", () => {
      this.click();
    });

    this.sprite.on("pointerover", () => {
      this.sprite.setScale(this.scale + 0.01);
    });

    this.sprite.on("pointerout", () => {
      this.sprite.setScale(this.scale);
    });
  }

  click() {
    SoundManager.playSound("click");
    const gameState = LocalStorageManager.loadGameState();
    let clickValue =
      gameState.baseCoinsPerClick * gameState.coinsPerClickMultiplier;
    gameState.coins += clickValue;

    // crits
    let isCrit = false;
    if (gameState.isCritsUnlocked) {
      if (Math.random() <= gameState.critChance) {
        isCrit = true;
        clickValue *= gameState.critMultiplier;
      }
    }
    // streaks
    if (gameState.isStreakUnlocked) {
      gameState.streakProgress += config.game.streakIncreaseSpeed;
    }
    new ClickCoin(this.scene, clickValue, isCrit);
    LocalStorageManager.updateGameState(gameState);
  }
}
