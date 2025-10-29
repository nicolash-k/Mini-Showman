let cards = [];
let firstCard = null;
let secondCard = null;

let lives;
let totalLives;
let gameOver = false;
let gameWon = false;

let difficulties = ["Fácil", "Medio", "Difícil"];
let selectedDifficulty = 0;

let inMenu = true;
let checking = false;
let checkStartTime = 0;
let checkDelay = 900;

let revealStartTime = 0;
let revealDuration = 5000;
let revealing = false;

let backButton;
let showTutorial = false;

let spacing = 20;
let cardSize;
let cols, rows;
let gridOffsetX, gridOffsetY;

let allEmojis = [
  "🎲","🎰","🃏","🍒","💎","💰","🎶","♠️","♥️","♦️","♣️",
  "⭐","🔥","⚡","🌙","☀️","🍀","🍎","🍌","🍇",
  "🐱","🐶","🐸","🐵","🐧","🐢","🐠","🐙","🦋",
  "🚗","✈️","🚀","🚲","🏆","🥇","🎨","🎧","🎤",
  "🍩","🍔","🍕","🍟","🌮","🍣","🍪","🥑","🥕","🥦"
];

let idUsuario;
let nombreUsuario = "";
let puntosUsuario = 0;
let infoPuntos = "";
let noPuedeJugar = false; // 🔹 Nuevo: para bloquear si no hay puntos

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  const urlParams = new URLSearchParams(window.location.search);
  idUsuario = urlParams.get("id");

  nombreUsuario = sessionStorage.getItem("nombreUsuario") || "Jugador";
  puntosUsuario = parseInt(sessionStorage.getItem("puntosUsuario") || 0);

  actualizarCartel();
}

function draw() {
  drawBackground();

  // --- Mostrar nombre y puntos ---
  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  text(`👤 ${nombreUsuario}`, 20, 10);
  textAlign(RIGHT, TOP);
  text(`💰 Puntos: ${puntosUsuario}`, width - 20, 10);
  textAlign(CENTER, CENTER);

  if (inMenu) {
    drawMenu();
    return;
  }

  if (noPuedeJugar) {
    fill(255, 50, 50);
    textSize(30);
    text("❌ No tenés suficientes puntos para jugar", width / 2, height / 2);
    return;
  }

  for (let i = 0; i < cards.length; i++) {
    let x = gridOffsetX + (i % cols) * (cardSize + spacing);
    let y = gridOffsetY + Math.floor(i / cols) * (cardSize + spacing);
    cards[i].display(x, y, cardSize);
  }

  if (revealing) {
    let elapsed = millis() - revealStartTime;
    let remaining = ceil((revealDuration - elapsed) / 1000);
    fill(255, 255, 0);
    textSize(50);
    text("Empieza en " + remaining, width / 2, height - 80);

    if (elapsed > revealDuration) {
      for (let c of cards) if (!c.matched) c.flipped = false;
      revealing = false;
    }
  }

  for (let i = 0; i < lives; i++) {
    fill(255, 0, 0);
    ellipse(40 + i * 40, 90, 30, 30);
  }

  fill(255);
  textSize(20);
  text(infoPuntos, width / 2, 60);

  if (checking && millis() - checkStartTime > checkDelay) {
    if (firstCard.id !== secondCard.id) {
      firstCard.flipped = false;
      secondCard.flipped = false;
      lives--;
    } else {
      firstCard.matched = true;
      secondCard.matched = true;
    }
    firstCard = null;
    secondCard = null;
    checking = false;
  }

  if (lives <= 0) {
    gameOver = true;
    resultadoFinal("perder");
  }
  if (cards.every((c) => c.matched)) {
    gameWon = true;
    resultadoFinal("ganar");
  }

  if (gameOver) {
    fill(255, 0, 0);
    textSize(40);
    text("¡GAME OVER!", width / 2, height - 50);
  } else if (gameWon) {
    fill(0, 255, 0);
    textSize(40);
    text("¡GANASTE!", width / 2, height - 50);
  }

  fill(200);
  rect(width - 150, 20, 120, 35, 5);
  fill(0);
  textSize(16);
  text("REINICIAR", width - 90, 37);
}

function drawMenu() {
  fill(255);
  textSize(45);
  text("🎰 Juego de Memoria 🎲", width / 2, 60);

  textSize(25);
  for (let i = 0; i < difficulties.length; i++) {
    fill(i === selectedDifficulty ? color(0, 255, 0) : 255);
    rect(width / 2 - 80, 140 + i * 50 - 20, 160, 40, 10);
    fill(0);
    text(difficulties[i], width / 2, 140 + i * 50);
  }

  fill(255);
  rectMode(CENTER);
  rect(width / 2, 320, 200, 45, 10);
  fill(0);
  textSize(22);
  text("EMPEZAR JUEGO", width / 2, 320);
  rectMode(CORNER);

  fill(255, 255, 0);
  textSize(20);
  text(infoPuntos, width / 2, 380);
}

