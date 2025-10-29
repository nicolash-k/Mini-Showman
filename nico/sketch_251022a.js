// ====== Parámetros generales ======
const NUM_CABALLOS = 5;
const INTERVALO_MS = 350;
const LANE_GAP = 18;
const RADIO_CURVA = 140;
const CASILLAS = 120;

// Datos de los próceres
const proceres = [
    {
        nombre: "José de San Martín",
        color: "#d81b60",
        biografia: "José Francisco de San Martín (1778-1850) fue un militar y político argentino, y uno de los libertadores más importantes de Sudamérica. Es reconocido como el 'Padre de la Patria' en Argentina y se le considera el principal héroe y prócer del panteón nacional. Lideró el Cruce de los Andes y fue fundamental para la independencia de Argentina, Chile y Perú."
    },
    {
        nombre: "Manuel Belgrano",
        color: "#1e88e5",
        biografia: "Manuel José Joaquín del Corazón de Jesús Belgrano (1770-1820) fue un economista, periodista, político, abogado y militar de las Provincias Unidas del Río de la Plata. Es el creador de la Bandera de Argentina y uno de los más notables economistas argentinos. Participó en la defensa de Buenos Aires durante las invasiones inglesas y en la Guerra de Independencia de la Argentina."
    },
    {
        nombre: "Juan José Castelli",
        color: "#43a047",
        biografia: "Juan José Castelli (1764-1812) fue un abogado y político de las Provincias Unidas del Río de la Plata. Tuvo una participación importante en la Revolución de Mayo, y se lo conoció como el 'Orador de la Revolución'. Fue uno de los principales impulsores de las medidas más radicales de la Primera Junta y un firme partidario de la independencia absoluta."
    },
    {
        nombre: "Mariano Moreno",
        color: "#fb8c00",
        biografia: "Mariano Moreno (1778-1811) fue un abogado, periodista y político de las Provincias Unidas del Río de la Plata. Tuvo una participación importante en los hechos que condujeron a la Revolución de Mayo y fue nombrado secretario de la Primera Junta. Fundó la Gazeta de Buenos Ayres y la Biblioteca Pública, hoy Biblioteca Nacional."
    },
    {
        nombre: "Cornelio Saavedra",
        color: "#8e24aa",
        biografia: "Cornelio Judas Tadeo de Saavedra y Rodríguez (1759-1829) fue un militar y estadista de las Provincias Unidas del Río de la Plata. Fue el presidente de la Primera Junta de gobierno, resultante de la Revolución de Mayo, que destituyó al virrey Baltasar Hidalgo de Cisneros. Era el jefe del Regimiento de Patricios cuando estalló la Revolución."
    }
];

let caballos = [];
let ultimoTick = 0;
let ordenLlegada = [];
let seleccionado = -1;
let carreraTerminada = false;
let carreraIniciada = false;

// ====== Setup p5.js ======
function setup() {
  createCanvas(800, 600);
  reiniciarCarrera();
}

function reiniciarCarrera() {
  caballos = [];
  for (let i = 0; i < NUM_CABALLOS; i++) {
    caballos.push({
      pos: 0,
      hist: [],
      bloqueados: 0,
      terminado: false,
      color: proceres[i].color,
      lane: i,
      nombre: proceres[i].nombre,
      biografia: proceres[i].biografia
    });
  }
  ordenLlegada = [];
  carreraTerminada = false;
  carreraIniciada = false;
  ultimoTick = millis();
}

// ====== Draw p5.js ======
function draw() {
  background(240);
  dibujarHipodromo();
  dibujarCaballos();
  dibujarPodio();

  if (carreraIniciada && !carreraTerminada && millis() - ultimoTick >= INTERVALO_MS) {
    tickMovimiento();
    ultimoTick = millis();
  }

  if (carreraTerminada) {
    fill(20);
    textSize(18);
    textAlign(CENTER, CENTER);
    const ganador = ordenLlegada[0];
    let msg = "🏁 ¡Llegaron todos! Ganó " + caballos[ganador].nombre;
    if (seleccionado >= 0) {
      const posicion = ordenLlegada.indexOf(seleccionado) + 1;
      msg += " · Tu caballo quedó #" + posicion;
    }
    text(msg, width/2, height - 40);
  }
  
  // Mostrar información del caballo seleccionado
  if (seleccionado >= 0) {
    fill(20);
    textSize(14);
    textAlign(LEFT, TOP);
    text(`Seleccionado: ${caballos[seleccionado].nombre}`, 20, 20);
  }
  
  // Instrucciones
  fill(50);
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text("Presiona 1-5 para seleccionar caballo, ESPACIO para iniciar, R para reiniciar", 20, height - 20);
}

