import { CoinsUI } from "../UI/CoinsUI.js";
import { Button } from "../UI/Button.js";
import { LocalStorageManager } from "../Managers/LocalStorageManager.js";
import { Utils } from "../Utils/Utils.js";
import { AdsBanner } from "../UI/AdsBanner.js";

export class DonateScene extends Phaser.Scene {
  constructor() {
    super("DonateScene");
  }

  create() {
    const { width, height } = this.scale;

    this.coinsUi = new CoinsUI(this);

    // back button
    const backButtonAction = () => {
      this.scene.start("MainScene");
    };
    const backButton = new Button(this, 0, 0, "close", backButtonAction);
    backButton.object
      .setOrigin(0)
      .setScale(0.25)
      .setPosition(width - backButton.object.displayWidth, 0)
      .setDepth(this.depth);

    this.add
      .text(width / 2, height * 0.12, "Donations", {
        fontSize: "54px",
        fill: "#ffffff",
        fontFamily: "doge_sans",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 8,
        letterSpacing: 5,
      })
      .setOrigin(0.5);

    const packages = [
      {
        label: "Remove ads",
        desc: "A little something to say thanks",
        price: "$0.99",
        effect: (state) => {
          state.isAdsEnabled = false;
          this.adsBanner.destroy();
        },
      },
      {
        label: "Small coin pack (x1000)",
        desc: "Helps keep updates coming",
        price: "$1.99",
        effect: (state) => {
          state.coins += 1000;
        },
      },
      {
        label: "Medium coin pack (x10'000)",
        desc: "A generous boost for development",
        price: "$18.99",
        effect: (state) => {
          state.coins += 10000;
        },
      },
      {
        label: "Large coin pack (x100'000)",
        desc: "The ultimate show of support",
        price: "$179.99",
        effect: (state) => {
          state.coins += 100000;
        },
      },
    ];

    const cardW = width * 0.9;
    const cardH = 90;
    const gapY = cardH + 20;
    const startY = height * 0.3;
    const cardColor = 0xff991c;
    const tintedCardColor = 0xcc7a16;

    packages.forEach((pkg, i) => {
      const y = startY + i * gapY;

      const card = this.add
        .rectangle(width / 2, y, cardW, cardH, cardColor)
        .setStrokeStyle(4, 0x000000)
        .setInteractive();

      const leftX = width / 2 - cardW / 2 + 24;
      const rightX = width / 2 + cardW / 2 - 24;

      this.add
        .text(leftX, y - 20, pkg.label, {
          fontSize: "28px",
          fill: "#ffffff",
          fontFamily: "doge_sans",
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 4,
        })
        .setOrigin(0, 0.5);

      this.add
        .text(leftX, y + 12, pkg.desc, {
          fontSize: "20px",
          fill: "#000000",
          fontFamily: "doge_sans",
          fontStyle: "bold",
        })
        .setOrigin(0, 0.5);

      this.add
        .text(rightX, y, pkg.price, {
          fontSize: "28px",
          fill: "#ffffff",
          fontFamily: "doge_sans",
          resolution: 2,
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 4,
        })
        .setOrigin(1, 0.5);

      card.on("pointerover", () => (card.fillColor = tintedCardColor));
      card.on("pointerout", () => (card.fillColor = cardColor));
      card.on("pointerdown", () => this.purchase(pkg, card));
    });
    this.adsBanner = new AdsBanner(this);
  }

  purchase(pkg, card) {
    const gameState = LocalStorageManager.loadGameState();
    pkg.effect(gameState);
    LocalStorageManager.updateGameState(gameState);

    this.coinsUi.updateText(`${Utils.truncateNumber(gameState.coins)}`);
  }
}
