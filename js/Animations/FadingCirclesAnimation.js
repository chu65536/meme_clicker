import config from "../Config.js";

export class FadingCirclesAnimation {
  constructor() {
    this.circles = [];
    this.count = 10;
    this.thickness = 100;
    this.speed = 0.1;

    const x = config.game.width / 2;
    const y = config.game.height / 2;
    for (let i = 0; i < this.count; i += 1) {
      const r = (i * config.game.width) / 2 / this.count;

      const current = { x: x, y: y, r: r };
      this.circles.push(current);
    }
  }
  anim(graphics) {
    this.circles.forEach((circle) => {
      const opacity = 1 - circle.r / (config.game.width / 2);
      graphics.lineStyle(this.thickness / 2, 0xffef00, opacity);
      graphics.strokeCircle(circle.x, circle.y, circle.r);
      circle.r += this.speed;
      if (circle.r >= config.game.width / 2) {
        circle.r = 0;
      }
    });
  }
}
