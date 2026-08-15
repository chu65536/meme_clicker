import config from "./Config.js";
import { LocalStorageManager } from "./Managers/LocalStorageManager.js";

export class ClickCoin {
  constructor(scene, value) {
    const gap = 20;

    // spawning in random place on a circle around clicker
    const circle = new Phaser.Geom.Circle(
      config.game.width / 2,
      config.game.height / 2,
      config.clicker.size,
    );
    const point = Phaser.Geom.Circle.GetPoint(
      circle,
      Phaser.Math.FloatBetween(0, 1),
    );
    const x = point.x;
    const y = point.y;

    const number = scene.add
      .text(0, 0, `+${value}`, {
        fontSize: "32px",
        fill: "#ffffff",
        fontFamily: "doge_sans",
        resolution: 2,
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);
    const coinSprite = scene.add
      .sprite(number.width / 2 + gap, 0, "coin")
      .setScale(0.04)
      .setOrigin(0.5);
    const container = scene.add.container(x, y, [number, coinSprite]);

    scene.tweens.add({
      targets: container,
      y: container.y - 100,
      alpha: 0,
      duration: 2000,
      ease: "Power2",
      onComplete: () => {
        container.destroy();
      },
    });
  }
}
