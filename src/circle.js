"use strict";

export default class Circle {
  constructor(canvas, x, y, radius, color) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    this.canvas.beginPath();
    this.canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.canvas.fillStyle = this.color;
    this.canvas.fill();
  }
}
