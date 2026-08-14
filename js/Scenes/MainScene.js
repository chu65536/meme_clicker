import { MainMenuCircleAnimation } from "../Animations/MainMenuCirclesAnimation.js";
import config from "../Config.js";
import { MainClicker } from "../MainClicker.js";
import { GameState } from "../GameState.js";
import { ShopScene } from "./ShopScene.js";
import { SoundManager } from "../Managers/SoundManager.js";
import { LocalStorageManager } from "../Managers/LocalStorageManager.js";
import { Buttton } from "../UI/Button.js";
import { ClickCoin } from "../ClickCoin.js";
import { PassiveIncome } from "../PassiveIncome.js";

class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }
  preload() {
    this.load.image("click_button", "assets/sprites/click_button.png");
    this.load.image("dollar", "assets/sprites/dollar.png");
    this.load.image("shop", "assets/sprites/shop.png");
    this.load.image("close", "assets/sprites/close.png");
    this.load.image("fist", "assets/sprites/fist.png");
    this.load.image("robot", "assets/sprites/robot.png");
    this.load.image("chainsaw", "assets/sprites/chainsaw.png");
    this.load.image("gun", "assets/sprites/gun.png");
    this.load.image("factory", "assets/sprites/factory.png");
    this.load.image("troll", "assets/sprites/troll.png");

    this.load.audio("click", "assets/sounds/click.wav");

    this.load.font("doodle_font", "assets/fonts/doodle_font.ttf", "truetype");
  }

  create() {
    this.graphics = this.add.graphics({ add: false });
    const gameState = LocalStorageManager.loadGameState();

    this.#initUi(gameState);
    this.#initSounds();
    PassiveIncome.init(this);
  }

  update() {
    this.graphics.clear();
    const gameState = LocalStorageManager.loadGameState();
    this.score.setText(`${gameState.coins}`);
  }

  #initUi(gameState) {
    this.mainClicker = new MainClicker(this, this.graphics, this.gameState);

    const dollar = this.add.sprite(0, 0, "dollar").setOrigin(0).setScale(0.5);
    this.score = this.add
      .text(50, 0, `${gameState.coins}`, {
        fontSize: "54px",
        fill: "#ffffff",
        fontFamily: "doodle_font",
        resolution: 2,
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0);

    const shopButton = new Buttton(this, 100, config.game.height - 100, "shop");
    shopButton.object.on("pointerup", () => {
      this.scene.start("ShopScene");
    });
  }

  #initSounds() {
    SoundManager.addSound("click", this.sound.add("click"));
  }
}

const gameConfig = {
  type: Phaser.AUTO,
  width: config.game.width,
  height: config.game.height,
  backgroundColor: config.colors.backgound,
  antialias: true,
  scene: [MainScene, ShopScene],
};

const game = new Phaser.Game(gameConfig);
