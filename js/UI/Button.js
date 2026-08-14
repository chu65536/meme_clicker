export class Buttton {
  constructor(scene, x, y, sprite) {
    this.button = scene.add.image(x, y, sprite).setInteractive();
    this.button
      .on("pointerover", () => {
        this.button.setTint(0xaaaaaa);
      })
      .on("pointerout", () => {
        this.button.clearTint();
      });
  }

  get object() {
    return this.button;
  }
}
