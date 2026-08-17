import { LocalStorageManager } from "../Managers/LocalStorageManager.js";

export class AdsBanner {
  constructor(scene) {
    const gameState = LocalStorageManager.loadGameState();
    if (!gameState.isAdsEnabled) return;

    const { width, height } = scene.scale;
    const bannerH = 50;
    const bannerW = width / 2;
    this.banner = scene.add
      .rectangle(width / 2, height - bannerH / 2, bannerW, bannerH, 0xffffff)
      .setStrokeStyle(2, 0x000000)
      .setInteractive();

    this.text = scene.add
      .text(width / 2, height - bannerH / 2, "Your ad could be here.", {
        fontSize: "28px",
        fill: "#000000",
        fontFamily: "doge_sans",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }

  destroy() {
    this.text.destroy();
    this.banner.destroy();
  }
}
