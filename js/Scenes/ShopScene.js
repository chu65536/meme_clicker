import { LocalStorageManager } from "../Managers/LocalStorageManager.js";
import config from "../Config.js";
import { Buttton } from "../UI/Button.js";
import { PassiveIncome } from "../PassiveIncome.js";

const UPGRADE_DEFS = [
  {
    id: "hands",
    name: "Strong Hands",
    description: "+1 coins per click",
    icon: "fist",
    baseCost: 25,
    costMultiplier: 1.15,
    effect: (state) => {
      state.coinsPerClick += 1;
    },
  },
  {
    id: "robot",
    name: "Robot Miner",
    description: "+1 coins per second",
    icon: "robot",
    baseCost: 50,
    costMultiplier: 1.18,
    effect: (state) => {
      state.coinsPerSecond += 1;
    },
  },
  {
    id: "chainsaw",
    name: "Chainsaw",
    description: "+5 coins per second",
    icon: "chainsaw",
    baseCost: 200,
    costMultiplier: 1.2,
    effect: (state) => {
      state.coinsPerSecond += 5;
    },
  },
  {
    id: "gun",
    name: "Gun",
    description: "+3 coins per click",
    icon: "gun",
    baseCost: 400,
    costMultiplier: 1.22,
    effect: (state) => {
      state.coinsPerClick += 3;
    },
  },
  {
    id: "factory",
    name: "Factory",
    description: "+25 coins per second",
    icon: "factory",
    baseCost: 1000,
    costMultiplier: 1.25,
    effect: (state) => {
      state.coinsPerSecond += 25;
    },
  },
  {
    id: "trollface",
    name: "Huh?",
    description: "x2 coins per click",
    icon: "troll",
    baseCost: 2500,
    costMultiplier: 1.3,
    effect: (state) => {
      state.coinsPerClick *= 2;
    },
  },
];

export class ShopScene extends Phaser.Scene {
  constructor() {
    super("ShopScene");
    this.rowHeight = 110;
    this.rowPadding = 12;
    this.shop_header_height = 100;
  }

  preload() {
    this.generatePlaceholderTextures();
  }

  generatePlaceholderTextures() {
    const iconSpecs = [
      { key: "icon_pickaxe", color: 0xd0a24c },
      { key: "icon_miner", color: 0x6fa8dc },
      { key: "icon_cart", color: 0xb5651d },
      { key: "icon_drill", color: 0x8e44ad },
      { key: "icon_factory", color: 0xe74c3c },
      { key: "icon_crystal", color: 0x1abc9c },
    ];
    iconSpecs.forEach((spec) => {
      if (this.textures.exists(spec.key)) return;
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(spec.color, 1);
      g.fillRoundedRect(0, 0, 64, 64, 12);
      g.lineStyle(3, 0xffffff, 0.4);
      g.strokeRoundedRect(1.5, 1.5, 61, 61, 12);
      g.generateTexture(spec.key, 64, 64);
      g.destroy();
    });
  }

  create() {
    const gameState = LocalStorageManager.loadGameState();
    const { width, height } = this.scale;
    const headerHeight = this.shop_header_height;
    const listContentHeight =
      UPGRADE_DEFS.length * (this.rowHeight + this.rowPadding) +
      this.rowPadding;
    const viewportHeight = height - headerHeight;
    this.maxScroll = Math.max(0, listContentHeight - viewportHeight);

    this.levels = gameState.levels;
    UPGRADE_DEFS.forEach((def) => {
      if (this.levels[def.id] === undefined) this.levels[def.id] = 0;
    });
    gameState.levels = this.levels;
    LocalStorageManager.updateGameState(gameState);

    this.#header();
    this.#scrollableListContainer();
    this.refreshAllRows();
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.refreshAllRows();
      },
    });
    PassiveIncome.init(this);
  }

  #header() {
    const { width, height } = this.scale;
    const headerHeight = this.shop_header_height;
    this.add
      .rectangle(0, 0, width, headerHeight, config.colors.shop_header)
      .setOrigin(0, 0)
      .setDepth(10);
    this.add
      .text(width / 2, 30, "SHOP", {
        fontSize: "54px",
        fill: "#ffffff",
        fontFamily: "doodle_font",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
        letterSpacing: 10,
      })
      .setOrigin(0.5)
      .setDepth(11);

    this.coinsText = this.add
      .text(width / 2, 80, "", {
        fontSize: "28px",
        fill: "#ffffff",
        fontFamily: "doodle_font",
        resolution: 2,
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
        letterSpacing: 3,
      })
      .setOrigin(0.5)
      .setDepth(11);

    const backButton = new Buttton(this, 0, 0, "close");
    backButton.object.setOrigin(0);
    backButton.object.setDepth(12);
    backButton.object.setScale(0.7);
    backButton.object.on("pointerup", () => {
      this.scene.start("MainScene");
    });
  }

  #scrollableListContainer() {
    const { width, height } = this.scale;
    const headerHeight = this.shop_header_height;
    this.listContainer = this.add.container(0, headerHeight);
    this.rowRefs = [];
    UPGRADE_DEFS.forEach((def, index) => {
      const rowY = index * (this.rowHeight + this.rowPadding) + this.rowPadding;
      this.buildUpgradeRow(def, rowY, width);
    });

    const listContentHeight =
      UPGRADE_DEFS.length * (this.rowHeight + this.rowPadding) +
      this.rowPadding;
    const viewportHeight = height - headerHeight;
    this.maxScroll = Math.max(0, listContentHeight - viewportHeight);

    this.input.on("wheel", (pointer, gameObjects, dx, dy) => {
      this.scrollList(dy * 0.6);
    });
  }

  buildUpgradeRow(def, y, width) {
    const rowContainer = this.add.container(0, y);
    const rowWidth = width - 24;
    const rowX = 12;

    const panel = this.add
      .rectangle(rowX, 0, rowWidth, this.rowHeight, config.colors.shop_header)
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
    this.coinsText.setText(
      `coins: ${Math.floor(gameState.coins)}   (+${gameState.coinsPerClick}/click, +${gameState.coinsPerSecond}/sec)`,
    );

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
    const headerHeight = this.shop_header_height;
    const currentOffset = this.listContainer.y - headerHeight;
    const newOffset = currentOffset - deltaY; // Invert because Y increases downward
    this.setListScrollPosition(newOffset);
  }

  setListScrollPosition(desiredOffset) {
    const headerHeight = this.shop_header_height;
    const clampedOffset = Phaser.Math.Clamp(desiredOffset, -this.maxScroll, 0);

    this.listContainer.y = headerHeight + clampedOffset;

    if (this.scrollThumb && this.maxScroll > 0) {
      const t = clampedOffset / this.maxScroll;
      this.scrollThumb.y = headerHeight + 8 + t * this.scrollThumbTravel;
    }
  }
}