// ====== Hipódromo rectangular ======
function dibujarHipodromo() {
  const cx = width/2;
  const cy = height/2;
  const w = width - 160;
  const h = height - 160;
  const margin = RADIO_CURVA + LANE_GAP*(NUM_CABALLOS-1)/2;

  // Pasto
  noStroke();
  fill("#2e7d32");
  rect(cx - w/2 - margin - 40, cy - h/2 - margin - 40,
       w + 2*margin + 80, h + 2*margin + 80, 28);

  // Pista
  stroke("#c73c3c");
  strokeWeight(LANE_GAP * (NUM_CABALLOS + 8));
  noFill();
  rect(cx - w/2 - LANE_GAP*(NUM_CABALLOS-1)/2, cy - h/2 - LANE_GAP*(NUM_CABALLOS-1)/2,
       w + LANE_GAP*(NUM_CABALLOS-1), h + LANE_GAP*(NUM_CABALLOS-1));

  // Líneas de carril
  stroke(25);
  strokeWeight(2);
  for (let k = 0; k <= NUM_CABALLOS; k++) {
    const offset = -((NUM_CABALLOS-1)/2)*LANE_GAP + k*LANE_GAP;
    rect(cx - w/2 - offset, cy - h/2 - offset, w + 2*offset, h + 2*offset);
  }

  // Línea de meta
  stroke("#ffffff");
  strokeWeight(3);
  const o0 = -((NUM_CABALLOS-1)/2)*LANE_GAP;
  const oN = o0 + NUM_CABALLOS*LANE_GAP;
  const xSalida = cx;
  const yInferiorInt = cy + h/2 + o0;
  const yInferiorExt = cy + h/2 + oN;
  line(xSalida, yInferiorInt, xSalida, yInferiorExt);
  
  // Texto META
  fill(255);
  stroke(0);
  strokeWeight(1);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("META", xSalida, yInferiorExt + 20);
}

// ====== Dibujar caballos ======
function dibujarCaballos() {
  for (let i = 0; i < caballos.length; i++) {
    const h = caballos[i];
    const [x,y] = coordPorPos(h.pos, h.lane);

    // Resaltar selección
    if (i === seleccionado) {
      noFill(); 
      stroke(255, 215, 0); 
      strokeWeight(4);
      circle(x, y, 32);
    }

    // Caballo
    noStroke(); 
    fill(h.color);
    circle(x, y, 22);

    // Número
    fill(255); 
    textAlign(CENTER, CENTER); 
    textSize(11);
    text(i+1, x, y);
    
    // Nombre cerca del caballo
    fill(0);
    textSize(10);
    text(h.nombre.split(" ")[2] || h.nombre.split(" ")[1] || h.nombre.split(" ")[0], x, y - 25);
  }
}

// ====== Podio ======
function dibujarPodio() {
  const podioX = width - 150;
  const podioY = 100;
  
  // Fondo del podio
  fill(255, 255, 255, 200);
  stroke(0);
  strokeWeight(1);
  rect(podioX - 60, podioY - 30, 120, 130, 10);
  
  // Título
  fill(0);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text("PODIO", podioX, podioY - 10);
  
  // Posiciones
  const medallas = ["🥇", "🥈", "🥉"];
  for (let i = 0; i < 3; i++) {
    const yPos = podioY + 20 + i * 30;
    
    // Medalla y posición
    fill(0);
    textSize(14);
    text(medallas[i], podioX - 40, yPos);
    
    if (ordenLlegada[i] !== undefined) {
      const caballo = caballos[ordenLlegada[i]];
      // Color del caballo
      fill(caballo.color);
      noStroke();
      rect(podioX - 20, yPos - 6, 12, 12);
      
      // Nombre
      fill(0);
      textSize(10);
      textAlign(LEFT, CENTER);
      text(caballo.nombre.split(" ")[2] || caballo.nombre.split(" ")[1] || caballo.nombre.split(" ")[0], podioX, yPos);
    } else {
      fill(100);
      textSize(12);
      textAlign(LEFT, CENTER);
      text("---", podioX, yPos);
    }
  }
  
  // Biografía del ganador
  if (ordenLlegada[0] !== undefined) {
    const ganador = caballos[ordenLlegada[0]];
    fill(255, 255, 255, 200);
    stroke(0);
    strokeWeight(1);
    rect(podioX - 60, podioY + 110, 120, 80, 10);
    
    fill(0);
    textSize(12);
    textAlign(CENTER, CENTER);
    text("GANADOR:", podioX, podioY + 120);
    
    fill(ganador.color);
    rect(podioX - 5, podioY + 130, 10, 10);
    
    fill(0);
    textSize(10);
    textAlign(CENTER, CENTER);
    text(ganador.nombre, podioX, podioY + 145);
    
    textSize(8);
    text("Ver consola para", podioX, podioY + 160);
    text("biografía completa", podioX, podioY + 170);
  }
}

