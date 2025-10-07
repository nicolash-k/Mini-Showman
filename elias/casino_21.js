let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;
let playerTurn = true;

let cardWidth, cardHeight, cardSpacing;
let marginX, marginY;
let advice = "";

// Botones
let hitButton, standButton, restartButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(20);
  calculateLayout();
  createButtons();
  initGame();
}

function calculateLayout() {
  cardWidth = min(80, width * 0.08);  
  cardHeight = cardWidth * 1.6;      
  cardSpacing = cardWidth * 0.7;      
  marginX = width * 0.05;             
  marginY = height * 0.05;            
}

function createButtons() {
  // Botón Pedir Carta
  hitButton = createButton('Pedir Carta (P)');
  hitButton.position(marginX, height - 80);
  hitButton.size(150, 40);
  hitButton.mousePressed(hit);
  hitButton.style('font-size', '16px');
  hitButton.style('background-color', '#4CAF50');
  hitButton.style('color', 'white');
  hitButton.style('border', 'none');
  hitButton.style('border-radius', '5px');
  
  // Botón Plantarse
  standButton = createButton('Plantarse (S)');
  standButton.position(marginX + 160, height - 80);
  standButton.size(150, 40);
  standButton.mousePressed(stand);
  standButton.style('font-size', '16px');
  standButton.style('background-color', '#f44336');
  standButton.style('color', 'white');
  standButton.style('border', 'none');
  standButton.style('border-radius', '5px');
  
  // Botón Reiniciar
  restartButton = createButton('Reiniciar (R)');
  restartButton.position(marginX + 320, height - 80);
  restartButton.size(150, 40);
  restartButton.mousePressed(initGame);
  restartButton.style('font-size', '16px');
  restartButton.style('background-color', '#008CBA');
  restartButton.style('color', 'white');
  standButton.style('border', 'none');
  standButton.style('border-radius', '5px');
}

function draw() {
  background(20, 120, 50);
  
  if (width !== windowWidth || height !== windowHeight) {
    calculateLayout();
    updateButtonPositions();
  }
  
  // Actualizar consejos
  if (playerTurn && !gameOver) {
    giveStrategicAdvice();
  }
  
  // Mostrar consejos siempre
  drawAdvicePanel();
  
  fill(255);
  text("Dealer:", marginX, marginY + 20);

  for (let i = 0; i < dealerHand.length; i++) {
    let x = marginX + i * (cardWidth + cardSpacing);
    let y = marginY + 40;
    drawCard(dealerHand[i], x, y, (i === 1 && !gameOver));
  }

  if (gameOver) {
    fill(255);
    text("Puntaje Dealer: " + handValue(dealerHand), marginX + 200, marginY + 20);
  }

  for (let i = 0; i < playerHand.length; i++) {
    let x = marginX + i * (cardWidth + cardSpacing);
    let y = height - marginY - 150;
    drawCard(playerHand[i], x, y, false);
  }

  fill(255);
  text("Tu puntaje: " + handValue(playerHand), marginX + 200, height - marginY - 130);

  if (gameOver) {
    fill(255);
    textSize(26);
    text(checkWinner(), width / 2 - 100, height / 2);
    textSize(20);
  }
}

function drawAdvicePanel() {
  let panelX = width * 0.65;
  let panelY = marginY + 40;
  
  // Fondo del panel de consejos
  fill(255, 255, 200, 220);
  stroke(0);
  rect(panelX - 15, panelY - 25, width * 0.3, 120, 10);
  
  // Título del panel
  fill(0);
  textSize(18);
  text("💡 Consejos Estratégicos", panelX, panelY);
  
  // Consejo principal
  textSize(16);
  if (playerTurn && !gameOver) {
    fill(0, 100, 0);
    text(advice, panelX, panelY + 30);
    
    // Información adicional
    fill(0);
    text("Tu mano: " + handValue(playerHand), panelX, panelY + 55);
    text("Carta visible del dealer: " + getCardLabel(dealerHand[0]), panelX, panelY + 80);
  } else if (gameOver) {
    fill(100, 0, 0);
    text("Juego terminado - Presiona Reiniciar", panelX, panelY + 30);
  } else {
    fill(0, 0, 100);
    text("Turno del dealer...", panelX, panelY + 30);
  }
  
  textSize(20); // Volver al tamaño original
}

