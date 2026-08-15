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
};

const game = new Phaser.Game(gameConfig);