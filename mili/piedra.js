let opciones = ["Piedra", "Papel", "Tijera"];
let colores = ["#4361ee", "#ffd166", "#f07167"];
let jugador = "";
let computadora = "";
let puntosJugador = 0;
let puntosComputadora = 0;
let empates = 0;
let botonReiniciar;
let estado = "inicio";
let preguntaActual = null;

let animacionJugador = 0;
let animacionComputadora = 0;
let animandoJugador = false;
let animandoComputadora = false;

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
  createCanvas(1360, 620);
  textAlign(CENTER, CENTER);

  botonReiniciar = createButton("Reiniciar");
  botonReiniciar.position(width / 2 - 80, height - 130);
  botonReiniciar.mousePressed(reiniciarJuego);
  botonReiniciar.hide();
  botonReiniciar.addClass("boton-reiniciar");
}

function draw() {
  background("#131212");

  if (estado === "inicio") {
    fill("#e0e1dd");
    textSize(40);
    text("Piedra, Papel o Tijera", width/2, height/2 - 100);
    fill("#80ed99");
    rect(width/2 - 100, height/2 - 40, 200, 80, 10);
    fill("#000");
    textSize(30);
    text("Iniciar", width/2, height/2);

  } else if (estado === "jugando") {
    fill("#118ab2");
    textSize(32);
    text("Piedra, Papel o Tijera", width / 2, 50);

    dibujarContador();

    if (jugador !== "") {
      let indexJugador = opciones.indexOf(jugador);
      let t = constrain(animacionJugador, 0, 1);
      let x = lerp(100, width / 2 - 200, t);
      let y = lerp(height - 250, height / 2 - 100, t);
      let tam = lerp(120, 150, sin(t * PI));
      fill(colores[indexJugador]);
      rect(x, y, tam, tam + 50, 10);
      fill("#222831");
      textSize(24 + sin(t * PI) * 5);
      text(jugador, x + tam / 2, y + tam / 2);
    }
    //cartas
    for (let i = 0; i < opciones.length; i++) {
      fill(colores[i]);
      rect(50 + i * 170, height - 150, 120, 80, 10);
      fill(colores[i]);
      fill("#222831");
      textSize(18);
      text(opciones[i], 110 + i * 170, height - 110);
    }
   
    if (computadora !== "") {
      let indexComp = opciones.indexOf(computadora);
      let t = constrain(animacionComputadora, 0, 1);
      let x = lerp(width - 250, width / 2 + 100, t);
      let y = lerp(50, height / 2 - 100, t);
      let tam = lerp(120, 150, sin(t * PI));

      fill(colores[indexComp]);
      rect(x, y, tam, tam + 50, 10);
      fill("#222831");
      textSize(24 + sin(t * PI) * 5);
      text(computadora, x + tam / 2, y + tam / 2);
    }
    if (animandoJugador) {
      animacionJugador += 0.05;
      if (animacionJugador >= 1) animandoJugador = false;
    }

    if (animandoComputadora) {
      animacionComputadora += 0.05;
      if (animacionComputadora >= 1) animandoComputadora = false;
    }

    if (puntosJugador === 4 || puntosComputadora === 4) {
      estado = "fin";
    }

  } else if (estado === "pregunta") {
    fill("#e0e1dd");
    textSize(28);
    text("Empate. Responde la pregunta:", width/2, 100);
    textSize(22);
    text(preguntaActual.q, width/2, 160);

    for (let i = 0; i < 3; i++) {
      fill("#FFD166");
      rect(width/2 - 150, 220 + i * 80, 300, 60, 10);
      fill("#000");
      textSize(20);
      text(preguntaActual.opciones[i], width/2, 250 + i * 80);
    }

  } else if (estado === "fin") {
    noLoop();
    fill("#e9e1dd");
    textSize(36);
    if (puntosJugador === 3) {
      text("¡Felicidades, ganaste la partida!", width / 2, height / 2);
    } else {
      text("Lo siento, perdiste la partida...", width / 2, height / 2);
    }
    botonReiniciar.show();
  }
}

function dibujarContador() {
  noStroke();
  fill(30, 30, 30, 200);
  rect(width/2 - 220, 90, 440, 80, 20);
  strokeWeight(4);
  stroke(lerpColor(color("#118ab2"), color("#04303fff"), abs(sin(frameCount * 0.05))));
  noFill();
  rect(width/2 - 220, 90, 440, 80, 20);
  noStroke();
  fill("#80ed99");
  textSize(30);
  textStyle(BOLD);
  text("Jugador: " + puntosJugador, width/2 - 100, 130);
  fill("#f07167");
  text("Computadora: " + puntosComputadora, width/2 + 100, 130);
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
        animandoJugador = true;
        animandoComputadora = true;
        animacionJugador = 0;
        animacionComputadora = 0;
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