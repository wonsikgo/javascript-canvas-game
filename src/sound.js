const bgm = new Audio("../static/sound/MP_Waterfall.mp3");
const gameEndSound = new Audio("../static/sound/MP_티모 웃음소리-1.mp3");

/* 
    Thanks to, Mike Koenig
    From: http://soundbible.com/107-Bomb-Explosion-1.html

    Distributor: 저작권 걱정없는 유튜브용 음원 & 무료 효과음 서비스 ‘뮤팟’
    https://www.mewpot.com

*/
const bombSound = new Audio("../static/sound/MP_Bomb Explosion 1.mp3");

/* 
    Thanks to, Mike Koenig
    From: http://soundbible.com/1875-Bullet-Whizzing-By.html

    Distributor: 저작권 걱정없는 유튜브용 음원 & 무료 효과음 서비스 ‘뮤팟’
    https://www.mewpot.com
 */
const shootingSound = new Audio("../static/sound/MP_Bullet Whizzing By.mp3");

export function playBgm() {
  bgm.loop = true;
  bgm.volume = 0.7;
  playSound(bgm);
}

export function playEndGame() {
  playSound(gameEndSound);
}

export function playBomb() {
  playSound(bombSound);
}

export function playShooting() {
  playSound(shootingSound);
}

export function stopBgm() {
  stopSound(bgm);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}