function startGame() {
  inMenu = false;
  gameOver = false;
  gameWon = false;
  checking = false;
  firstCard = null;
  secondCard = null;
  window.actualizado = false;
  noPuedeJugar = false;

  let numCards;
  if (selectedDifficulty === 0) { totalLives = 3; numCards = 6; cols = 3; rows = 2; }
  else if (selectedDifficulty === 1) { totalLives = 3; numCards = 12; cols = 4; rows = 3; }
  else { totalLives = 3; numCards = 24; cols = 6; rows = 4; }

  lives = totalLives;

  cardSize = min((width - (cols+1)*spacing)/cols, (height - 220 - (rows+1)*spacing)/rows) + 20;
  gridOffsetX = (width - (cols*cardSize + (cols-1)*spacing))/2;
  gridOffsetY = 120;

  let neededPairs = numCards / 2;
  let chosenEmojis = shuffle(allEmojis).slice(0, neededPairs);

  cards = [];
  for (let i = 0; i < chosenEmojis.length; i++) {
    cards.push(new Card(i, chosenEmojis[i]));
    cards.push(new Card(i, chosenEmojis[i]));
  }
  cards = shuffle(cards);

  revealing = true;
  revealStartTime = millis();
  for (let c of cards) c.flipped = true;

  if (backButton) backButton.remove();
  backButton = createButton("Atrás");
  backButton.position(20, 20);
  backButton.mousePressed(() => {
    inMenu = true;
    backButton.remove();
    actualizarCartel();
  });

  actualizarPuntos("inicio");
}

function actualizarCartel() {
  let costo = [2, 3, 5][selectedDifficulty];
  let gana = [3, 5, 8][selectedDifficulty];
  infoPuntos = `Jugar cuesta ${costo} puntos 💰 — Ganás ${gana} si completás 🎉`;
}

function actualizarPuntos(resultado) {
  if (!idUsuario) return;
  let dif = ["Fácil", "Medio", "Difícil"][selectedDifficulty];
  fetch(`actualizar_puntos.php?id=${idUsuario}&dif=${dif}&res=${resultado}`)
    .then(r => r.json())
    .then(d => {
      if (d.error === "no_puntos") {
        noPuedeJugar = true;
      } else if (d.puntos !== undefined) {
        puntosUsuario = d.puntos;
        sessionStorage.setItem("puntosUsuario", puntosUsuario);
      }
    })
    .catch(err => console.error("Error:", err));
}

function resultadoFinal(resultado) {
  if (!window.actualizado) {
    window.actualizado = true;
    actualizarPuntos(resultado);
  }
}

function mousePressed() {
  if (inMenu) {
    for (let i = 0; i < difficulties.length; i++) {
      if (
        mouseX > width / 2 - 80 &&
        mouseX < width / 2 + 80 &&
        mouseY > 140 + i * 50 - 20 &&
        mouseY < 160 + i * 50
      ) {
        selectedDifficulty = i;
        actualizarCartel();
      }
    }

    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > 300 &&
      mouseY < 340
    ) {
      startGame();
      return;
    }
    return;
  }

  if (
    mouseX > width - 150 &&
    mouseX < width - 30 &&
    mouseY > 20 &&
    mouseY < 55
  ) {
    startGame();
    return;
  }

  if (gameOver || gameWon || checking || revealing || noPuedeJugar) return;

  for (let i = 0; i < cards.length; i++) {
    let x = gridOffsetX + (i % cols) * (cardSize + spacing);
    let y = gridOffsetY + Math.floor(i / cols) * (cardSize + spacing);
    if (
      mouseX > x &&
      mouseX < x + cardSize &&
      mouseY > y &&
      mouseY < y + cardSize
    ) {
      if (!cards[i].flipped && !cards[i].matched) {
        cards[i].flipped = true;
        if (!firstCard) firstCard = cards[i];
        else if (!secondCard) {
          secondCard = cards[i];
          checking = true;
          checkStartTime = millis();
        }
      }
    }
  }
}

class Card {
  constructor(id, emoji) { this.id=id; this.emoji=emoji; this.flipped=false; this.matched=false; }
  display(x,y,size) {
    stroke(255); strokeWeight(2);
    if (this.flipped || this.matched) {
      fill(255); rect(x,y,size,size,10);
      textSize(size*0.6); text(this.emoji, x+size/2, y+size/2);
    } else {
      fill(200,100,0); rect(x,y,size,size,10);
      fill(255,255,0); textSize(size*0.3); text("♦", x+size/2, y+size/2);
    }
  }
}

function drawBackground() {
  for (let y = 0; y < height; y++) {
    let t = millis() * 0.0002;
    let inter = map(y, 0, height, 0, 1);
    let c1 = color(40 + 30 * sin(t), 0, 100 + 100 * sin(t + 2));
    let c2 = color(0, 150 + 100 * sin(t + 1), 255);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (!inMenu) startGame();
}
