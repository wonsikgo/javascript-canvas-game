"use strict";

export default class Projectile {
  constructor(canvas, x, y, radius, color, velocity) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    this.canvas.beginPath();
    this.canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.canvas.fillStyle = this.color;
    this.canvas.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
