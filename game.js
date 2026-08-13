class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    // Load assets here
  }

  create() {
    // Add game objects here
    this.add
      .text(400, 300, "Hello Phaser!", {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(0.5);
  }

  update() {
    // Game loop here
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: MainScene,
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 300 } },
  },
};

const game = new Phaser.Game(config);
