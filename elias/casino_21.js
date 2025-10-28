let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;
let playerTurn = true;

function setup() {
  createCanvas(800, 400);
  textSize(20);
  initGame();
}

function draw() {
  background(20, 120, 50);
  fill(255);
  text("Controles: P(pedir otra carta), R(reiniciar), S(plantarse)", 125, 375);

  fill(255);
  text("Dealer:", 50, 40);

  for (let i = 0; i < dealerHand.length; i++) {
    drawCard(dealerHand[i], 50 + i * 60, 60, (i === 1 && !gameOver));
  }

  if (gameOver) {
    fill(255);
    text("Puntaje Dealer: " + handValue(dealerHand), 250, 40);
  }

  for (let i = 0; i < playerHand.length; i++) {
    drawCard(playerHand[i], 50 + i * 60, 200, false);
  }

  fill(255);
  text("Tu puntaje: " + handValue(playerHand), 250, 230);

  if (gameOver) {
    fill(255);
    textSize(26);
    text(checkWinner(), 300, 150);
    textSize(20);
  }
}

function initGame() {
  deck = createDeck();

  console.log("Antes de barajar (últimas 8):", deck.map(d => getCardLabel(d) + d.suit).slice(-8).join(" "));

  deck = shuffleDeck(deck);

  console.log("Después de barajar (últimas 8):", deck.map(d => getCardLabel(d) + d.suit).slice(-8).join(" "));

  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];

  gameOver = false;
  playerTurn = true;
}

function createDeck() {
  let suits = ["♠", "♥", "♦", "♣"];
  let deck = [];
  for (let s of suits) {
    for (let v = 1; v <= 13; v++) {
      deck.push({ value: v, suit: s });
    }
  }
  return deck;
}

function shuffleDeck(array) {
  let a = array.slice(); 
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawCard(card, x, y, hidden) {
  stroke(0);
  fill(255);
  rect(x, y, 50, 80, 5);
  
  if (!hidden) {
    if (card.suit === "♥" || card.suit === "♦") fill(200, 0, 0);
    else fill(0);

    textSize(16);
    text(getCardLabel(card), x + 5, y + 20);
    text(card.suit, x + 5, y + 60);
  } else {
    fill(200, 0, 0);
    rect(x, y, 50, 80, 5);
  }
}

function getCardLabel(card) {
  if (card.value === 1) return "A";
  if (card.value === 11) return "J";
  if (card.value === 12) return "Q";
  if (card.value === 13) return "K";
  return card.value;
}

function cardValue(card) {
  if (card.value > 10) return 10;   
  if (card.value === 1) return 11;  
  return card.value;
}

function handValue(hand) {
  let sum = 0;
  let aces = 0;
  for (let c of hand) {
    let v = cardValue(c);
    sum += v;
    if (v === 11) aces++;
  }
  while (sum > 21 && aces > 0) {
    sum -= 10;
    aces--;
  }
  return sum;
}

function checkWinner() {
  let playerScore = handValue(playerHand);
  let dealerScore = handValue(dealerHand);

  if (playerScore > 21) return "Te pasaste. Pierdes!";
  else if (dealerScore > 21) return "Dealer se pasó. ¡Ganas!";
  else if (playerScore > dealerScore) return "Ganaste!";
  else if (dealerScore > playerScore) return "Perdiste!";
  else return "Empate!";
}

function keyPressed() {
  if (!gameOver) {
    if (key === 'p' || key === 'P') {
      playerHand.push(deck.pop());
      if (handValue(playerHand) > 21) gameOver = true;
    }
    if (key === 's' || key === 'S') {
      playerTurn = false;
      while (handValue(dealerHand) < 17) dealerHand.push(deck.pop());
      gameOver = true;
    }
  }
  if (key === 'r' || key === 'R') {
    initGame();
  }
}
