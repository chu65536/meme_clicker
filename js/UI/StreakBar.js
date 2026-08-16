export class StreakBar {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {object} [options]
   * @param {number} [options.width=300]
   * @param {number} [options.height=24]
   * @param {number} [options.bgColor=0x222222]
   * @param {number} [options.borderColor=0xffffff]
   * @param {number} [options.borderWidth=2]
   * @param {number} [options.radius=6]
   * @param {boolean} [options.showText=true]
   */
  constructor(scene, x, y, options = {}) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.width = options.width ?? 300;
    this.height = options.height ?? 24;
    this.bgColor = options.bgColor ?? 0x222222;
    this.borderColor = options.borderColor ?? 0xffffff;
    this.borderWidth = options.borderWidth ?? 2;
    this.radius = options.radius ?? 6;
    this.showText = options.showText ?? true;

    this._progress = 0;

    // Unique texture key so multiple bars don't clash
    this.textureKey = `progressbar-gradient-${Phaser.Math.RND.uuid()}`;

    this._createGradientTexture();
    this._createDisplayObjects();
    this.setProgress(0);
  }

  // Build the yellow -> orange -> red gradient once, as a texture
  _createGradientTexture() {
    const w = this.width;
    const h = this.height;

    const canvasTexture = this.scene.textures.createCanvas(this.textureKey, w, h);
    const ctx = canvasTexture.getContext();

    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, '#ffe400');   // yellow
    gradient.addColorStop(0.5, '#ff8c00'); // orange (middle)
    gradient.addColorStop(1, '#ff1a1a');   // red (end)

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    canvasTexture.refresh();
  }

  _createDisplayObjects() {
    this.container = this.scene.add.container(this.x, this.y);

    // Background track
    this.bg = this.scene.add.graphics();
    this._drawBackground();

    // Gradient fill sprite (top-left origin so crop math is simple)
    this.fillSprite = this.scene.add.image(0, 0, this.textureKey);
    this.fillSprite.setOrigin(0, 0);
    this.fillSprite.setPosition(-this.width / 2, -this.height / 2);

    // Border on top
    this.border = this.scene.add.graphics();
    this._drawBorder();

    this.container.add([this.bg, this.fillSprite, this.border]);

    if (this.showText) {
      this.text = this.scene.add.text(0, 0, '0%', {
        fontSize: `${Math.floor(this.height * 0.7)}px`,
        fontFamily: 'Arial',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.container.add(this.text);
    }
  }

  _drawBackground() {
    this.bg.clear();
    this.bg.fillStyle(this.bgColor, 1);
    this.bg.fillRoundedRect(
      -this.width / 2, -this.height / 2,
      this.width, this.height,
      this.radius
    );
  }

  _drawBorder() {
    this.border.clear();
    this.border.lineStyle(this.borderWidth, this.borderColor, 1);
    this.border.strokeRoundedRect(
      -this.width / 2, -this.height / 2,
      this.width, this.height,
      this.radius
    );
  }

  /**
   * Set progress instantly.
   * @param {number} value 0..1
   */
  setProgress(value) {
    this._progress = Phaser.Math.Clamp(value, 0, 1);
    const cropWidth = Math.max(0, Math.floor(this.width * this._progress));
    this.fillSprite.setCrop(0, 0, cropWidth, this.height);

    if (this.text) {
      this.text.setText(`${Math.round(this._progress * 100)}%`);
    }
    return this;
  }

  getProgress() {
    return this._progress;
  }

  /**
   * Animate to a progress value.
   * @param {number} value 0..1
   * @param {number} [duration=400]
   * @param {string} [ease='Sine.easeOut']
   * @param {Function} [onComplete]
   */
  tweenTo(value, duration = 400, ease = 'Sine.easeOut', onComplete) {
    const target = { p: this._progress };
    const clamped = Phaser.Math.Clamp(value, 0, 1);

    this.scene.tweens.add({
      targets: target,
      p: clamped,
      duration,
      ease,
      onUpdate: () => this.setProgress(target.p),
      onComplete: () => onComplete && onComplete(),
    });
    return this;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.container.setPosition(x, y);
    return this;
  }

  setVisible(visible) {
    this.container.setVisible(visible);
    return this;
  }

  destroy() {
    this.container.destroy();
    if (this.scene.textures.exists(this.textureKey)) {
      this.scene.textures.remove(this.textureKey);
    }
  }
}