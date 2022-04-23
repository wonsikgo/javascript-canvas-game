"use strcit";

import Game from "./game.js";

const game = new Game();

const startGameBtn = document.querySelector("#startGameBtn");

startGameBtn.addEventListener("click", () => {
  game.init();
  game.animate();
  game.spawnEnemies();
  game.hidePopup();
});
