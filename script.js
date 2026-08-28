/* =========================================================
   RAKSHA BANDHAN SURPRISE
   Made with ❤️ by Dhannu
========================================================= */

const $ = (id) => document.getElementById(id);

let sisterName = "";
let currentGame = 0;

const state = {
  game1: false,
  game2: false,
  game3: false,
  best1: 0,
  best2: 0,
  best3: 0
};

/* =========================================================
   SCREEN SYSTEM
========================================================= */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = $(id);

  if (!target) return;

  requestAnimationFrame(() => {
    target.classList.add("active");
  });
}

/* =========================================================
   GLASS CLICK EFFECT
========================================================= */

function createClickEffect(e) {
  const x = e.clientX;
  const y = e.clientY;

  const ripple = document.createElement("div");
  ripple.className = "ripple";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  $("rippleLayer").appendChild(ripple);

  setTimeout(() => ripple.remove(), 800);

  for (let i = 0; i < 14; i++) {
    const particle = document.createElement("div");

    particle.className = "click-particle";

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = 35 + Math.random() * 90;

    particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);

    $("rippleLayer").appendChild(particle);

    setTimeout(() => particle.remove(), 800);
  }
}

document.addEventListener("pointerdown", (e) => {
  if (
    e.target.closest(".glass-btn") ||
    e.target.closest(".small-glass-btn") ||
    e.target.closest(".back-btn")
  ) {
    createClickEffect(e);
  }
});

/* =========================================================
   REAL CANVAS PARTICLES
========================================================= */

const canvas = $("particleCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let width = 0;
let height = 0;

function resizeCanvas() {
  width = canvas.width = window.innerWidth * devicePixelRatio;
  height = canvas.height = window.innerHeight * devicePixelRatio;

  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  createParticles();
}

function createParticles() {
  particles = [];

  const count = window.innerWidth < 600 ? 55 : 90;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.2 + .5,
      speed: Math.random() * .25 + .08,
      drift: (Math.random() - .5) * .15,
      alpha: Math.random() * .45 + .12,
      pulse: Math.random() * Math.PI * 2
    });
  }
}

function animateParticles(time = 0) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach(p => {

    p.y -= p.speed;
    p.x += p.drift;

    p.pulse += .015;

    if (p.y < -10) {
      p.y = window.innerHeight + 10;
      p.x = Math.random() * window.innerWidth;
    }

    if (p.x < -10) p.x = window.innerWidth + 10;
    if (p.x > window.innerWidth + 10) p.x = -10;

    const alpha =
      p.alpha +
      Math.sin(p.pulse) * .12;

    const gradient = ctx.createRadialGradient(
      p.x,
      p.y,
      0,
      p.x,
      p.y,
      p.r * 5
    );

    gradient.addColorStop(0, `rgba(255,190,218,${Math.max(.05, alpha)})`);
    gradient.addColorStop(1, "rgba(255,80,150,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animateParticles();

/* =========================================================
   NAME
========================================================= */

$("confirmName").addEventListener("click", () => {

  const value = $("nameInput").value.trim();

  if (!value) {
    $("nameInput").animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-7px)" },
        { transform: "translateX(7px)" },
        { transform: "translateX(0)" }
      ],
      { duration: 350 }
    );
    return;
  }

  sisterName = value;

  $("welcomeName").textContent = sisterName;

  showScreen("welcomeScreen");
});

$("nameInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    $("confirmName").click();
  }
});

/* =========================================================
   INTRO
========================================================= */

$("toGameQuestion").addEventListener("click", () => {
  resetYesNo();
  showScreen("questionScreen");
});

/* =========================================================
   YES / NO
========================================================= */

const yesBtn = $("yesBtn");
const noBtn = $("noBtn");
const yesNoArea = $("yesNoArea");

let noClicks = 0;

