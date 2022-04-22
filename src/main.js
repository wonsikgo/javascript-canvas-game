"use strcit";

import Player from "./player.js";
import Projectile from "./projectile.js";
import Enemy from "./enemy.js";
import Particle from "./particle.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreEl = document.querySelector("#scoreEl");
const startGameBtn = document.querySelector("#startGameBtn");
const modalEl = document.querySelector("#modalEl");
const bigScoreEl = document.querySelector("#bigScoreEl");

const x = canvas.width / 2;
const y = canvas.height / 2;

let player = null;
let projectiles = [];
let enemies = [];
let particles = [];

function init() {
  player = new Player(c, x, y, 10, "white");
  projectiles = [];
  enemies = [];
  particles = [];
  score = 0;
  scoreEl.innerHTML = 0;
  bigScoreEl.innerHTML = 0;
}

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;

    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    enemies.push(new Enemy(c, x, y, radius, color, velocity));
  }, 1000);
}

let animationId;
let score = 0;

function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
  projectiles.forEach((projectile, index) => {
    projectile.update();

    // 화면의 끝에 도착하면 제거
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        console.log("화면 끝 도착 제거");
        projectiles.splice(index, 1);
      }, 0);
    }
  });
  enemies.forEach((enemy, index) => {
    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (dist - enemy.radius - player.radius - 1 < 1) {
      console.log("게임 종료");
      cancelAnimationFrame(animationId);

      bigScoreEl.innerHTML = score;
      modalEl.style.display = "flex";
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // 적 터치
      if (dist - enemy.radius - projectile.radius - 1 < 1) {
        for (let i = 0; i < enemy.radius; i++) {
          particles.push(
            new Particle(
              c,
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
          score += 100;
          scoreEl.innerHTML = score;

          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          console.log("적 제거");

          // 스코어 증가
          score += 250;
          scoreEl.innerHTML = score;

          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });
}

addEventListener("click", (e) => {
  const angle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(angle) * 4,
    y: Math.sin(angle) * 4,
  };
  projectiles.push(
    new Projectile(c, canvas.width / 2, canvas.height / 2, 5, "white", velocity)
  );
});

startGameBtn.addEventListener("click", () => {
  init();
  animate();
  spawnEnemies();
  modalEl.style.display = "none";
});
