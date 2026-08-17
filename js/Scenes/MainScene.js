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
import { CoinsUI } from "../UI/CoinsUI.js";
import { AdsBanner } from "../UI/AdsBanner.js";

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
    this.load.image("bite", "assets/sprites/bite.png");
    this.load.image("plus", "assets/sprites/plus.png");

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
    this.coinsUi.updateText(`${Utils.truncateNumber(currentGameState.coins)}`);
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
          new ClickCoin(this, gameState.coinsPerSecond, false);
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

    this.coinsUi = new CoinsUI(this);

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
      const bottomOffset = 50;
      this.streakBar = new StreakBar(
        this,
        width / 2,
        height - barHeight - bottomOffset,
        {
          width: width - sideOffset,
          height: barHeight,
          radius: radius,
        },
      );
      this.streakBar.setProgress(gameState.streakProgress / 100);
    }

    new AdsBanner(this);
  }

  #initSounds() {
    SoundManager.addSound("click", this.sound.add("click"));
  }
}
