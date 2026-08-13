import { AnimationManager } from "./AnimationManager.js";
import { MainMenuCircleAnimation } from "./Animations/MainMenuCircles.js";
import config from "./Config.js";
import { MainClicker } from "./MainClicker.js";

class MainScene extends Phaser.Scene {
  preload() {
    this.load.image("doge_main", "assets/sprites/dogecoin.png");
    this.load.image("click_coin", "assets/sprites/click_coin.png");

    this.load.font("doge_font", "assets/fonts/doge_sans.otf", "truetype");
  }

  create() {
    this.score = { value: 0 };
    this.graphics = this.add.graphics({ add: false });
    this.circleAnimation = new MainMenuCircleAnimation();
    this.mainClicker = new MainClicker(this, this.graphics, this.score);

    this.text = this.add
      .text(this.x, this.y, `score: ${this.score.value}`, {
        fontSize: "32px",
        fill: "#ffffff",
        fontFamily: "doge_font",
        resolution: 2,
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.0);
  }

  update() {
    this.graphics.clear();
    this.circleAnimation.anim(this.graphics);
    this.text.setText(`score: ${this.score.value}`);
  }
}

const gameConfig = {
  type: Phaser.AUTO,
  width: config.game.width,
  height: config.game.height,
  backgroundColor: 0x2d2d2d,
  antialias: true,
  scene: MainScene,
};

const game = new Phaser.Game(gameConfig);