function giveStrategicAdvice() {
  let playerScore = handValue(playerHand);
  let dealerUpCard = dealerHand[0];
  let dealerUpValue = cardValue(dealerUpCard);
  
  if (playerScore <= 11) {
    advice = "✅ PIDE CARTA - Puntaje bajo, es seguro pedir";
  } else if (playerScore >= 17) {
    advice = "🛑 PLÁNTATE - Buen puntaje, riesgo de pasarte";
  } else if (playerScore >= 13 && dealerUpValue <= 6) {
    advice = "🛑 PLÁNTATE - Dealer puede pasarse con carta débil";
  } else if (playerScore >= 13 && dealerUpValue >= 7) {
    advice = "✅ PIDE CARTA - Dealer tiene carta fuerte";
  } else {
    advice = "✅ PIDE CARTA - Sigue construyendo tu mano";
  }
  
  // Consejos especiales
  if (playerHand.length === 2) {
    if (playerScore === 11) {
      advice = "🎯 DOBLA APUESTA - Mejor oportunidad con 11";
    } else if (playerScore === 10 && dealerUpValue <= 9) {
      advice = "🎯 DOBLA APUESTA - 10 puntos contra dealer débil";
    } else if (playerScore === 9 && dealerUpValue >= 3 && dealerUpValue <= 6) {
      advice = "🎯 DOBLA APUESTA - Buena posición con 9";
    }
  }
  
  // Si el jugador tiene un As
  let hasAce = playerHand.some(card => card.value === 1);
  if (hasAce && playerHand.length === 2) {
    let softScore = handValue(playerHand);
    if (softScore === 17) advice = "🎯 DOBLA APUESTA - As + 6 contra dealer débil";
    if (softScore >= 19) advice = "🛑 PLÁNTATE - Mano suave fuerte";
  }
}

function drawCard(card, x, y, hidden) {
  stroke(0);
  fill(255);
  rect(x, y, cardWidth, cardHeight, 5);
  
  if (!hidden) {
    if (card.suit === "♥" || card.suit === "♦") fill(200, 0, 0);
    else fill(0);

    textSize(cardWidth * 0.2); 
    text(getCardLabel(card), x + 5, y + cardHeight * 0.25);
    text(card.suit, x + 5, y + cardHeight * 0.75);
  } else {
    fill(200, 0, 0);
    rect(x, y, cardWidth, cardHeight, 5);
    
    // Patrón para carta oculta
    fill(255);
    textSize(cardWidth * 0.3);
    text("?", x + cardWidth/2 - 8, y + cardHeight/2 + 10);
  }
}

function updateButtonPositions() {
  hitButton.position(marginX, height - 80);
  standButton.position(marginX + 160, height - 80);
  restartButton.position(marginX + 320, height - 80);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateLayout();
  updateButtonPositions();
}

// Funciones de los botones
function hit() {
  if (!gameOver && playerTurn) {
    playerHand.push(deck.pop());
    if (handValue(playerHand) > 21) {
      gameOver = true;
    }
  }
}

function stand() {
  if (!gameOver && playerTurn) {
    playerTurn = false;
    // Turno del dealer
    while (handValue(dealerHand) < 17) {
      dealerHand.push(deck.pop());
    }
    gameOver = true;
  }
}

function initGame() {
  deck = createDeck();
  deck = shuffleDeck(deck);
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  gameOver = false;
  playerTurn = true;
  advice = "";
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
  // Mantener funcionalidad de teclas para accesibilidad
  if (!gameOver) {
    if (key === 'p' || key === 'P') {
      hit();
    }
    if (key === 's' || key === 'S') {
      stand();
    }
  }
  if (key === 'r' || key === 'R') {
    initGame();
  }
}