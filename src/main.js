"use strcit";

import GameBuilder from "./game.js";

const game = new GameBuilder()
  .playColor("white") //
  .gameLevel(1)
  .build();

const startGameBtn = document.querySelector("#startGameBtn");

startGameBtn.addEventListener("click", () => {
  game.init();
  game.animate();
  game.spawnEnemies();
  game.hidePopup();
});
