//CONFIG Y CONTROL SE PUEDEN MODIFICAR A NECESIDAD


//---- CONFIGURACION -----
let AMP_MIN = 0.01; // umbral mínimo de sonido que supera al ruido de fondo
let AMP_MAX = 0.1; // amplitud máxima del sonido
let FREC_MIN = 126;
let FREC_MAX = 700;
let AMORTIGUACION = 0.1; //Entre mas bajo menos tarda en tomar el silencio
let tiempoMaxSonido = 5; // en segundos
let tiempoMinSilencio = 3; // en segundos

//--- CONTROL ----
let IMPRIMIR = false;


//--- FRECUENCIA ---
let frecuencia;
let frecuenciaAnterior;
let difDeFrecuencia;
const pitchModel = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

//--- AUDIO ---
let audioContext;
let mic;
let ampMedia;
let freqMedia;

//--- ESTADOS --- 
let haySonido = false;
let antesHabiaSonido = false;

//--- EVENTOS ---
let terminoElSonido = false;
let empezoElSonido = false;

//-- EXTRAS ---
let caminante1;
let caminante2;
let caminante3;
let guia;
let fuente;
let trabajar;

//listas para guardar datos mientras hay sonido
let listaAmp;
let listaFreq;
let listaDif;
//variables de promedio. son las que usamos para dibujar
let frecuProm;
let ampProm;
let difProm;
//sumatoria que usamos para sacar un promedio de los valores que agarran las listas
let sumatoriaAmp;
let sumatoriaFrec;
let sumatoriaDif;

// --- PARA LOS TIEMPOS ---
let tiempoInicio = 0; //tiempo de inicio del sonido
let duracionSonido = 0; //duracion del sonido en segundos
let duracionSilencio = 0; //duracion del silencio en segundos
let tiempoInicioSilencio = 0; //inicio del silencio

let yaTrabaje;

let img;
let lista1;
let lista2;
let lista3;
let lista4;

let trabajo1 = false;
let trabajo2 = false;
let trabajo3 = false;
let trabajo4 = false;
let marronTrabaja = false;

let curvasTotales = 20;
let caminante4;
let tiempoTotal;
let transcurrido;

let estadoMarron = false; //para marrones
let estadoNorm = true; //para celestes
let finale = false; //para terminar
let segundos;
let reinicio = false;
let trazos = [];


function preload() {
  cargar();
}

function setup() {
  createCanvas(800, 800, WEBGL);
  colorMode(HSB, 255, 100, 100, 255);
  background(100, 5, 95);
  fuente = loadFont('data/roboto-regular.ttf');

  //--- INICIALIZAMOS EL AUDIO ---
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);
  userStartAudio();

  //--- INICIALIZAMOS GESTOR Y DEMAS CLASES ---
  senial = new GestorSenial(AMP_MIN, AMP_MAX);
  senial.f = AMORTIGUACION;
  amp = senial.filtrada;
  ampMedia = (AMP_MAX + AMP_MIN) / 2;
  freqMedia = (FREC_MAX + FREC_MIN) / 2;
  guia = new Guia();

  lista1 = guia.dameUnaLista(0);
  lista2 = guia.dameUnaLista(1);
  lista3 = guia.dameUnaLista(2);
  lista4 = guia.dameUnaLista(3);

  caminante1 = new CaminanteB(lista1);
  caminante2 = new CaminanteB(lista2);
  caminante3 = new CaminanteB(lista3);
  caminante4 = new CaminanteB(lista4);
  ultimoCaminante = new CaminanteB(lista1);

  //--- INICIALIZAMOS LAS LISTAS Y LOS PROMEDIOS ---
  listaAmp = [];
  listaFreq = [];
  listaDif = [];

  frecuProm = 0;
  ampProm = 0;
  difProm = 0;
}