const funnyMessages = [
  "Nice try 😂",
  "Nope! You can't escape 😭",
  "Try again 👀",
  "Why are you like this? 😂",
  "JUST PRESS YES 😭",
  "Okayyy... I know what you're doing."
];

function resetYesNo() {
  noClicks = 0;

  yesBtn.style.transform = "translateX(-50%) scale(1)";
  yesBtn.style.left = "50%";
  yesBtn.style.top = "25px";

  noBtn.style.left = "50%";
  noBtn.style.top = "110px";

  $("noMessage").textContent = "";
}

noBtn.addEventListener("click", (e) => {

  e.preventDefault();

  noClicks++;

  $("noMessage").textContent =
    funnyMessages[Math.min(noClicks - 1, funnyMessages.length - 1)];

  const areaRect = yesNoArea.getBoundingClientRect();

  const maxX = Math.max(10, areaRect.width - noBtn.offsetWidth - 10);
  const maxY = Math.max(10, areaRect.height - noBtn.offsetHeight - 10);

  const x = 10 + Math.random() * (maxX - 10);
  const y = 10 + Math.random() * (maxY - 10);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transform = "none";

  const scale = Math.min(1.65, 1 + noClicks * .12);

  yesBtn.style.transform =
    `translateX(-50%) scale(${scale})`;

  if (noClicks >= 5) {
    $("noMessage").textContent = "Okay, okay... YES is basically unavoidable now 😂";
  }
});

yesBtn.addEventListener("click", () => {

  showScreen("hubScreen");

  updateHub();
});

/* =========================================================
   HUB
========================================================= */

function updateHub() {

  $("best1").textContent = state.best1;
  $("best2").textContent = state.best2;
  $("best3").textContent = state.best3;

  const card2 = $("gameCard2");
  const card3 = $("gameCard3");

  if (state.game1) {
    card2.classList.remove("locked");
    card2.classList.add("unlocked");
  }

  if (state.game2) {
    card3.classList.remove("locked");
    card3.classList.add("unlocked");
  }

  if (state.game3) {
    card3.classList.remove("locked");
  }
}

document.querySelectorAll("[data-game]").forEach(btn => {

  btn.addEventListener("click", () => {

    const number = Number(btn.dataset.game);

    if (number === 2 && !state.game1) {
      shakeLocked("gameCard2");
      return;
    }

    if (number === 3 && !state.game2) {
      shakeLocked("gameCard3");
      return;
    }

    startGame(number);
  });
});

function shakeLocked(id) {

  const card = $(id);

  card.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-7px)" },
      { transform: "translateX(7px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(0)" }
    ],
    {
      duration: 400
    }
  );
}

/* =========================================================
   START GAME
========================================================= */

function startGame(number) {

  currentGame = number;

  $("game1").classList.add("hidden");
  $("game2").classList.add("hidden");
  $("game3").classList.add("hidden");

  $("liveScore").textContent = "0";

  if (number === 1) {
    $("currentGameLabel").textContent = "GAME 01";
    $("currentGameTitle").textContent = "Special Delivery";
    $("game1").classList.remove("hidden");
    startGame1();
  }

  if (number === 2) {
    $("currentGameLabel").textContent = "GAME 02";
    $("currentGameTitle").textContent = "Memory Vault";
    $("game2").classList.remove("hidden");
    startGame2();
  }

  if (number === 3) {
    $("currentGameLabel").textContent = "GAME 03";
    $("currentGameTitle").textContent = "Magic Reaction";
    $("game3").classList.remove("hidden");
    startGame3();
  }

  showScreen("gameScreen");
}

/* =========================================================
   GAME 1
========================================================= */

let game1Interval = null;
let game1Timer = null;
let game1Score = 0;
let game1Time = 30;
let game1Running = false;

