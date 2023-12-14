// Capturar elements del DOM
const teclat = document.getElementById("teclat");
const hores = document.getElementById("hores");
const minuts = document.getElementById("minuts");
const segons = document.getElementById("segons");
const contador = document.getElementById("contador");
const errors = document.getElementById("errors");
const paraula = document.getElementById("paraula");
const boto = document.getElementById("boto");
const text = document.getElementById("text");
const select = document.getElementById("select");
const compteEnrrere = document.getElementById("compteEnrrere");

// Variables per el Joc
let paraulaAEndevinar = "";
let caractersEndivitats = Array(paraulaAEndevinar.length);
let varErrors = 0;
let varIntents = 7;
let endivinat = false;
let penalizacioPerTemps = 0;
let interval;
let intervalCompteEnrrere;
let tempsCompteEnrrere = 10;
let temps = new Date();
let jsonArray;

temps.setHours(0, 0, 0, 0);

/* FUNCIONS */

// Funcio per iniciar una nova partida
function iniciarPartida() {
  paraulaAleatoria(select.value);
  penalizacioPerTemps = 0;
  reiniciar();
  començar();
  let tecles = document.querySelectorAll(".lletra");
  tecles.forEach(function (tecla) {
    tecla.classList.remove("incorrecta");
    tecla.classList.remove("correcta");
  });
  text.innerText = "";
  paraula.innerText = "";
  teclat.classList.remove("desabilitat");
  varErrors = 0;
  varIntents = 7;
  contador.innerHTML = varIntents;
  errors.innerHTML = varErrors;
  reiniciarCompteEnrrere();
}

// Funcio per el cronometre
function crono() {
  let varHores = temps.getHours();
  let varMinuts = temps.getMinutes();
  let varSegons = temps.getSeconds();

  varSegons += 1;

  if (varSegons == 60) {
    varSegons = 0;
    varMinuts += 1;
  }

  if (varMinuts == 60) {
    varMinuts = 0;
    varHores += 1;
  }

  temps.setSeconds(varSegons);
  temps.setMinutes(varMinuts);
  temps.setHours(varHores);

  // Formatejar i mostrar el temps en el HTML
  if (varHores < 10) {
    varHores = "0" + varHores;
  }
  if (varMinuts < 10) {
    varMinuts = "0" + varMinuts;
  }
  if (varSegons < 10) {
    varSegons = "0" + varSegons;
  }

  hores.innerHTML = varHores;
  minuts.innerHTML = varMinuts;
  segons.innerHTML = varSegons;
}

// Funcio per formatejar el temp en milisegons
function formatTemps(tempsEnMilisegons) {
  const segonsTotals = Math.floor(tempsEnMilisegons / 1000);
  const minuts = Math.floor((segonsTotals % 3600) / 60);
  const segons = segonsTotals % 60;

  const formatMinuts = minuts < 10 ? '0' + minuts : minuts;
  const formatSegons = segons < 10 ? '0' + segons : segons;

  return `${formatMinuts}:${formatSegons}`;
}

// Funcio per iniciar el comptador enrrere
function iniciarCompteEnrrere() {
  intervalCompteEnrrere = setInterval(() => {
    tempsCompteEnrrere--;
    compteEnrrere.innerText = tempsCompteEnrrere;

    if (tempsCompteEnrrere === 0) {
      varIntents--;
      contador.innerHTML = varIntents;
      reiniciarCompteEnrrere();
    }
  }, 1000);
}

// Funcio per reiniciar el compte enrrere
function reiniciarCompteEnrrere() {
  clearInterval(intervalCompteEnrrere);
  tempsCompteEnrrere = 10;
  compteEnrrere.innerText = tempsCompteEnrrere;
  iniciarCompteEnrrere();
}

// Funcio per aturar el compte enrrere
function aturarCompteEnrrere() {
  clearInterval(intervalCompteEnrrere);
}

