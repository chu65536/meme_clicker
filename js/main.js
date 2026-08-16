import config from "./Config.js";
import { MainScene } from "./Scenes/MainScene.js";
import { ShopScene } from "./Scenes/ShopScene.js";

const gameConfig = {
  type: Phaser.AUTO,
  width: config.game.width,
  height: config.game.height,
  backgroundColor: config.colors.backgound,
  antialias: true,
  scene: [MainScene, ShopScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: config.game.width,
    height: config.game.height,
  },
};

const game = new Phaser.Game(gameConfig);
