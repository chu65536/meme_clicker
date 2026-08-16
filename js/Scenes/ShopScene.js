import { LocalStorageManager } from "../Managers/LocalStorageManager.js";
import config from "../Config.js";
import { Button } from "../UI/Button.js";
import { ShopList } from "../ShopList.js";
import { SHOP_ITEMS } from "../ShopItems.js";
import { Utils } from "../Utils/Utils.js";

export class ShopScene extends Phaser.Scene {
  constructor() {
    super("ShopScene");
    this.rowHeight = 110;
    this.rowPadding = 12;
    this.shopHeaderHeight = 100;
    this.headerColor = 0xa35a00;
    this.depth = 2;
  }

  preload() {
    this.load.image("close", "assets/sprites/close.png");
    this.load.image("crypto_coin", "assets/sprites/crypto_coin.png");
  }

  create() {
    const gameState = LocalStorageManager.loadGameState();
    // const { width, height } = this.scale;
    // const headerHeight = this.shopHeaderHeight;
    // const listContentHeight =
    //   UPGRADE_DEFS.length * (this.rowHeight + this.rowPadding) +
    //   this.rowPadding;
    // const viewportHeight = height - headerHeight;
    // this.maxScroll = Math.max(0, listContentHeight - viewportHeight);

    // this.levels = gameState.levels;
    // UPGRADE_DEFS.forEach((def) => {
    //   if (this.levels[def.id] === undefined) this.levels[def.id] = 0;
    // });
    // gameState.levels = this.levels;
    // LocalStorageManager.updateGameState(gameState);

    this.#header();
    this.#scrollableListContainer();
    this.refreshUi();
    // this.refreshAllRows();
    // this.time.addEvent({
    //   delay: 1000,
    //   loop: true,
    //   callback: () => {
    //     this.refreshAllRows();
    //   },
    // });
    // PassiveIncome.init(this);
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
          item.effect(gameState)
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
      `+${gameState.coinsPerClick}/click, +${gameState.coinsPerSecond}/sec`,
    );
    this.score.setText(`${Utils.truncateNumber(gameState.coins)}`);
  }

  buildUpgradeRow(def, y, width) {
    const rowContainer = this.add.container(0, y);
    const rowWidth = width - 24;
    const rowX = 12;

    const panel = this.add
      .rectangle(rowX, 0, rowWidth, this.rowHeight, this.headerColor)
      .setOrigin(0, 0)
      .setStrokeStyle(3, 0x000000);
    rowContainer.add(panel);

    const icon = this.add
      .image(rowX + 40, this.rowHeight / 2, def.icon)
      .setDisplaySize(56, 56);
    rowContainer.add(icon);

    const nameText = this.add.text(rowX + 80, 10, def.name, {
      fontSize: "22px",
      fill: "#ffffff",
      fontFamily: "doodle_font",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 4,
      letterSpacing: 5,
    });
    rowContainer.add(nameText);

    const descText = this.add.text(rowX + 80, 50, def.description, {
      fontSize: "18px",
      fill: "#000000",
      fontFamily: "doodle_font",
      fontStyle: "bold",
      letterSpacing: 3,
    });
    rowContainer.add(descText);

    const levelText = this.add.text(rowX + 80, 80, "", {
      fontSize: "14px",
      fill: "#ffffff",
      fontFamily: "doodle_font",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 4,
      letterSpacing: 4,
    });
    rowContainer.add(levelText);

    const costText = this.add
      .text(rowX + 40, this.rowHeight - 25, "", {
        fontSize: "18px",
        fill: "#000000",
        fontFamily: "doodle_font",
        fontStyle: "bold",
        letterSpacing: 1,
      })
      .setOrigin(0.5, 0);
    rowContainer.add(costText);

    const buttonWidth = 90;
    const buttonHeight = 40;
    const buttonX = rowWidth - buttonWidth - 8;
    const buttonY = (this.rowHeight - buttonHeight) / 2;

    const buyButton = this.add
      .rectangle(buttonX, buttonY, buttonWidth, buttonHeight, 0x3d8b40)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true });
    rowContainer.add(buyButton);

    const buyText = this.add
      .text(buttonX + buttonWidth / 2, buttonY + buttonHeight / 2, "BUY", {
        fontSize: "28px",
        fill: "#ffffff",
        fontFamily: "doodle_font",
        fontStyle: "bold",
        letterSpacing: 8,
      })
      .setOrigin(0.5);
    rowContainer.add(buyText);

    buyButton.on("pointerover", () => {
      if (!buyButton.disabled) buyButton.setFillStyle(0x4caf50);
    });
    buyButton.on("pointerout", () => {
      if (!buyButton.disabled) buyButton.setFillStyle(0x3d8b40);
    });
    buyButton.on("pointerdown", () => this.attemptPurchase(def));

    this.listContainer.add(rowContainer);

    this.rowRefs.push({ def, costText, buyButton, buyText, levelText, panel });
  }

  getCurrentCost(def) {
    const level = this.levels[def.id];
    return Math.ceil(def.baseCost * Math.pow(def.costMultiplier, level));
  }

  attemptPurchase(def) {
    const cost = this.getCurrentCost(def);
    const gameState = LocalStorageManager.loadGameState();
    if (gameState.coins < cost) {
      this.flashInsufficientFunds(def);
      return;
    }
    console.log("!!!");
    gameState.coins -= cost;
    this.levels[def.id] += 1;
    def.effect(gameState);
    gameState.levels = this.levels;
    this.refreshAllRows();
    LocalStorageManager.updateGameState(gameState);
  }

  flashInsufficientFunds(def) {
    const row = this.rowRefs.find((r) => r.def.id === def.id);
    if (!row) return;
    this.tweens.add({
      targets: row.panel,
      alpha: 0.4,
      duration: 80,
      yoyo: true,
      repeat: 1,
    });
  }

  refreshAllRows() {
    const gameState = LocalStorageManager.loadGameState();

    // stats

    this.rowRefs.forEach((row) => {
      const cost = this.getCurrentCost(row.def);
      const level = this.levels[row.def.id];
      row.costText.setText(`cost: ${cost}`);
      row.levelText.setText(`LVL: ${level}`);

      const affordable = gameState.coins >= cost;
      row.buyButton.disabled = !affordable;
      row.buyButton.setFillStyle(affordable ? 0x3d8b40 : 0x555555);
      row.buyText.setColor(affordable ? "#ffffff" : "#999999");
      row.buyButton.input.cursor = affordable ? "pointer" : "default";
    });
  }

  scrollList(deltaY) {
    const headerHeight = this.shopHeaderHeight;
    const currentOffset = this.listContainer.y - headerHeight;
    const newOffset = currentOffset - deltaY; // Invert because Y increases downward
    this.setListScrollPosition(newOffset);
  }

  setListScrollPosition(desiredOffset) {
    const headerHeight = this.shopHeaderHeight;
    const clampedOffset = Phaser.Math.Clamp(desiredOffset, -this.maxScroll, 0);

    this.listContainer.y = headerHeight + clampedOffset;

    if (this.scrollThumb && this.maxScroll > 0) {
      const t = clampedOffset / this.maxScroll;
      this.scrollThumb.y = headerHeight + 8 + t * this.scrollThumbTravel;
    }
  }
}
