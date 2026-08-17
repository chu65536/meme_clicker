export class WinScene extends Phaser.Scene {
  constructor() {
    super("WinScene");
  }

  create() {
    const { width, height } = this.scale;
    const yOffset = 30;

    this.add
      .text(width / 2, height / 2 - yOffset, "Congratulations!", {
        fontSize: "54px",
        fill: "#ffffff",
        fontFamily: "doge_sans",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + yOffset, "Doge community is proud of you", {
        fontSize: "27px",
        fill: "#000000",
        fontFamily: "doge_sans",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }
}
