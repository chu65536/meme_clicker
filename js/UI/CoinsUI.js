import { LocalStorageManager } from "../Managers/LocalStorageManager.js";
import { Utils } from "../Utils/Utils.js";
import { Button } from "./Button.js";

export class CoinsUI {
  constructor(scene, depth = 0) {
    const gameState = LocalStorageManager.loadGameState();
    const xOffset = 10;
    const yOffset = 5;

    const donateButtonAction = () => {
      scene.scene.start("DonateScene");
    };
    const donateButton = new Button(
      scene,
      xOffset,
      yOffset,
      "plus",
      donateButtonAction,
    );
    donateButton.object.setScale(0.015).setOrigin(0).setDepth(depth);

    const coinSprite = scene.add
      .sprite(xOffset + donateButton.object.displayWidth, 0, "coin")
      .setOrigin(0)
      .setScale(0.045)
      .setDepth(depth);
    this.score = scene.add
      .text(
        xOffset + donateButton.object.displayWidth + coinSprite.displayWidth,
        yOffset,
        `${Utils.truncateNumber(gameState.coins)}`,
        {
          fontSize: "34px",
          fill: "#ffffff",
          fontFamily: "doge_sans",
          resolution: 2,
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 4,
        },
      )
      .setOrigin(0)
      .setDepth(depth);
  }

  updateText(text) {
    this.score.setText(text);
  }
}
