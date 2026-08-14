import { ClickCoin } from "./ClickCoin.js";
import config from "./Config.js";
import { Drawable } from "./Drawable.js";
import { LocalStorageManager } from "./Managers/LocalStorageManager.js";
import { SoundManager } from "./Managers/SoundManager.js";

export class MainClicker extends Drawable {
  constructor(scene, graphics) {
    super(scene, graphics);

    this.x = config.game.width / 2;
    this.y = config.game.height / 2;
    this.size = config.clicker.size;
    this.sprite = scene.add.sprite(this.x, this.y, "click_button");
    this.scale = this.size / this.sprite.width;

    this.sprite.setScale(this.scale);
    this.sprite.setInteractive();

    this.#setupEvents();
  }

  #setupEvents() {
    this.sprite.on("pointerdown", () => {
      this.sprite.setTint(0xaaaaaa);
    });
    this.sprite.on("pointerup", () => {
      this.sprite.setTint(0xffffff);
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
    new ClickCoin(this.scene, this.graphics, gameState.coinsPerClick);
    gameState.coins += gameState.coinsPerClick;
    LocalStorageManager.updateGameState(gameState);
  }
}
