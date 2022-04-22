"use strict";

import Player from "./player.js";
import Projectile from "./projectile.js";
import Enemy from "./enemy.js";
import Particle from "./particle.js";

export default class Game {
  constrcutor() {
    this.canvas = document.querySelector("canvas");
    this.c = canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.startGameBtn = document.querySelector("#startGameBtn");
    this.modalEl = document.querySelector("#modalEl");
    this.scoreEl = document.querySelector("#scoreEl");
    this.bigScoreEl = document.querySelector("#bigScoreEl");

    this.x = canvas.width / 2;
    this.y = canvas.height / 2;

    this.player = null;
    this.projectiles = [];
    this.enemies = [];
    this.particles = [];

    this.animationId;
    this.score = 0;

    this.addClickEvent();
  }

  init() {
    this.player = new Player(c, x, y, 10, "white");
    this.projectiles = [];
    this.enemies = [];
    this.particles = [];
    this.score = 0;
    this.scoreEl.innerHTML = 0;
    this.bigScoreEl.innerHTML = 0;
  }

  addClickEvent() {
    window.addEventListener("click", (e) => {
      const angle = Math.atan2(
        e.clientY - this.canvas.height / 2,
        e.clientX - this.canvas.width / 2
      );
      const velocity = {
        x: Math.cos(angle) * 4,
        y: Math.sin(angle) * 4,
      };
      projectiles.push(
        new Projectile(
          this.c,
          this.canvas.width / 2,
          this.canvas.height / 2,
          5,
          "white",
          velocity
        )
      );
    });
  }

  spawnEnemies() {
    setInterval(() => {
      const radius = Math.random() * (30 - 4) + 4;

      let x;
      let y;

      if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : this.canvas.width + radius;
        y = Math.random() * this.canvas.height;
      } else {
        x = Math.random() * this.canvas.width;
        y = Math.random() < 0.5 ? 0 - radius : this.canvas.height + radius;
      }
      const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

      const angle = Math.atan2(
        this.canvas.height / 2 - y,
        this.canvas.width / 2 - x
      );
      const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
      this.enemies.push(new Enemy(c, x, y, radius, color, velocity));
    }, 1000);
  }

  animate() {
    this.animationId = requestAnimationFrame(this.animate);
    this.c.fillStyle = "rgba(0, 0, 0, 0.1)";
    this.c.fillRect(0, 0, canvas.width, canvas.height);
    this.player.draw();
    this.particles.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        particles.splice(index, 1);
      } else {
        particle.update();
      }
    });
    this.projectiles.forEach((projectile, index) => {
      projectile.update();

      // 화면의 끝에 도착하면 제거
      if (
        projectile.x + projectile.radius < 0 ||
        projectile.x - projectile.radius > this.canvas.width ||
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > this.canvas.height
      ) {
        setTimeout(() => {
          console.log("화면 끝 도착 제거");
          this.projectiles.splice(index, 1);
        }, 0);
      }
    });
    this.enemies.forEach((enemy, index) => {
      enemy.update();

      const dist = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);

      if (dist - enemy.radius - this.player.radius - 1 < 1) {
        console.log("게임 종료");
        cancelAnimationFrame(this.animationId);

        this.bigScoreEl.innerHTML = this.score;
        this.modalEl.style.display = "flex";
      }

      this.projectiles.forEach((projectile, projectileIndex) => {
        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

        // 적 터치
        if (dist - enemy.radius - projectile.radius - 1 < 1) {
          for (let i = 0; i < enemy.radius; i++) {
            this.particles.push(
              new Particle(
                this.c,
                projectile.x,
                projectile.y,
                Math.random() * 2,
                enemy.color,
                {
                  x: (Math.random() - 0.5) * (Math.random() * 8),
                  y: (Math.random() - 0.5) * (Math.random() * 8),
                }
              )
            );
          }

          if (enemy.radius - 10 > 5) {
            // 스코어 증가
            this.score += 100;
            this.scoreEl.innerHTML = this.score;

            gsap.to(enemy, {
              radius: enemy.radius - 10,
            });
            setTimeout(() => {
              this.projectiles.splice(projectileIndex, 1);
            }, 0);
          } else {
            console.log("적 제거");

            // 스코어 증가
            this.score += 250;
            this.scoreEl.innerHTML = this.score;

            setTimeout(() => {
              this.enemies.splice(index, 1);
              this.projectiles.splice(projectileIndex, 1);
            }, 0);
          }
        }
      });
    });
  }
}