function startGame1() {

  clearInterval(game1Interval);
  clearInterval(game1Timer);

  game1Score = 0;
  game1Time = 30;
  game1Running = true;

  $("timer1").textContent = game1Time;
  $("liveScore").textContent = "0";

  const arena = $("deliveryArena");
  arena.innerHTML = "";

  spawnGift();

  game1Interval = setInterval(() => {

    if (!game1Running) return;

    spawnGift();

    if (Math.random() > .45) {
      spawnDecoy();
    }

  }, 1100);

  game1Timer = setInterval(() => {

    game1Time--;

    $("timer1").textContent = game1Time;

    if (game1Time <= 0) {
      endGame1();
    }

  }, 1000);
}

function spawnGift() {

  if (!game1Running) return;

  const arena = $("deliveryArena");

  const gift = document.createElement("button");

  gift.className = "delivery-target";
  gift.textContent = "📦";

  const maxX = Math.max(5, arena.clientWidth - 75);
  const maxY = Math.max(5, arena.clientHeight - 75);

  gift.style.left = `${Math.random() * maxX}px`;
  gift.style.top = `${Math.random() * maxY}px`;

  gift.addEventListener("click", () => {

    if (!game1Running) return;

    game1Score += 10;

    $("liveScore").textContent = game1Score;

    gift.animate(
      [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(1.5)", opacity: 0 }
      ],
      {
        duration: 220
      }
    );

    createGameParticles(gift);

    setTimeout(() => gift.remove(), 220);
  });

  arena.appendChild(gift);

  setTimeout(() => {
    if (gift.isConnected) gift.remove();
  }, 1900);
}

function spawnDecoy() {

  const arena = $("deliveryArena");

  const decoy = document.createElement("div");

  decoy.className = "decoy";

  decoy.style.left =
    `${Math.random() * Math.max(5, arena.clientWidth - 50)}px`;

  decoy.style.top =
    `${Math.random() * Math.max(5, arena.clientHeight - 50)}px`;

  arena.appendChild(decoy);

  setTimeout(() => decoy.remove(), 1200);
}

function endGame1() {

  if (!game1Running) return;

  game1Running = false;

  clearInterval(game1Interval);
  clearInterval(game1Timer);

  $("deliveryArena").innerHTML = "";

  state.game1 = true;

  if (game1Score > state.best1) {
    state.best1 = game1Score;
  }

  showResult(
    "GAME 1 COMPLETE",
    "Delivery complete! 📦",
    `You scored ${game1Score} points.`,
    "A little gift seems to have arrived..."
  );
}

/* =========================================================
   GAME 2
========================================================= */

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let moves = 0;
let game2Timer = null;
let game2Time = 60;

const memorySymbols = ["🌸", "🎀", "⭐", "🎁"];

function startGame2() {

  clearInterval(game2Timer);

  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchedPairs = 0;
  moves = 0;
  game2Time = 60;

  $("moves").textContent = "0";
  $("timer2").textContent = game2Time;
  $("liveScore").textContent = "0";

  const deck = [...memorySymbols, ...memorySymbols]
    .sort(() => Math.random() - .5);

  const grid = $("memoryGrid");
  grid.innerHTML = "";

  deck.forEach((symbol, index) => {

    const card = document.createElement("div");

    card.className = "memory-card";

    card.dataset.symbol = symbol;

    card.innerHTML = `
      <div class="memory-inner">
        <div class="memory-front">✦</div>
        <div class="memory-back">${symbol}</div>
      </div>
    `;

    card.addEventListener("click", () => flipCard(card));

    grid.appendChild(card);
  });

  game2Timer = setInterval(() => {

    game2Time--;

    $("timer2").textContent = game2Time;

    if (game2Time <= 0) {
      endGame2(false);
    }

  }, 1000);
}

function flipCard(card) {

  if (
    lockBoard ||
    card === firstCard ||
    card.classList.contains("matched")
  ) {
    return;
  }

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;

  moves++;

  $("moves").textContent = moves;

  checkMatch();
}

