"use strict";

import Circle from "./circle.js";

const FRICTION = 0.99;

export default class Particle extends Circle {
  constructor(canvas, x, y, radius, color, velocity) {
    super(canvas, x, y, radius, color);
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    this.canvas.save();
    this.canvas.globalAlpha - this.alpha;
    super.draw();
    this.canvas.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= FRICTION;
    this.velocity.y *= FRICTION;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}
