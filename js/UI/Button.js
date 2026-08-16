export class Button {
  constructor(scene, x, y, sprite, action) {
    this.button = scene.add.image(x, y, sprite).setInteractive();
    this.button
      .on("pointerover", () => {
        this.button.setTint(0xaaaaaa);
      })
      .on("pointerout", () => {
        this.button.clearTint();
      })
      .on("pointerup", action);
  }

  get object() {
    return this.button;
  }
}