function checkMatch() {

  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matchedPairs++;

    $("liveScore").textContent = matchedPairs * 25;

    createGameParticles(firstCard);

    resetMemoryTurn();

    if (matchedPairs === memorySymbols.length) {
      endGame2(true);
    }

  } else {

    lockBoard = true;

    setTimeout(() => {

      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");

      resetMemoryTurn();

    }, 700);
  }
}

function resetMemoryTurn() {

  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function endGame2(success) {

  clearInterval(game2Timer);

  if (!success) {

    showResult(
      "TIME'S UP",
      "Almost there! 🧠",
      `You found ${matchedPairs} of ${memorySymbols.length} pairs.`,
      "Let's give that memory another shot."
    );

    return;
  }

  state.game2 = true;

  const score = Math.max(100, 1000 - moves * 25);

  if (score > state.best2) {
    state.best2 = score;
  }

  $("liveScore").textContent = score;

  showResult(
    "GAME 2 COMPLETE",
    "Memory Master! 🧠✨",
    `Completed in ${moves} moves.`,
    "You've unlocked another little secret..."
  );
}

/* =========================================================
   GAME 3
========================================================= */

let game3Timer = null;
let game3Time = 20;
let game3Score = 0;
let game3Running = false;
let starMoveTimer = null;

function startGame3() {

  clearInterval(game3Timer);
  clearTimeout(starMoveTimer);

  game3Time = 20;
  game3Score = 0;
  game3Running = true;

  $("timer3").textContent = game3Time;
  $("liveScore").textContent = "0";

  positionStar();

  game3Timer = setInterval(() => {

    game3Time--;

    $("timer3").textContent = game3Time;

    if (game3Time <= 0) {
      endGame3();
    }

  }, 1000);
}

$("magicStar").addEventListener("click", () => {

  if (!game3Running) return;

  game3Score++;

  $("liveScore").textContent = game3Score;

  createGameParticles($("magicStar"));

  $("magicStar").animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(.72)" },
      { transform: "scale(1)" }
    ],
    {
      duration: 180
    }
  );

  positionStar();
});

function positionStar() {

  if (!game3Running) return;

  const arena = $("reactionArena");
  const star = $("magicStar");

  const padding = 15;

  const maxX = Math.max(
    padding,
    arena.clientWidth - star.offsetWidth - padding
  );

  const maxY = Math.max(
    padding,
    arena.clientHeight - star.offsetHeight - padding
  );

  const x =
    padding + Math.random() * Math.max(1, maxX - padding);

  const y =
    padding + Math.random() * Math.max(1, maxY - padding);

  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
}

function endGame3() {

  if (!game3Running) return;

  game3Running = false;

  clearInterval(game3Timer);
  clearTimeout(starMoveTimer);

  state.game3 = true;

  if (game3Score > state.best3) {
    state.best3 = game3Score;
  }

  showResult(
    "GAME 3 COMPLETE",
    "Magic Master! ✨",
    `You caught the star ${game3Score} times.`,
    "Okay... you've officially unlocked everything."
  );
}

/* =========================================================
   RESULT SCREEN
========================================================= */

let resultNextAction = null;

function showResult(eyebrow, title, score, text) {

  $("resultEyebrow").textContent = eyebrow;
  $("resultTitle").textContent = title;
  $("resultScore").textContent = score;
  $("resultText").textContent = text;

  showScreen("resultScreen");

  resultNextAction = () => {

    if (currentGame === 1) {
      showDelayScreen();
      return;
    }

    if (currentGame === 2) {
      showSurprise2();
      return;
    }

    if (currentGame === 3) {
      showFinalUnlock();
      return;
    }
  };
}

$("resultContinue").addEventListener("click", () => {

  if (typeof resultNextAction === "function") {
    resultNextAction();
  }
});

/* =========================================================
   GAME 1 DELAY
========================================================= */

