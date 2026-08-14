import config from "./Config.js";
import { Drawable } from "./Drawable.js";
import { LocalStorageManager } from "./Managers/LocalStorageManager.js";

export class ClickCoin extends Drawable {
  constructor(scene, graphics, value) {
    super(scene, graphics);

    const circle = new Phaser.Geom.Circle(
      config.game.width / 2,
      config.game.height / 2,
      config.clicker.size,
    );

    const point = Phaser.Geom.Circle.GetPoint(
      circle,
      Phaser.Math.FloatBetween(0, 1),
    );

    this.x = point.x;
    this.y = point.y;

    this.text = scene.add
      .text(this.x, this.y, `+${value}`, {
        fontSize: "32px",
        fill: "#ffffff",
        fontFamily: "doodle_font",
        resolution: 2,
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    scene.tweens.add({
      targets: this.text,
      y: this.text.y - 100,
      alpha: 0,
      duration: 2000,
      ease: "Power2",
      onComplete: () => {
        this.text.destroy();
      },
    });
  }
}
