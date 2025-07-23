const iniciarBtn = document.getElementById('iniciar');
const panel = document.getElementById('panel');
const tiempoDisplay = document.getElementById('tiempo');
const puntosDisplay = document.getElementById('puntos');

let puntos = 0;
const totalInsectos = 7;
let insectosMostrados = 0;
let insectosEnPantalla = 0;
let tiempoInicio = null;
let cronometro;
let tiempoTranscurrido = 0;
let juegoEnCurso = false;

let insectoTimeout = null;
let esperaTimeout = null;

iniciarBtn.addEventListener('click', iniciarJuego);

function iniciarJuego() {
    // Reiniciar variables
    puntos = 0;
    insectosMostrados = 0;
    insectosEnPantalla = 0;
    tiempoTranscurrido = 0;
    puntosDisplay.textContent = 'Puntos: 0';
    tiempoDisplay.textContent = 'Tiempo: 0s';

    // Iniciar cronómetro
    tiempoInicio = Date.now();
    juegoEnCurso = true;
    if (cronometro) clearInterval(cronometro);
    cronometro = setInterval(() => {
        const ahora = Date.now();
        tiempoTranscurrido = Math.floor((ahora - tiempoInicio) / 1000);
        tiempoDisplay.textContent = `Tiempo: ${tiempoTranscurrido}s`;
    }, 1000);

    // Comenzar a mostrar insecto
    mostrarInsecto();
}

function mostrarInsecto() {
    if (insectosMostrados >= totalInsectos) {
        // Solo terminar si no hay insectos en pantalla
        if (insectosEnPantalla === 0) {
            // Finaliza el juego
            clearInterval(cronometro);
            alert(`¡Juego terminado! Tiempo total: ${tiempoTranscurrido}s, Puntos: ${puntos}`);
            juegoEnCurso = false;
        }
        return;
    }

    // Crear insecto
    const insecto = document.createElement('img');
    insecto.className = 'insecto';
    insecto.src = './asset/mosquito.png';

    // Posición aleatoria en el panel
    const x = Math.random() * (panel.clientWidth - 50);
    const y = Math.random() * (panel.clientHeight - 50);
    insecto.style.left = `${x}px`;
    insecto.style.top = `${y}px`;

    // Evento clic
    insecto.onclick = () => {
        if (!juegoEnCurso) return;
        puntos++;
        puntosDisplay.textContent = `Puntos: ${puntos}`;
        eliminarInsecto(insecto);
        // Disminuir conteo en pantalla
        insectosEnPantalla--;
        // Mostrar siguiente insecto después de 1 segundo
        if (esperaTimeout) clearTimeout(esperaTimeout);
        esperaTimeout = setTimeout(() => {
            mostrarInsecto();
        }, 1000);
        checkFinalizacion();
    };

    // Agregar al panel
    panel.appendChild(insecto);
    insectosEnPantalla++;
    insectosMostrados++;

    // Programar desaparición automática en 3 segundos
    if (insectoTimeout) clearTimeout(insectoTimeout);
    insectoTimeout = setTimeout(() => {
        // Solo eliminar si todavía existe
        if (document.body.contains(insecto)) {
            eliminarInsecto(insecto);
            insectosEnPantalla--;
            checkFinalizacion();
            // Mostrar siguiente insecto después de 1 segundo
            esperaTimeout = setTimeout(() => {
                mostrarInsecto();
            }, 1000);
        }
    }, 3000);
}

function eliminarInsecto(insecto) {
    if (insecto && insecto.parentNode === panel) {
        panel.removeChild(insecto);
    }
}

function checkFinalizacion() {
    // Finaliza solo si ya mostraron todos los insectos y no hay ninguno en pantalla
    if (insectosMostrados >= totalInsectos && insectosEnPantalla === 0) {
        clearInterval(cronometro);
        alert(`¡Juego terminado! Tiempo total: ${tiempoTranscurrido}s, Puntos: ${puntos}`);
        juegoEnCurso = false;
    }
}
