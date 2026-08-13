import { ClickCoin } from "./ClickCoin.js";
import config from "./Config.js";
import { Drawable } from "./Drawable.js";

export class MainClicker extends Drawable {
  constructor(scene, graphics, score) {
    super(scene, graphics);

    this.x = config.game.width / 2;
    this.y = config.game.height / 2;
    this.size = config.clicker.size;
    this.sprite = scene.add.sprite(this.x, this.y, "doge_main");
    this.scale = this.size / this.sprite.width;
    this.sprite.setScale(this.scale);
    this.sprite.setInteractive();
    this.score = score;

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
    new ClickCoin(this.scene, this.graphics);
    this.score.value += 1;
  }
}
