let numeros = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6,
               27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
               16, 33, 1, 20, 14, 31, 9, 22, 18, 29,
               7, 28, 12, 35, 3, 26];

let ganador = -1;
let girando = false;
let angulo = 0;
let velocidad = 0;
let bolaAngulo = 0;
let bolaRadio = 200;
let bolaVel = 0;
let ficha = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(30, 120, 50);
  let centroX = width / 2;
  let centroY = height / 2 - 150;

  push();
  translate(centroX, centroY);
  rotate(angulo);
  let paso = TWO_PI / numeros.length;
  for (let i = 0; i < numeros.length; i++) {
    let n = numeros[i];
    if (!girando && ganador === n) {
      strokeWeight(3);
      stroke(255, 255, 0);
    } else {
      noStroke();
    }
    if (n === 0) fill(0, 180, 0);
    else if (esRojo(n)) fill(200, 0, 0);
    else fill(0);
    arc(0, 0, 400, 400, i * paso, (i + 1) * paso);
    fill(255);
    textSize(12);
    let tx = cos(i * paso + paso / 2) * 160;
    let ty = sin(i * paso + paso / 2) * 160;
    text(n, tx, ty);
  }
  pop();

  let bolaX = centroX + cos(bolaAngulo) * bolaRadio;
  let bolaY = centroY + sin(bolaAngulo) * bolaRadio;
  fill(255);
  ellipse(bolaX, bolaY, 15, 15);

  fill(255, 215, 0);
  ellipse(centroX, centroY, 70, 70);
  fill(0);
  textSize(18);
  text("GIRAR", centroX, centroY);

  drawBetOptions();
  drawNumberTable();

  if (ficha) {
    fill(0, 0, 255);
    ellipse(ficha.x, ficha.y, 25, 25);
    fill(255);
    textSize(12);
    text("F", ficha.x, ficha.y);
  }

  if (!girando && ganador >= 0) {
    fill(255);
    textSize(20);
    text("Número ganador: " + ganador, width / 2, height - 120);
    let mensaje = "Ninguna apuesta ganadora";
    if (ficha) {
      if (ficha.tipo === "numero" && ficha.valor === ganador) mensaje = "Ganaste al número exacto!";
      if (ficha.tipo === "docena" && estaEnDocena(ganador, ficha.valor)) mensaje = "Ganaste a la docena " + ficha.valor;
      if (ficha.tipo === "color" && colorNumero(ganador) === ficha.valor) mensaje = "Ganaste al color " + ficha.valor;
    }
    fill(mensaje.includes("Ganaste") ? color(0, 255, 0) : color(255, 0, 0));
    text(mensaje, width / 2, height - 90);
  }

  if (girando) {
    angulo += velocidad;
    velocidad *= 0.985;
    bolaAngulo -= bolaVel;
    bolaVel *= 0.985;
    if (velocidad < 0.01) {
      girando = false;
      let pasoFinal = TWO_PI / numeros.length;
      let relativo = (bolaAngulo - angulo) % TWO_PI;
      if (relativo < 0) relativo += TWO_PI;
      let idx = int(relativo / pasoFinal);
      ganador = numeros[idx];
    }
  }
}

function mousePressed() {
  let centroX = width / 2;
  let centroY = height / 2 - 150;
  let d = dist(mouseX, mouseY, centroX, centroY);
  if (d < 35 && !girando && ficha) {
    girando = true;
    velocidad = random(0.2, 0.3);
    bolaVel = random(0.25, 0.35);
    ganador = -1;
    return;
  }
  if (girando) return;

  if (mouseY > height - 200 && mouseY < height - 160) {
    if (mouseX > 50 && mouseX < 190) ponerFicha("docena", 1);
    else if (mouseX > 210 && mouseX < 350) ponerFicha("docena", 2);
    else if (mouseX > 370 && mouseX < 510) ponerFicha("docena", 3);
  }

  if (mouseY > height - 140 && mouseY < height - 100) {
    if (mouseX > 150 && mouseX < 250) ponerFicha("color", "rojo");
    else if (mouseX > 350 && mouseX < 450) ponerFicha("color", "negro");
    else if (mouseX > 500 && mouseX < 600) ponerFicha("color", "verde");
  }

  let cellW = 35;
  let cellH = 30;
  let totalW = 13 * cellW;
  let gridX = width - 50 - totalW;
  let gridY = height - 150;

  if (mouseX > gridX && mouseX < gridX + cellW*13 && mouseY > gridY && mouseY < gridY + cellH*3) {
    let col = int((mouseX - gridX) / cellW);
    let row = int((mouseY - gridY) / cellH);
    let n;
    if (row === 0 && col === 0) n = 0;
    else n = row*12 + (col+1);
    if (n >= 0 && n <= 36) ponerFicha("numero", n);
  }
}

function drawBetOptions() {
  textSize(14);
  fill(255);
  text("Opciones de apuesta:", width / 2, height - 240);
  fill(200);
  rect(50, height - 200, 140, 40);
  rect(210, height - 200, 140, 40);
  rect(370, height - 200, 140, 40);
  fill(0);
  text("1ra Docena", 120, height - 180);
  text("2da Docena", 280, height - 180);
  text("3ra Docena", 440, height - 180);
  fill(200, 0, 0);
  rect(150, height - 140, 100, 40);
  fill(255);
  text("ROJO", 200, height - 120);
  fill(0);
  rect(350, height - 140, 100, 40);
  fill(255);
  text("NEGRO", 400, height - 120);
  fill(0, 180, 0);
  rect(500, height - 140, 100, 40);
  fill(255);
  text("VERDE", 550, height - 120);
}

function drawNumberTable() {
  let cellW = 35;
  let cellH = 30;
  let totalW = 13 * cellW;
  let gridX = width - 50 - totalW;
  let gridY = height - 150;

  fill(0, 180, 0);
  rect(gridX, gridY, cellW, cellH);
  fill(255);
  text("0", gridX + cellW/2, gridY + cellH/2);

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 12; c++) {
      let n = r*12 + (c+1);
      let x = gridX + cellW + c*cellW;
      let y = gridY + r*cellH;
      if (esRojo(n)) fill(200,0,0);
      else fill(0);
      rect(x, y, cellW, cellH);
      fill(255);
      text(n, x + cellW/2, y + cellH/2);
    }
  }
}

function ponerFicha(tipo, valor) {
  ficha = {x: mouseX, y: mouseY, tipo, valor};
}

function esRojo(n) {
  let rojos = [32,19,21,25,34,27,36,30,23,5,16,1,14,9,18,7,12,3];
  return rojos.includes(n);
}

function colorNumero(n) {
  if (n===0) return "verde";
  return esRojo(n) ? "rojo" : "negro";
}

function estaEnDocena(n, docena) {
  if (docena===1) return n>=1 && n<=12;
  if (docena===2) return n>=13 && n<=24;
  if (docena===3) return n>=25 && n<=36;
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