// Funcio per avançar en el torn del joc al seleccionar una lletra
function avançarTorn(element) {
  aturarCompteEnrrere();

  penalizacioPerTemps = 0;
  endivinat = true;
  let caracter = element.innerText;
  paraula.innerText = "";
  let caractersEndivitatsAntic = [...caractersEndivitats];

  for (let index = 0; index < paraulaAEndevinar.length; index++) {
    let caracterActual = paraulaAEndevinar[index];
    if (caracterActual == caracter) {
      caractersEndivitats[index] = true;
      element.classList.add("correcta");
    }
    if (caractersEndivitats[index] == true) {
      paraula.innerText += " " + caracterActual + " ";
    } else {
      endivinat = false;
      paraula.innerText += " _ ";
    }
  }

  if (
    JSON.stringify(caractersEndivitats) ==
    JSON.stringify(caractersEndivitatsAntic)
  ) {
    element.classList.add("incorrecta");
    varIntents--;
    varErrors++;
    contador.innerHTML = varIntents;
    errors.innerHTML = varErrors;
  }

  reiniciarCompteEnrrere();
  acabarPartida();
}

// Funcio per acabar la partida i mostrar el resultat
function acabarPartida() {
  const popup = document.getElementById("popup");
  const popupTitol = document.getElementById("popup-titol");
  const popupMissatge = document.getElementById("popup-missatge");

  if (endivinat || varIntents === 0) {
    aturar();
    aturarCompteEnrrere();
    teclat.classList.add("desabilitat");
    boto.disabled = false;

    if (endivinat) {
      const estadistiques = {
        word: paraulaAEndevinar,
        errors: varErrors,
        time: formatTemps(temps.getTime()),
      };
      const historialEstadistiques = JSON.parse(localStorage.getItem('historialEstadistiques')) || [];
      historialEstadistiques.push(estadistiques);
      localStorage.setItem('historialEstadistiques', JSON.stringify(historialEstadistiques));

      popupTitol.innerHTML = "Felicitats, has guanyat!";
      popupMissatge.innerHTML = "¡Has endivinat la paraula correctament!<br><br>ESTADISTIQUES<br>Paraula: " + estadistiques.word + "<br>Errors: " + estadistiques.errors + "<br>Temps: " + estadistiques.time;
    } else {
      popupTitol.innerHTML = "Has perdut";
      popupMissatge.innerHTML = "La paraula a endivinar era: " + paraulaAEndevinar;
    }

    popup.style.display = "flex";
  }
}

// Funcio per començar el joc
function començar() {
  interval = setInterval(crono, 1000);
}

// Funcio per reiniciar el cronometre
function reiniciar() {
  temps.setHours(0, 0, 0, 0);
  hores.innerHTML = "00";
  minuts.innerHTML = "00";
  segons.innerHTML = "00";
}

// Funcio per aturar el cronometre
function aturar() {
  clearInterval(interval);
}

// Funcio per seleccionar una paraula aleatoria d'una categoria
function paraulaAleatoria(categoria) {
  obtenirJSON((error, dades) => {
    gestionaResposta(error, dades);
    paraulaAEndevinar = jsonArray[Math.floor(Math.random() * jsonArray.length)];
    caractersEndivitats = Array(paraulaAEndevinar.length);

    console.log(paraulaAEndevinar);

    for (let index = 0; index < paraulaAEndevinar.length; index++) {
      caractersEndivitats[index] = false;
      paraula.innerText += " _ ";
    }
  }, "JSON/" + categoria + ".json");
}

// Funcio per obtenir dades JSON mitjançant una sol·licitud XMLHttpRequest
const obtenirJSON = (callback, source) => {
  const peticio = new XMLHttpRequest();

  peticio.addEventListener("readystatechange", () => {
    if (peticio.readyState == 4 && peticio.status == 200) {
      const respuesta = JSON.parse(peticio.responseText);
      callback(undefined, respuesta);
    } else if (peticio.readyState === 4) {
      callback("No s'han pogut obtenir les dades", undefined);
    }
  });

  peticio.open("GET", source);
  peticio.send();
};

// Funcio per gestionar la resposta JSON
function gestionaResposta(error, dades) {
  if (error) {
    console.log(error);
  } else {
    jsonArray = dades;
  }
}

/* ESDEVENIMENTS */

// Afegir esdeveniment al boto de tancar del popup
const botoTancar = document.getElementById("boto-tancar");
botoTancar.addEventListener("click", () => {
  popup.style.display = "none";
  window.location.reload();
});

// Afegir esdeveniment al boto d'inici
boto.addEventListener("click", (e) => {
  boto.disabled = true;
  iniciarPartida();
});

// Afegir esdeveniment al teclat
teclat.addEventListener("click", (e) => {
  let element = e.target;
  if (element.classList.contains("lletra")) {
    avançarTorn(element);
  }
});