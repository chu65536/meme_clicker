import config from "../Config.js";
import { MainClicker } from "../MainClicker.js";
import { GameState } from "../GameState.js";
import { ShopScene } from "./ShopScene.js";
import { SoundManager } from "../Managers/SoundManager.js";
import { LocalStorageManager } from "../Managers/LocalStorageManager.js";
import { Button } from "../UI/Button.js";
import { ClickCoin } from "../ClickCoin.js";
import { FadingCirclesAnimation } from "../Animations/FadingCirclesAnimation.js";
import { Utils } from "../Utils/Utils.js";
import { StreakBar } from "../UI/StreakBar.js";

export class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }
  preload() {
    this.load.image("clicker", "assets/sprites/clicker.png");
    this.load.image("coin", "assets/sprites/coin.png");
    this.load.image("shop", "assets/sprites/shop.png");
    this.load.image("close", "assets/sprites/close.png");
    this.load.image("crypto_coin", "assets/sprites/crypto_coin.png");
    this.load.image("paws", "assets/sprites/paws.png");
    this.load.image("strong", "assets/sprites/strong.png");
    this.load.image("weak", "assets/sprites/weak.png");
    this.load.image("thug", "assets/sprites/thug.png");

    this.load.audio("click", "assets/sounds/click.wav");

    this.load.font("doge_sans", "assets/fonts/doge_sans.otf", "opentype");
  }

  create() {
    this.graphics = this.add.graphics({ add: false });

    this.#initEvents();
    this.#initUi();
    this.#initSounds();
    this.circleAnimation = new FadingCirclesAnimation();
  }

  update() {
    const currentGameState = LocalStorageManager.loadGameState();

    this.graphics.clear();
    if (currentGameState.coinsPerSecond > 0) {
      this.circleAnimation.anim(this.graphics);
    }
    this.score.setText(`${Utils.truncateNumber(currentGameState.coins)}`);
  }

  #initEvents() {
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        const gameState = LocalStorageManager.loadGameState();
        // passive income
        if (gameState.coinsPerSecond > 0) {
          gameState.coins += gameState.coinsPerSecond;
          new ClickCoin(this, gameState.coinsPerSecond);
        }
        // streak
        if (gameState.isStreakUnlocked) {
          gameState.streakProgress = Math.max(
            0,
            gameState.streakProgress - config.game.streakDecaySpeed,
          );
          const streakBarValue = Math.min(101, gameState.streakProgress);
          gameState.streakProgress = streakBarValue; // clamp 0 101
          this.streakBar.setProgress(streakBarValue / 100);
          gameState.coinsPerClickMultiplier = Math.max(
            1.0,
            streakBarValue / 50,
          );
        }
        LocalStorageManager.updateGameState(gameState);
      },
    });
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

    if (gameState.isStreakUnlocked) {
      const barHeight = 40;
      const sideOffset = 40;
      const radius = 0;
      this.streakBar = new StreakBar(this, width / 2, height - barHeight, {
        width: width - sideOffset,
        height: barHeight,
        radius: radius,
      });
      this.streakBar.setProgress(gameState.streakProgress / 100);
    }
  }

  #initSounds() {
    SoundManager.addSound("click", this.sound.add("click"));
  }
}
