import { LocalStorageManager } from "./Managers/LocalStorageManager.js";
import { Utils } from "./Utils/Utils.js";

export class ShopList {
  constructor(scene, x, y, width, height, items, options = {}) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.items = items;

    this.depth = options.depth ?? 0;
    this.getCurrency = options.getCurrency ?? (() => Infinity);
    this.onBuy = options.onBuy ?? (() => {});

    this.rowHeight = options.rowHeight ?? 90;
    this.rowPadding = options.rowPadding ?? 6;
    this.spriteSize = options.spriteSize ?? 64;

    this.scrollY = 0;
    this.rows = []; // references to each row's game objects for refresh()

    this.container = scene.add.container(x, y);
    this.container.setDepth(this.depth + 1);

    this._buildRows();
    this._buildMask();
    this._buildScrollInput();
  }

  _buildRows() {
    this.contentHeight = this.items.length * this.rowHeight;
    this.maxScroll = Math.max(0, this.contentHeight - this.height);

    this.items.forEach((item, i) => {
      const rowY = i * this.rowHeight;
      const row = this._buildRow(item, rowY);
      this.rows.push(row);
      this.container.add(row.objects);
    });
  }

  _buildRow(item, rowY) {
    const gameState = LocalStorageManager.loadGameState();
    const scene = this.scene;
    const rh = this.rowHeight - this.rowPadding;
    const objects = [];

    // Row background
    const bg = scene.add
      .rectangle(0, rowY, this.width, rh, 0xff991c)
      .setOrigin(0, 0)
      .setStrokeStyle(4, 0x000000);
    objects.push(bg);

    // Sprite / icon
    const spriteX = 10 + this.spriteSize / 2;
    const spriteY = rowY + rh / 2;
    const sprite = scene.add
      .sprite(spriteX, spriteY, item.sprite)
      .setDisplaySize(this.spriteSize, this.spriteSize);
    objects.push(sprite);

    const textX = 10 + this.spriteSize + 14;
    const textWidth = this.width - textX - 120; // leave room for cost + buy button

    // Name
    const nameText = scene.add.text(textX, rowY, this._nameLabel(item), {
      fontSize: "28px",
      fill: "#ffffff",
      fontFamily: "doge_sans",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 4,
      wordWrap: { width: textWidth },
    });
    objects.push(nameText);

    // Description
    const descText = scene.add.text(textX, rowY + 38, item.description ?? "", {
      fontSize: "20px",
      fill: "#000000",
      fontFamily: "doge_sans",
      fontStyle: "bold",
      wordWrap: { width: textWidth },
    });
    objects.push(descText);

    // Buy button
    const btnWidth = 90;
    const btnHeight = 34;
    const btnX = this.width - btnWidth - 12;
    const btnY = rowY + rh / 2 - btnHeight / 2;

    const btnBg = scene.add
      .rectangle(btnX, btnY, btnWidth, btnHeight, 0x3d8b3d)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true });
    const btnText = scene.add
      .text(
        btnX + btnWidth / 2,
        btnY + btnHeight / 2,
        Utils.truncateNumber(Utils.getItemCost(item)),
        {
          fontSize: "20px",
          fill: "#ffffff",
          fontFamily: "doge_sans",
          fontStyle: "bold",
          stroke: "#000000",
          strokeThickness: 4,
        },
      )
      .setOrigin(0.5);
    objects.push(btnBg, btnText);

    btnBg.on("pointerdown", () => {
      if (LocalStorageManager.loadGameState().coins >= Utils.getItemCost(item)) {
        this.onBuy(item);
      }
    });
    btnBg.on("pointerover", () => btnBg.setFillStyle(0x4fae4f));
    btnBg.on("pointerout", () =>
      this._updateAffordability(row ?? { item, btnBg, btnText }),
    );

    const row = {
      item,
      bg,
      sprite,
      nameText,
      descText,
      btnBg,
      btnText,
      objects,
    };
    this._updateAffordability(row);
    return row;
  }

  _nameLabel(item) {
    const itemLocalStorageData = LocalStorageManager.getItemData(item);
    return itemLocalStorageData.owned
      ? `${item.name} (x${itemLocalStorageData.owned})`
      : item.name;
  }

  _updateAffordability(row) {
    const gameState = LocalStorageManager.loadGameState()
    const affordable = gameState.coins >= Utils.getItemCost(row.item);
    row.btnBg.setFillStyle(affordable ? 0x3d8b3d : 0x555555);
    row.btnBg.setAlpha(affordable ? 1 : 0.6);
    row.btnText.setAlpha(affordable ? 1 : 0.6);
  }

  refresh() {
    this.rows.forEach((row) => {
      row.nameText.setText(this._nameLabel(row.item));
      row.btnText.setText(
        `${Utils.truncateNumber(Utils.getItemCost(row.item))}`,
      );
      this._updateAffordability(row);
    });
  }

  _buildMask() {
    const maskShape = this.scene.make.graphics();
    maskShape.setDepth(this.depth);
    maskShape.fillRect(this.x, this.y, this.width, this.height);
    const mask = maskShape.createGeometryMask();
    this.container.setMask(mask);
    this._maskShape = maskShape;
  }

  _buildScrollInput() {
    const scene = this.scene;

    // Interactive zone limits wheel/drag capture to the list's own bounds
    this.dragZone = scene.add
      .zone(this.x, this.y, this.width, this.height)
      .setOrigin(0, 0)
      .setInteractive();
    this.dragZone.setDepth(this.depth);

    this._onWheel = (pointer, gameObjects, deltaX, deltaY) => {
      if (!this._pointerInBounds(pointer)) return;
      this.scrollY = Phaser.Math.Clamp(
        this.scrollY + deltaY,
        0,
        this.maxScroll,
      );
      this.container.y = this.y - this.scrollY;
    };
    scene.input.on("wheel", this._onWheel);

    let dragStartY = 0;
    let containerStartY = 0;
    let dragging = false;

    this.dragZone.on("pointerdown", (pointer) => {
      dragging = true;
      dragStartY = pointer.y;
      containerStartY = this.container.y;
    });

    this._onPointerMove = (pointer) => {
      if (!dragging || !pointer.isDown) return;
      const dy = pointer.y - dragStartY;
      this.scrollY = Phaser.Math.Clamp(
        -(containerStartY + dy - this.y),
        0,
        this.maxScroll,
      );
      this.container.y = this.y - this.scrollY;
    };
    scene.input.on("pointermove", this._onPointerMove);

    this._onPointerUp = () => {
      dragging = false;
    };
    scene.input.on("pointerup", this._onPointerUp);
  }

  _pointerInBounds(pointer) {
    return (
      pointer.x >= this.x &&
      pointer.x <= this.x + this.width &&
      pointer.y >= this.y &&
      pointer.y <= this.y + this.height
    );
  }

  /** Clean up listeners when the list is no longer needed (e.g. scene shutdown). */
  destroy() {
    this.scene.input.off("wheel", this._onWheel);
    this.scene.input.off("pointermove", this._onPointerMove);
    this.scene.input.off("pointerup", this._onPointerUp);
    this.container.destroy();
    this.dragZone.destroy();
    this._maskShape.destroy();
  }
}
