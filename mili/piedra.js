let opciones = ["Piedra", "Papel", "Tijera"];
let colores = ["#77DD77", "#FDFD96", "#FFB7B2"];
let jugador = "";
let computadora = "";
let puntosJugador = 0;
let puntosComputadora = 0;
let empates = 0;
let botonReiniciar;
let estado = "inicio";
let preguntaActual = null;

let preguntas = [
  { q: "¿Qué palabra se usa para declarar una variable en JS?", opciones: ["let", "varname", "declare"], a: "let" },
  { q: "¿Qué símbolo se usa para terminar una instrucción?", opciones: [".", ";", ":"], a: ";" },
  { q: "¿Qué comando muestra un mensaje en consola?", opciones: ["print()", "console.log", "alert()"], a: "console.log" },
  { q: "¿Qué tipo de dato devuelve typeof []?", opciones: ["array", "object", "list"], a: "object" },
  { q: "¿Cómo se llama el bucle que repite hasta que la condición sea falsa?", opciones: ["while", "for", "do if"], a: "while" },
  { q: "¿Qué palabra clave se usa para una función en JS?", opciones: ["def", "function", "func"], a: "function" },
  { q: "¿Qué devuelve 0 == false en JS?", opciones: ["true", "false", "error"], a: "true" },
  { q: "¿Qué método convierte un string a número entero?", opciones: ["parseInt", "int()", "Number()"], a: "parseInt" },
  { q: "¿Qué significa JSON?", opciones: ["JavaScript Object Notation", "Java Source Open Network", "JavaScript Online Notes"], a: "JavaScript Object Notation" }
];

function setup() {
  createCanvas(1395, 615);
  textAlign(CENTER, CENTER);

  botonReiniciar = createButton("Reiniciar");
  botonReiniciar.position(width / 2 - 80, height - 130);
  botonReiniciar.mousePressed(reiniciarJuego);
  botonReiniciar.hide();
  botonReiniciar.addClass("boton-reiniciar");
}

function draw() {
  background("#000");

  if (estado === "inicio") {
    fill("#FDFD96");
    textSize(40);
    text("Piedra, Papel o Tijera", width/2, height/2 - 100);

    fill("#77DD77");
    rect(width/2 - 100, height/2 - 40, 200, 80, 10);
    fill("#000");
    textSize(30);
    text("Iniciar", width/2, height/2);

  } else if (estado === "jugando") {
    fill("#FDFD96");
    textSize(32);
    text("Piedra, Papel o Tijera", width / 2, 50);

    dibujarContador();

    if (jugador !== "") {
      let indexJugador = opciones.indexOf(jugador);
      fill(colores[indexJugador]);
      rect(100, height/2 - 100, 150, 200, 10);
      fill("#222831");
      textSize(24);
      text(jugador, 175, height/2);
    }

    for (let i = 0; i < opciones.length; i++) {
      fill(colores[i]);
      rect(50 + i * 170, height - 150, 120, 80, 10);
      fill("#222831");
      textSize(18);
      text(opciones[i], 110 + i * 170, height - 110);
    }

    if (computadora !== "") {
      let indexComp = opciones.indexOf(computadora);
      fill(colores[indexComp]);
      rect(width - 250, height/2 - 100, 150, 200, 10);
      fill("#222831");
      textSize(24);
      text(computadora, width - 175, height/2);
    }

    if (puntosJugador === 3 || puntosComputadora === 3) {
      estado = "fin";
    }

  } else if (estado === "pregunta") {
    fill("#FFF");
    textSize(28);
    text("Empate. Responde la pregunta:", width/2, 100);
    textSize(22);
    text(preguntaActual.q, width/2, 160);

    for (let i = 0; i < 3; i++) {
      fill("#FFD369");
      rect(width/2 - 150, 220 + i * 80, 300, 60, 10);
      fill("#000");
      textSize(20);
      text(preguntaActual.opciones[i], width/2, 250 + i * 80);
    }

  } else if (estado === "fin") {
    noLoop();
    fill("#FFFF");
    textSize(36);
    if (puntosJugador === 3) {
      text("¡Ganaste la partida!", width / 2, height / 2);
    } else {
      text("Perdiste la partida...", width / 2, height / 2);
    }
    botonReiniciar.show();
  }
}

function dibujarContador() { 
  textSize(40);
  fill("#393E46");
  rect(width/2 - 200, 100, 400, 60, 10);
  fill("#77DD77");
  text("Jugador: " + puntosJugador, width/2 - 100, 130);
  fill("#FFB7B2");
  text("Computadora: " + puntosComputadora, width/2 + 100, 130);
  fill("#FFD369"); 
}

function mousePressed() {
  if (estado === "inicio") {
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100 &&
        mouseY > height/2 - 40 && mouseY < height/2 + 40) {
      estado = "jugando";
    }
  } else if (estado === "jugando") {
    for (let i = 0; i < opciones.length; i++) {
      if (
        mouseX > 50 + i * 170 &&
        mouseX < 170 + i * 170 &&
        mouseY > height - 150 &&
        mouseY < height - 70
      ) {
        jugador = opciones[i];
        computadora = random(opciones);
        jugarRonda();
      }
    }
  } else if (estado === "pregunta") {
    for (let i = 0; i < 3; i++) {
      if (
        mouseX > width/2 - 150 &&
        mouseX < width/2 + 150 &&
        mouseY > 220 + i * 80 &&
        mouseY < 280 + i * 80
      ) {
        let respuesta = preguntaActual.opciones[i];
        if (respuesta === preguntaActual.a) {
          puntosJugador++;
        } else {
          puntosComputadora++;
        }
        if (puntosJugador === 3 || puntosComputadora === 3) {
          estado = "fin";
        } else {
          estado = "jugando";
        }
        preguntaActual = null;
      }
    }
  }
}
function jugarRonda() {
  if (
    (jugador === "Piedra" && computadora === "Tijera") ||
    (jugador === "Papel" && computadora === "Piedra") ||
    (jugador === "Tijera" && computadora === "Papel")
  ) {
    puntosJugador++;
  } else if (jugador !== computadora) {
    puntosComputadora++;
  } else if (jugador === computadora) {
    resultado = "Empate";
    empates++; 
    estado = "pregunta";
    preguntaActual = random(preguntas);
  }
}
function reiniciarJuego() {
  puntosJugador = 0;
  puntosComputadora = 0;
  empates = 0;
  jugador = "";
  computadora = "";
  estado = "inicio";
  preguntaActual = null;
  loop();
  botonReiniciar.hide();
}