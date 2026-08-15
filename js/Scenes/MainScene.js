import config from "../Config.js";
import { MainClicker } from "../MainClicker.js";
import { GameState } from "../GameState.js";
import { ShopScene } from "./ShopScene.js";
import { SoundManager } from "../Managers/SoundManager.js";
import { LocalStorageManager } from "../Managers/LocalStorageManager.js";
import { Buttton } from "../UI/Button.js";
import { ClickCoin } from "../ClickCoin.js";
import { PassiveIncome } from "../PassiveIncome.js";
import { FadingCirclesAnimation } from "../Animations/MainMenuCirclesAnimation.js";

export class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }
  preload() {
    this.load.image("clicker", "assets/sprites/clicker.png");
    this.load.image("coin", "assets/sprites/coin.png");

    this.load.audio("click", "assets/sounds/click.wav");

    this.load.font("doge_sans", "assets/fonts/doge_sans.otf", "opentype");
  }

  create() {
    this.graphics = this.add.graphics({ add: false });

    this.#initUi();
    this.#initSounds();
    this.circleAnimation = new FadingCirclesAnimation();
  }

  update() {
    const currentGameState = LocalStorageManager.loadGameState();

    this.graphics.clear();
    this.circleAnimation.anim(this.graphics);
    this.score.setText(`${currentGameState.coins}`);
  }

  #initUi() {
    const gameState = LocalStorageManager.loadGameState();

    this.mainClicker = new MainClicker(this, this.graphics);

    const distBetweenSpriteAndNumbers = 60;
    this.add.sprite(0, 0, "coin").setOrigin(0).setScale(0.05);
    this.score = this.add
      .text(distBetweenSpriteAndNumbers, 0, `${gameState.coins}`, {
        fontSize: "50px",
        fill: "#ffffff",
        fontFamily: "doge_sans",
        resolution: 2,
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0);
  }

  #initSounds() {
    SoundManager.addSound("click", this.sound.add("click"));
  }
}
