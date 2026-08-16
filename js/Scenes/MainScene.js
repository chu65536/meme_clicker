import config from "../Config.js";
import { MainClicker } from "../MainClicker.js";
import { GameState } from "../GameState.js";
import { ShopScene } from "./ShopScene.js";
import { SoundManager } from "../Managers/SoundManager.js";
import { LocalStorageManager } from "../Managers/LocalStorageManager.js";
import { Button } from "../UI/Button.js";
import { ClickCoin } from "../ClickCoin.js";
import { FadingCirclesAnimation } from "../Animations/MainMenuCirclesAnimation.js";
import { Utils } from "../Utils/Utils.js";

export class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }
  preload() {
    this.load.image("clicker", "assets/sprites/clicker.png");
    this.load.image("coin", "assets/sprites/coin.png");
    this.load.image("shop", "assets/sprites/shop.png");

    this.load.audio("click", "assets/sounds/click.wav");

    this.load.font("doge_sans", "assets/fonts/doge_sans.otf", "opentype");
  }

  create() {
    this.graphics = this.add.graphics({ add: false });

    this.#initUi();
    this.#initSounds();
    this.circleAnimation = new FadingCirclesAnimation();

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        const gameState = LocalStorageManager.loadGameState();
        if (!gameState.coinsPerSecond) return;
        gameState.coins += gameState.coinsPerSecond;
        new ClickCoin(this, gameState.coinsPerSecond);
        LocalStorageManager.updateGameState(gameState);
      },
    });
  }

  update() {
    const currentGameState = LocalStorageManager.loadGameState();

    this.graphics.clear();
    this.circleAnimation.anim(this.graphics);
    this.score.setText(`${Utils.truncateNumber(currentGameState.coins)}`);
  }

  #initUi() {
    const { width, height } = this.scale;
    const gameState = LocalStorageManager.loadGameState();

    this.mainClicker = new MainClicker(this, this.graphics);

    const coinSprite = this.add
      .sprite(0, 0, "coin")
      .setOrigin(0)
      .setScale(0.035);
    this.score = this.add
      .text(
        coinSprite.displayWidth,
        0,
        `${Utils.truncateNumber(gameState.coins)}`,
        {
          fontSize: "32px",
          fill: "#ffffff",
          fontFamily: "doge_sans",
          resolution: 2,
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 4,
        },
      )
      .setOrigin(0);

    const shopButtonAction = () => {
      this.scene.start("ShopScene");
    };
    const shopButton = new Button(this, 0, 0, "shop", shopButtonAction);
    shopButton.object
      .setScale(0.1)
      .setOrigin(0)
      .setPosition(width - shopButton.object.displayWidth, 0);
  }

  #initSounds() {
    SoundManager.addSound("click", this.sound.add("click"));
  }
}