function draw() {
  translate(-width / 2, -height / 2);
  senial.actualizar(mic.getLevel());

  amp = senial.filtrada;
  haySonido = amp > AMP_MIN;
  difDeFrecuencia = frecuencia - frecuenciaAnterior;

  //-- DEFINIMOS LOS EVENTOS -- 
  terminoElSonido = !haySonido && antesHabiaSonido;
  empezoElSonido = haySonido && !antesHabiaSonido;

  tiempoTotal = millis();
  segundos = tiempoTotal.toFixed(2) / 1000 % 60;

  if ((segundos > 10 && segundos < 15) || (segundos > 30 && segundos < 40)) {
    estadoMarron = true;
  } else {
    estadoMarron = false;
  }
  if (segundos < 45) {
    estadoNorm = true;
  } else {
    estadoNorm = false;
  }

  if (segundos >= 45) {
    finale = true;
    console.log("termine");
  } else {
    finale = false;
  }

  if (estadoMarron) {
    ultimoCaminante.dibujarMarron();
    ultimoCaminante.avanzar();
  }
  if (finale) {
    caminante1.avanzar();
    caminante2.avanzar();
    caminante3.avanzar();
    caminante4.avanzar();
    ultimoCaminante.avanzar();
  }

  //-- INICIAMOS EL CONTADOR DE SONIDO --
  if (empezoElSonido) {
    tiempoInicio = millis();
  }
  //-- INICIAMOS LAS LISTAS --
  if (haySonido) {

    listaAmp.push(amp);
    listaFreq.push(frecuencia);
    listaDif.push(difDeFrecuencia);

    //-- CORTAMOS EL CONTADOR DE SONIDO EN EL EVENTO -- 
    if (terminoElSonido) {
      tiempoInicio = millis();
      tiempoInicioSilencio = millis();
    }
  }

  if (!haySonido) {
    duracionSilencio = (millis() - tiempoInicioSilencio) / 1000;
  }

  //-- CONDICIONES PARA DIBUJAR: SONIDO MAS LARGO QUE EL TIEMPO MAXIMO O SILENCIO MAS LARGO QUE EL TIEMPO MINIMO
  if (estadoNorm) {
    if (terminoElSonido) {
      if (duracionSonido.toFixed(2) > tiempoMaxSonido || duracionSilencio.toFixed(2) > tiempoMinSilencio) {
        trabajar = true;
        // -- DIBUJAMOS --
        if (trabajar) {
          guia.actualizar();
          guia.dibujar();
          // reestablecer las listas
          listaAmp = [];
          listaFreq = [];
          listaDif = [];
          trabajar = false;
        }
      }
    }

    if (trabajo1) {
      caminante1.caminaste();
      if (caminante1.listo()) {
        trabajo1 = false;
      }
    }

    if (trabajo2) {
      caminante2.caminaste();
      if (caminante2.listo()) {
        trabajo2 = false;
      }
    }


    if (trabajo3) {
      caminante3.caminaste();
      if (caminante3.listo()) {
        trabajo3 = false;
      }
    }

    if (trabajo4) {
      caminante4.caminaste();
      if (caminante4.listo()) {
        trabajo4 = false;
      }
    }
  }

  // -- ACTUALIZA LA DURACION SI HAY SONIDO -- 
  if (haySonido) {
    duracionSonido = (millis() - tiempoInicio) / 1000;
  }
  // -- REINICIO --
  if (segundos >= 59) {
    reinicio = true;
  } else {
    reinicio = false;
  }

  if (reinicio) {
    lista1 = [];
    lista2 = [];
    lista3 = [];
    lista4 = [];
    segundos = (millis() - tiempoTotal);
    estadoNorm = true;
    caminante1.reiniciarCaminante();
    caminante2.reiniciarCaminante();
    caminante3.reiniciarCaminante();
    caminante4.reiniciarCaminante();
    ultimoCaminante.reiniciarCaminante();
    reiniciar();
    console.log("listo");
  }

  // -- CONTROL --
  if (IMPRIMIR) {
    printData();
  }
  frecuenciaAnterior = frecuencia;
  antesHabiaSonido = haySonido;
}

// -- FUNCIONES PITCH -- 
function startPitch() {
  pitch = ml5.pitchDetection(pitchModel, audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (frequency) {
      frecuencia = frequency;
    }
    getPitch();
  });
}

//-- LO QUE IMPRIMIMOS EN EL CONTROL -- 
function printData() {
  background(255);
  push();
  textSize(16);
  fill(0);
  let texto;
  textFont(fuente);

  texto = 'amplitud: ' + senial.filtrada;
  text(texto, 20, 20);

  fill(0);
  ellipse(width / 2, height - senial.filtrada * 300, 30, 30);
  texto = 'frecuencia: ' + frecuencia;
  text(texto, 10, 40);
  texto = 'dif de frecuencia: ' + difDeFrecuencia;
  text(texto, 10, 60);

  fill(0);
  textSize(16);
  text("tiempo total transcurrido: " + tiempoTotal.toFixed(2) + " segundos", 10, 80);
  fill(0);
  textSize(20);
  text("duracion del silencio: " + duracionSilencio.toFixed(2) + " segundos", 10, 100);

  pop();

  senial.dibujar(100, 500);
}

function cargar() {
  for (var i = 0; i < 4; i++) {
    var nameImg = 'data/trazo0' + i + '.png';
    trazos[i] = loadImage(nameImg);
    trazos[i].mask(trazos[i]);
  }
}

function reiniciar() {
  clear();
  createCanvas(800, 800, WEBGL);
  colorMode(HSB, 255, 100, 100, 255);
  background(100, 5, 95);
}

