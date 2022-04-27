"use strict";

import Circle from "./circle.js";

export default class Projectile extends Circle {
  constructor(canvas, x, y, radius, color, velocity) {
    super(canvas, x, y, radius, color);
    this.velocity = velocity;
  }

  update() {
    super.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
