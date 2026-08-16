import { LocalStorageManager } from "../Managers/LocalStorageManager.js";
import config from "../Config.js";
import { Button } from "../UI/Button.js";
import { ShopList } from "../ShopList.js";
import { SHOP_ITEMS } from "../ShopItems.js";
import { Utils } from "../Utils/Utils.js";

export class ShopScene extends Phaser.Scene {
  constructor() {
    super("ShopScene");
    this.shopHeaderHeight = 100;
    this.headerColor = 0xa35a00;
    this.depth = 2;
  }

  create() {
    this.#header();
    this.#scrollableListContainer();
    this.refreshUi();
  }

  #header() {
    const { width, height } = this.scale;
    const headerHeight = this.shopHeaderHeight;
    const gameState = LocalStorageManager.loadGameState();
    // background
    this.add
      .rectangle(0, 0, width, headerHeight, this.headerColor)
      .setOrigin(0, 0)
      .setDepth(this.depth);

    // coins
    const coinSprite = this.add
      .sprite(0, 0, "coin")
      .setOrigin(0)
      .setScale(0.035)
      .setDepth(this.depth);
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
      .setOrigin(0)
      .setDepth(this.depth);

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

    // shop text
    this.add
      .text(width / 2, 30, "SHOP", {
        fontSize: "54px",
        fill: "#ffffff",
        fontFamily: "doge_sans",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 8,
        letterSpacing: 5,
      })
      .setOrigin(0.5)
      .setDepth(this.depth);

    // stats
    this.coinsText = this.add
      .text(width / 2, 80, "", {
        fontSize: "28px",
        fill: "#ffffff",
        fontFamily: "doge_sans",
        resolution: 2,
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
        letterSpacing: 3,
      })
      .setOrigin(0.5)
      .setDepth(this.depth);
  }

  #scrollableListContainer() {
    const { width, height } = this.scale;
    const gameState = LocalStorageManager.loadGameState();

    const rowHeight = 100;
    const shop = new ShopList(
      this,
      0,
      rowHeight,
      width,
      height - rowHeight,
      SHOP_ITEMS,
      {
        depth: 0,
        rowHeight: rowHeight,
        rowPadding: 0,
        getCurrency: () => gameState.coins,
        onBuy: (item) => {
          gameState.coins -= Utils.getItemCost(item);
          const itemRef = gameState.items.find((it) => it.id === item.id);
          itemRef.owned++;
          item.effect(gameState);
          LocalStorageManager.updateGameState(gameState);
          shop.refresh();
          this.refreshUi();
        },
      },
    );
  }

  refreshUi() {
    const gameState = LocalStorageManager.loadGameState();
    this.coinsText.setText(
      `+${Utils.truncateNumber(gameState.coinsPerClick)}/click, +${Utils.truncateNumber(gameState.coinsPerSecond)}/sec`,
    );
    this.score.setText(`${Utils.truncateNumber(gameState.coins)}`);
  }
}
