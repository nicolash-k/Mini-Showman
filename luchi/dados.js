let dado1, dado2;
let alto = true;
let animando = false;
let animFrames = 15;
let resultado = "";  
let colorDado1, colorDado2; // colores dinámicos de los dados

function setup() {
  createCanvas(400, 300);
  textAlign(CENTER, CENTER);
  dado1 = 1;
  dado2 = 1; 
  colorDado1 = color(255);
  colorDado2 = color(255);

  let btnAlto = createButton('Alto');
  btnAlto.position(80, 220);
  btnAlto.mousePressed(() => alto = true);

  let btnBajo = createButton('Bajo');
  btnBajo.position(250, 220);
  btnBajo.mousePressed(() => alto = false);
}

function draw() {
  background(50, 150, 200);

  drawDado(120, 130, dado1, colorDado1);
  drawDado(280, 130, dado2, colorDado2);

  fill(255);
  textSize(16);
  text("Click en la pantalla para lanzar los dados", width / 2, 50);

  if (animando) {
    dado1 = int(random(1, 7));
    dado2 = int(random(1, 7));
    animFrames--;
    if (animFrames <= 0) {
      animando = false;
      mostrarResultado();
    }
  }

  fill(255);
  textSize(20);
  text(resultado, width / 2, 270);
}

function mousePressed() {
  animando = true;
  animFrames = 20;
  resultado = "";

  // Colores aleatorios en cada tirada
  colorDado1 = color(random(150, 255), random(150, 255), random(150, 255));
  colorDado2 = color(random(150, 255), random(150, 255), random(150, 255));
}

function mostrarResultado() {
  let suma = dado1 + dado2;
  if ((alto && suma > 7) || (!alto && suma <= 6)) {
    resultado = "¡Ganaste!";
  } else {
    resultado = "Perdiste";
  }
}

function drawDado(x, y, valor, col) {
  // Sombra
  noStroke();
  fill(0, 100);
  rectMode(CENTER);
  rect(x + 5, y + 5, 85, 85, 15);

  // Degradado para volumen
  for (let i = 40; i > 0; i--) {
    let inter = map(i, 40, 0, 0, 1);
    let c = lerpColor(col, color(200), inter);
    fill(c);
    rect(x, y, 80 - i * 0.8, 80 - i * 0.8, 12);
  }

  // Borde
  stroke(0);
  strokeWeight(3);
  noFill();
  rect(x, y, 80, 80, 12);

  // Puntos rojos
  fill(220, 30, 30);
  noStroke();
  let offset = 20;
  let r = 14;

  switch (valor) {
    case 1: ellipse(x, y, r); break;
    case 2:
      ellipse(x - offset, y - offset, r);
      ellipse(x + offset, y + offset, r);
      break;
    case 3:
      ellipse(x - offset, y - offset, r);
      ellipse(x, y, r);
      ellipse(x + offset, y + offset, r);
      break;
    case 4:
      ellipse(x - offset, y - offset, r);
      ellipse(x + offset, y - offset, r);
      ellipse(x - offset, y + offset, r);
      ellipse(x + offset, y + offset, r);
      break;
    case 5:
      ellipse(x - offset, y - offset, r);
      ellipse(x + offset, y - offset, r);
      ellipse(x, y, r);
      ellipse(x - offset, y + offset, r);
      ellipse(x + offset, y + offset, r);
      break;
    case 6:
      ellipse(x - offset, y - offset, r);
      ellipse(x, y - offset, r);
      ellipse(x + offset, y - offset, r);
      ellipse(x - offset, y + offset, r);
      ellipse(x, y + offset, r);
      ellipse(x + offset, y + offset, r);
      break;
  }
}