function showDelayScreen() {

  showScreen("delayScreen");

  $("delayText").textContent = "";

  const text =
    "Thoda late ho gaya gift... Delivery wale ko laga tha ye normal gift hai, usse kya pata tha ki main poori website pack karke bhej raha hoon. 😂💗";

  let i = 0;

  const interval = setInterval(() => {

    $("delayText").textContent += text[i];

    i++;

    if (i >= text.length) {

      clearInterval(interval);

      setTimeout(() => {
        $("openSurprise1").classList.remove("hidden");
      }, 500);
    }

  }, 22);
}

$("openSurprise1").addEventListener("click", () => {

  $("surprise1Text").textContent =
    `${sisterName}, you've unlocked your first little surprise. 💗`;

  showScreen("surprise1Screen");

  createBigParticles();
});

$("surprise1Continue").addEventListener("click", () => {

  updateHub();

  showScreen("hubScreen");
});

/* =========================================================
   SURPRISE 2
========================================================= */

function showSurprise2() {

  showScreen("surprise2Screen");

  $("quoteReveal").classList.remove("animate");

  requestAnimationFrame(() => {
    $("quoteReveal").classList.add("animate");
  });
}

$("surprise2Continue").addEventListener("click", () => {

  updateHub();

  showScreen("hubScreen");
});

/* =========================================================
   FINAL UNLOCK
========================================================= */

function showFinalUnlock() {
  showScreen("finalUnlockScreen");
  createBigParticles();
}

$("openFinal").addEventListener("click", () => {

  $("finalName1").textContent = sisterName;
  $("finalName2").textContent = sisterName;
  $("finalName3").textContent = sisterName;
  $("finalName4").textContent = sisterName;

  showScreen("final1");
});

/* =========================================================
   FINAL SCENE NAVIGATION
========================================================= */

const finalScenes = [
  "final1",
  "final2",
  "final3",
  "final4",
  "final5",
  "final6"
];

document.querySelectorAll(".next-scene").forEach(button => {

  button.addEventListener("click", () => {

    const current = button.closest(".screen");

    const index = finalScenes.indexOf(current.id);

    if (index >= 0 && index < finalScenes.length - 1) {

      const next = finalScenes[index + 1];

      showScreen(next);

      if (next === "final5") {
        createBigParticles();
      }

      if (next === "final6") {
        createBigParticles();
        createBigParticles();
      }
    }
  });
});

/* =========================================================
   PARTICLE BURSTS
========================================================= */

function createGameParticles(element) {

  const rect = element.getBoundingClientRect();

  for (let i = 0; i < 10; i++) {

    const p = document.createElement("div");

    p.className = "click-particle";

    p.style.left =
      `${rect.left + rect.width / 2}px`;

    p.style.top =
      `${rect.top + rect.height / 2}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 60;

    p.style.setProperty(
      "--dx",
      `${Math.cos(angle) * distance}px`
    );

    p.style.setProperty(
      "--dy",
      `${Math.sin(angle) * distance}px`
    );

    $("rippleLayer").appendChild(p);

    setTimeout(() => p.remove(), 750);
  }
}

function createBigParticles() {

  for (let i = 0; i < 45; i++) {

    const p = document.createElement("div");

    p.className = "click-particle";

    p.style.left = `${window.innerWidth / 2}px`;
    p.style.top = `${window.innerHeight / 2}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 300;

    p.style.width = `${2 + Math.random() * 5}px`;
    p.style.height = p.style.width;

    p.style.setProperty(
      "--dx",
      `${Math.cos(angle) * distance}px`
    );

    p.style.setProperty(
      "--dy",
      `${Math.sin(angle) * distance}px`
    );

    $("rippleLayer").appendChild(p);

    setTimeout(() => p.remove(), 900);
  }
}

/* =========================================================
   BACK BUTTON
========================================================= */

$("backHub").addEventListener("click", () => {

  clearInterval(game1Interval);
  clearInterval(game1Timer);
  clearInterval(game2Timer);
  clearInterval(game3Timer);
  clearTimeout(starMoveTimer);

  game1Running = false;
  game3Running = false;

  updateHub();
  showScreen("hubScreen");
});
