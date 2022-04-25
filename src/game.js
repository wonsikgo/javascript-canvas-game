"use strict";

import Player from "./player.js";
import Projectile from "./projectile.js";
import Enemy from "./enemy.js";
import Particle from "./particle.js";

const PROJECTILE_COLOR = "white";
const PROJECTILE_RADIUS = 5;
const PROJECTILE_VELOCITY = 4;

const ENEMY_VELOCITY = 2;

export default class Game {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.c = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.startGameBtn = document.querySelector("#startGameBtn");
    this.modalEl = document.querySelector("#modalEl");
    this.scoreEl = document.querySelector("#scoreEl");
    this.bigScoreEl = document.querySelector("#bigScoreEl");

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;

    this.player = null;
    this.projectiles = [];
    this.enemies = [];
    this.particles = [];

    this.animationId = null;
    this.score = 0;

    this.addClickEvent();
  }

  init() {
    this.player = new Player(this.c, this.x, this.y, 10, "white");
    this.projectiles = [];
    this.enemies = [];
    this.particles = [];
    this.score = 0;
    this.scoreEl.innerHTML = "0";
    this.bigScoreEl.innerHTML = "0";
  }

  addClickEvent() {
    window.addEventListener("click", (e) => {
      // 1. x, y거리를 기반으로 각도 생성
      const angle = Math.atan2(
        e.clientY - this.canvas.height / 2,
        e.clientX - this.canvas.width / 2
      );

      // 2. x, y 속도 지정
      const velocity = {
        x: Math.cos(angle) * PROJECTILE_VELOCITY,
        y: Math.sin(angle) * PROJECTILE_VELOCITY,
      };
      this.projectiles.push(
        new Projectile(
          this.c,
          this.canvas.width / 2,
          this.canvas.height / 2,
          PROJECTILE_RADIUS,
          PROJECTILE_COLOR,
          velocity
        )
      );
    });
  }

  spawnEnemies() {
    setInterval(() => {
      const radius = this.getRandomNumber(30, 4);

      let x;
      let y;

      if (Math.random() < 0.5) {
        // x는 가장 왼쪽 or 오른쪽 끝부분 지정
        x = Math.random() < 0.5 ? 0 - radius : this.canvas.width + radius;
        y = Math.random() * this.canvas.height;
      } else {
        // y는 가장 위쪽 or 아래쪽 끝부분 지정
        x = Math.random() * this.canvas.width;
        y = Math.random() < 0.5 ? 0 - radius : this.canvas.height + radius;
      }
      const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

      // 가운데로 향하게 만드는 각도 지정
      const angle = Math.atan2(
        this.canvas.height / 2 - y,
        this.canvas.width / 2 - x
      );
      const velocity = {
        x: Math.cos(angle) * ENEMY_VELOCITY,
        y: Math.sin(angle) * ENEMY_VELOCITY,
      };
      this.enemies.push(new Enemy(this.c, x, y, radius, color, velocity));
    }, 1000);
  }

  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.reDraw();
    this.updateParticle();
    this.removeProjectile();
    this.updateEnemy();
  };

  showPopup() {
    this.modalEl.style.display = "flex";
  }
  hidePopup() {
    this.modalEl.style.display = "none";
  }

  getRandomNumber(max, min) {
    return Math.random() * (max - min) + min;
  }

  reDraw() {
    this.c.fillStyle = "rgba(0, 0, 0, 0.1)";
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.draw();
  }

  updateParticle() {
    this.particles.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        this.particles.splice(index, 1);
      } else {
        particle.update();
      }
    });
  }

  removeProjectile() {
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
  }

  updateEnemy() {
    this.enemies.forEach((enemy, enemyIndex) => {
      enemy.update();
      this.endGame(enemy);

      this.projectiles.forEach((projectile, projectileIndex) => {
        // Math.hypot 제곱의 합의 제곱근을 반환, 적과 발사체의 거리
        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

        // 적 터치
        if (dist - enemy.radius - projectile.radius - 1 < 1) {
          this.createParticle(projectile, enemy);
          this.updateGameState(enemy, enemyIndex, projectileIndex);
        }
      });
    });
  }

  endGame(enemy) {
    const dist = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);

    if (dist - enemy.radius - this.player.radius - 1 < 1) {
      console.log("게임 종료");
      cancelAnimationFrame(this.animationId);

      this.bigScoreEl.innerHTML = this.score;
      this.showPopup();
    }
  }

  createParticle(projectile, enemy) {
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
  }

  updateGameState(enemy, enemyIndex, projectileIndex) {
    if (enemy.radius - 10 > 5) {
      // 스코어 증가
      this.score += 100;
      this.scoreEl.innerHTML = this.score;

      // 적 크기 감소
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

      // 비동기 적용
      setTimeout(() => {
        this.enemies.splice(enemyIndex, 1);
        this.projectiles.splice(projectileIndex, 1);
      }, 0);
    }
  }
}
