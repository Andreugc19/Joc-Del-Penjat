// Capturar elements del DOM
const contenidor = document.querySelector('.contenidor');
const lletres = document.querySelectorAll('.lletra:not(.incorrecta, .correcta)');
const contador = document.getElementById('contador');

ompleUI();

/* FUNCIONS */
function actualitzaLletra() {
    const lletresSeleccionades = document.querySelectorAll('.teclat .lletra');

    const lletraIndex = [...lletresSeleccionades].map((lletra) => [...lletres].indexOf(lletra));

    localStorage.setItem('lletresSeleccionades', JSON.stringify(lletraIndex));
}

function comptaEnrrera() {

}

function seleccioLletra() {

}

function ompleUI() {
    const lletresSeleccionades = JSON.parse(localStorage.getItem('lletresSeleccionades'));

    if(lletresSeleccionades !== null && lletresSeleccionades.length > 0) {
        lletres.forEach((lletra, index) => {
            if(lletresSeleccionades.indexOf(index) > 1) {
                lletra.classList.add('lletra');
            }
        });
    }
}

contenidor.addEventListener('click', (e) => {
    if(e.target.classList.contains('correcte') 
        && !e.target.classList.contains('incorrecta')) {
        e.target.classList.toggle('lletra');
        actualitzaLletra();
    }
});

actualitzaLletra();