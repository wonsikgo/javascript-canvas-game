"use strict";

const friction = 0.99;

export default class Particle {
  constructor(canvas, x, y, radius, color, velocity) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    this.canvas.save();
    this.canvas.globalAlpha - this.alpha;
    this.canvas.beginPath();
    this.canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.canvas.fillStyle = this.color;
    this.canvas.fill();
    this.canvas.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}
