import config from "./Config.js";
import { DonateScene } from "./Scenes/DonateScene.js";
import { MainScene } from "./Scenes/MainScene.js";
import { ShopScene } from "./Scenes/ShopScene.js";
import { WinScene } from "./Scenes/WinScene.js";

const gameConfig = {
  type: Phaser.AUTO,
  width: config.game.width,
  height: config.game.height,
  backgroundColor: config.colors.backgound,
  antialias: true,
  scene: [MainScene, ShopScene, DonateScene, WinScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: config.game.width,
    height: config.game.height,
  },
};

const game = new Phaser.Game(gameConfig);