// ====== Movimiento ======
function tickMovimiento() {
  const pasos = new Array(NUM_CABALLOS).fill(0);

  for (let i = 0; i < NUM_CABALLOS; i++) {
    const h = caballos[i];
    if (h.terminado) continue;

    let paso;
    if (h.bloqueados > 0) {
      const ult = h.hist[h.hist.length-1];
      paso = (ult === 2) ? 1 : 2;
      h.bloqueados--;
    } else {
      paso = int(random(1, 4)); // Más variación en los pasos
    }
    pasos[i] = paso;
  }

  for (let i = 0; i < NUM_CABALLOS; i++) {
    const h = caballos[i];
    if (h.terminado) continue;

    h.pos += pasos[i];
    if (h.pos > CASILLAS) h.pos = CASILLAS;

    h.hist.push(pasos[i]); 
    if (h.hist.length > 3) h.hist.shift();
    
    // Bloquear si repite el mismo paso 3 veces
    if (h.hist.length === 3 && h.hist[0] === h.hist[1] && h.hist[1] === h.hist[2]) {
      h.bloqueados = 2;
    }

    if (!h.terminado && h.pos >= CASILLAS) {
      h.terminado = true;
      ordenLlegada.push(i);
      
      // Mostrar biografía del ganador en consola
      if (ordenLlegada.length === 1) {
        console.log("🏆 ¡GANADOR: " + h.nombre + "!");
        console.log("📖 Biografía: " + h.biografia);
      }
    }
  }

  if (ordenLlegada.length === NUM_CABALLOS) {
    carreraTerminada = true;
    carreraIniciada = false;
  }
}

// ====== Coordenadas rectangulares ======
function coordPorPos(p, laneIndex) {
  const cx = width/2;
  const cy = height/2;
  const w = width - 160;
  const h = height - 160;

  const laneCenter = (laneIndex - (NUM_CABALLOS-1)/2) * LANE_GAP;
  const per = 2*(w + h);
  const s = ((p / CASILLAS) * per + w/2) % per;

  if (s <= w) {
    return [cx - w/2 + s, cy + h/2 + laneCenter];
  } else if (s <= w + h) {
    const t = s - w;
    return [cx + w/2 + laneCenter, cy + h/2 - t];
  } else if (s <= 2*w + h) {
    const t = s - (w + h);
    return [cx + w/2 - t, cy - h/2 + laneCenter];
  } else {
    const t = s - (2*w + h);
    return [cx - w/2 + laneCenter, cy - h/2 + t];
  }
}

// ====== Controles p5.js ======
function keyPressed() {
  // Seleccionar caballo con teclas 1-5
  if (key >= '1' && key <= '5') {
    const nuevo = int(key) - 1;
    seleccionado = nuevo;
    return false;
  }
  
  // Iniciar carrera con ESPACIO
  if (key === ' ' && !carreraIniciada && seleccionado >= 0) {
    carreraIniciada = true;
    console.log("🎯 Seleccionaste: " + caballos[seleccionado].nombre);
    return false;
  }
  
  // Reiniciar con R
  if (key === 'r' || key === 'R') {
    reiniciarCarrera();
    return false;
  }
  
  return false;
}

// ====== Manejo de redimensionamiento p5.js ======
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
