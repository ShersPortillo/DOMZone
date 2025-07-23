/**
 * ========================================
 * GENERADOR DE MEMES - SCRIPT PRINCIPAL
 * ========================================
 *
 * Este archivo contiene toda la lógica de interacción, generación y manipulación
 * del DOM para la aplicación de creación de memes. Incluye:
 *  - Selección y manipulación de elementos
 *  - Manejo de eventos
 *  - Generación de memes y galería
 *  - Temas y animaciones
 *  - Utilidades y estadísticas
 */

// =============================
// VARIABLES DE ESTADO GLOBAL
// =============================
let memeCount = 0; // Contador de memes creados
let memesCreated = []; // Almacena los datos de los memes creados en la sesión actual
let isDarkTheme = false; // Estado del tema (claro/oscuro)

// =============================
// SELECCIÓN DE ELEMENTOS DEL DOM
// =============================
// Selección rápida y directa de elementos únicos por ID
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const imageSelect = document.getElementById('imageSelect');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const fontColorInput = document.getElementById('fontColor');
const generateBtn = document.getElementById('generateBtn');
const randomBtn = document.getElementById('randomBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const downloadSection = document.getElementById('downloadSection');
const memeGallery = document.getElementById('memeGallery');
const memeCountSpan = document.getElementById('memeCount');
const lastCreatedSpan = document.getElementById('lastCreated');

// Selección por selectores CSS (clases, etiquetas)
const body = document.querySelector('body');
const mainTitle = document.querySelector('.main-title');
const emptyGallery = document.querySelector('.empty-gallery');

// Selección masiva por clase (HTMLCollection)
const buttons = document.getElementsByClassName('btn');
const controlGroups = document.getElementsByClassName('control-group');

// =============================
// EVENTOS PRINCIPALES Y TOGGLE DE TEMA
// =============================
// Switch de tema en el navbar
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.checked = isDarkTheme;
    themeToggle.addEventListener('change', changeTheme);
}

// =============================
// EVENTOS DE INTERFAZ PRINCIPALES
// =============================

// Generar meme al hacer clic
generateBtn.addEventListener('click', generateMeme);

// Generar meme aleatorio
randomBtn.addEventListener('click', generateRandomMeme);

// Limpiar todo el formulario
clearBtn.addEventListener('click', clearAll);

// Descargar meme generado
downloadBtn.addEventListener('click', downloadMeme);

// =============================
// FUNCIONES PRINCIPALES
// =============================

/**
 * Genera un meme con los parámetros especificados por el usuario.
 * - Carga la imagen seleccionada
 * - Aplica los textos superior e inferior
 * - Usa el color seleccionado
 * - Actualiza el contador y estadísticas
 */
function generateMeme() {
    const imageUrl = imageSelect.value;
    const topText = topTextInput.value.toUpperCase();
    const bottomText = bottomTextInput.value.toUpperCase();
    const fontColor = fontColorInput.value;

    // === MANIPULACIÓN DEL DOM: Feedback visual de error en inputs ===
    if (!topText && !bottomText) {
        topTextInput.style.borderColor = '#ff6b6b';
        bottomTextInput.style.borderColor = '#ff6b6b';
        setTimeout(() => {
            topTextInput.style.borderColor = '#e1e5e9';
            bottomTextInput.style.borderColor = '#e1e5e9';
        }, 2000);
        // === MANIPULACIÓN DEL DOM: Alerta al usuario ===
        alert('¡Agrega al menos un texto para tu meme!');
        return;
    }

    // === MANIPULACIÓN DEL DOM: Canvas y textos ===
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Dibujar imagen de fondo
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Configurar estilo del texto
        ctx.fillStyle = fontColor;
        ctx.strokeStyle = '#000000';
        const fontSize = Math.floor(canvas.width / 10);
        ctx.font = `bold ${fontSize}px Impact, Arial`;
        ctx.lineWidth = Math.floor(fontSize / 20);
        ctx.textAlign = 'center';
        // === MANIPULACIÓN DEL DOM: Texto superior ===
        if (topText) {
            const topY = fontSize * 1.2;
            ctx.fillText(topText, canvas.width / 2, topY);
            ctx.strokeText(topText, canvas.width / 2, topY);
        }
        // === MANIPULACIÓN DEL DOM: Texto inferior ===
        if (bottomText) {
            ctx.fillText(bottomText, canvas.width / 2, canvas.height - (fontSize * 0.2));
            ctx.strokeText(bottomText, canvas.width / 2, canvas.height - (fontSize * 0.2));
        }
        // === MANIPULACIÓN DEL DOM: Mostrar sección de descarga ===
        downloadSection.style.display = 'block';
        updateStats();
        addToGallery();
        showSuccessEffect();
    };
    img.src = imageUrl;
}

/**
 * Genera un meme con contenido completamente aleatorio.
 * Selecciona imagen, textos y color aleatoriamente.
 */
function generateRandomMeme() {
    // Se define una estructura de datos (array de arrays de objetos) para almacenar
    // pares de textos coherentes para cada plantilla de meme.
    const memeTemplates = [
        // Distracted Boyfriend
        [
            { top: 'YO', bottom: 'MI PROYECTO ACTUAL' },
            { top: 'CUANDO VEO OTRA TECNOLOGÍA', bottom: 'NUEVO FRAMEWORK' },
            { top: 'MI ATENCIÓN EN CLASE', bottom: 'EL PROFE EXPLICANDO' }
        ],
        // Drake Pointing
        [
            { top: 'USAR VAR', bottom: 'USAR CONST/LET' },
            { top: 'CÓDIGO SIN COMENTARIOS', bottom: 'CÓDIGO DOCUMENTADO' },
            { top: 'TRABAJAR SIN GIT', bottom: 'COMMITS FRECUENTES' }
        ],
        // Expanding Brain
        [
            { top: 'IF ANIDADO', bottom: 'PROGRAMACIÓN FUNCIONAL' },
            { top: 'SWITCH CASE', bottom: 'RECURSIÓN' },
            { top: 'OPERADOR TERNARIO', bottom: 'IA ESCRIBIENDO EL CÓDIGO' }
        ],
        // Surprised Pikachu
        [
            { top: 'NO HAGO BACKUP', bottom: 'SE BORRA TODO' },
            { top: 'EL PROFE ANUNCIA EXAMEN', bottom: 'TODOS SORPRENDIDOS' },
            { top: 'EL CLIENTE CAMBIA TODO', bottom: 'HAY QUE REHACER EL PROYECTO' }
        ],
        // Success Kid
        [
            { top: 'ESTUDIÉ 5 MINUTOS', bottom: 'SAQUÉ 10 EN EL EXAMEN' },
            { top: 'ESCRIBÍ CÓDIGO SIN ERRORES', bottom: 'FUNCIONÓ A LA PRIMERA' },
            { top: 'ME ACORDÉ DE GUARDAR', bottom: 'NO PERDÍ NADA' }
        ],
        // Woman Yelling at Cat
        [
            { top: 'EL PROFE: "NO HAY EXTENSIÓN"', bottom: 'YO: "PERO SÍ LA HAY"' },
            { top: 'CLIENTE: "NO FUNCIONA"', bottom: 'EL SISTEMA FUNCIONA PERFECTO' },
            { top: 'MI MAMÁ: "APAGA LA COMPUTADORA"', bottom: 'YO: "ESTOY PROGRAMANDO"' }
        ]
    ];

    const randomColors = ['#ffffff', '#ffff00', '#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#f093fb', '#4ecdc4', '#764ba2'];

    // Seleccionar imagen aleatoria
    const randomImageIndex = Math.floor(Math.random() * imageSelect.options.length);
    imageSelect.selectedIndex = randomImageIndex;
    // Seleccionar textos y color aleatorios
    const templatePairs = memeTemplates[randomImageIndex] || memeTemplates[0];
    const randomPair = templatePairs[Math.floor(Math.random() * templatePairs.length)];
    const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
    // === MANIPULACIÓN DEL DOM: Actualizar inputs con valores aleatorios ===
    topTextInput.value = randomPair.top;
    bottomTextInput.value = randomPair.bottom;
    fontColorInput.value = randomColor;
    generateMeme();
    // === MANIPULACIÓN DEL DOM: Efecto visual en botón aleatorio ===
    randomBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        randomBtn.style.transform = 'none';
    }, 500);
}

/**
 * Restaura todos los valores a su estado inicial y limpia el canvas.
 */
function clearAll() {
    // === MANIPULACIÓN DEL DOM: Limpiar inputs y canvas ===
    topTextInput.value = '';
    bottomTextInput.value = '';
    fontColorInput.value = '#ffffff';
    imageSelect.selectedIndex = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // === MANIPULACIÓN DEL DOM: Ocultar sección de descarga ===
    downloadSection.style.display = 'none';
    // === MANIPULACIÓN DEL DOM: Efecto visual de limpieza en canvas ===
    canvas.style.opacity = '0.5';
    setTimeout(() => {
        canvas.style.opacity = '1';
    }, 300);
    // === MANIPULACIÓN DEL DOM: Feedback visual en botón limpiar ===
    clearBtn.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
    clearBtn.textContent = '¡Limpiado!';
    setTimeout(() => {
        clearBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
        clearBtn.textContent = 'Limpiar Todo';
    }, 1500);
}

// =============================
// FUNCIONES AUXILIARES
// =============================

/**
 * Actualiza el contador y la hora del último meme creado.
 */
function updateStats() {
    memeCount++;
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES');

    // === MANIPULACIÓN DEL DOM: Actualizar estadísticas en el footer ===
    memeCountSpan.textContent = memeCount;
    lastCreatedSpan.textContent = timeString;
}

/**
 * Agrega el meme generado a la galería visual y al array de sesión.
 */
function addToGallery() {
    // Convierte el contenido actual del canvas a una imagen en formato base64.
    // Esto permite mostrarlo en un elemento <img> o guardarlo.
    const imageData = canvas.toDataURL();

    // Crear elemento de galería
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = imageData;
    img.alt = 'Meme creado';

    galleryItem.appendChild(img);
    // === MANIPULACIÓN DEL DOM: Ocultar mensaje de galería vacía ===
    if (emptyGallery) {
        emptyGallery.style.display = 'none';
    }
    // === MANIPULACIÓN DEL DOM: Agregar nuevo meme a la galería ===
    memeGallery.appendChild(galleryItem);

    // Guardar en array
    memesCreated.push(imageData);

    // === MANIPULACIÓN DEL DOM: Animación de entrada para el nuevo meme ===
    galleryItem.style.opacity = '0';
    galleryItem.style.transform = 'scale(0.5)';
    setTimeout(() => {
        galleryItem.style.transition = 'all 0.5s ease';
        galleryItem.style.opacity = '1';
        galleryItem.style.transform = 'scale(1)';
    }, 100);
}

/**
 * Descarga el meme generado como imagen PNG.
 */
function downloadMeme() {
    // Se crea un elemento <a> temporal en memoria.
    const link = document.createElement('a');
    // Se le asigna un nombre de archivo único con la fecha actual.
    link.download = `meme_${Date.now()}.png`;
    // Se le asigna la imagen del canvas como su URL.
    link.href = canvas.toDataURL();
    // Se simula un clic en el enlace para iniciar la descarga.
    link.click();

    // === MANIPULACIÓN DEL DOM: Feedback visual en botón de descarga ===
    downloadBtn.textContent = '¡Descargado!';
    downloadBtn.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
    setTimeout(() => {
        downloadBtn.textContent = 'Descargar Meme';
        downloadBtn.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
    }, 2000);
}

/**
 * Muestra un efecto visual de éxito en el canvas.
 */
function showSuccessEffect() {
    // === MANIPULACIÓN DEL DOM: Efecto visual de éxito en canvas ===
    canvas.style.transform = 'scale(1.05)';
    canvas.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.6)';
    setTimeout(() => {
        canvas.style.transform = 'scale(1)';
        canvas.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    }, 500);
}

// =============================
// FUNCIONES ADICIONALES (FOOTER, TIPS, ESTADÍSTICAS)
// =============================

/**
 * Muestra un tip aleatorio en el título principal temporalmente.
 */
function showTips() {
    const tips = [
        '💡 Usa textos cortos y directos',
        '🎨 Contrasta el color del texto con la imagen',
        '😂 Piensa en situaciones cotidianas graciosas',
        '🔥 Los memes actuales funcionan mejor',
        '⚡ Menos es más: simplicidad es clave'
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    // MANIPULACIÓN DOM: Mostrar un tip aleatorio en el título principal de forma temporal.
    const originalTitle = mainTitle.textContent;
    mainTitle.textContent = randomTip;
    mainTitle.style.fontSize = '1.8rem';
    mainTitle.style.color = '#ffff00';

    setTimeout(() => {
        mainTitle.textContent = originalTitle;
        mainTitle.style.fontSize = '2.5rem';
        mainTitle.style.color = 'white';
    }, 4000);
}

/**
 * Muestra estadísticas detalladas de la sesión actual.
 */
function showStats() {
    const totalTexts = topTextInput.value.length + bottomTextInput.value.length;
    const averageLength = memesCreated.length > 0 ? totalTexts / memesCreated.length : 0;

    const statsMessage = `📊 Estadísticas Detalladas:
    • Memes creados: ${memeCount}
    • Promedio caracteres: ${Math.round(averageLength)}
    • Imagen favorita: ${imageSelect.options[imageSelect.selectedIndex].text}
    • Productividad: ${memeCount > 5 ? 'Alta' : memeCount > 2 ? 'Media' : 'Baja'} 🚀`;

    alert(statsMessage);

    // MANIPULACIÓN DOM: Efecto en las estadísticas del footer
    const statsSection = document.getElementById('stats');
    statsSection.style.background = 'rgba(102, 126, 234, 0.3)';
    statsSection.style.transform = 'scale(1.05)';

    setTimeout(() => {
        statsSection.style.background = 'rgba(255, 255, 255, 0.1)';
        statsSection.style.transform = 'scale(1)';
    }, 2000);
}

/**
 * Cambia el tema de la página (claro/oscuro) y aplica efectos visuales.
 */
function changeTheme() {
    isDarkTheme = !isDarkTheme;

    // MANIPULACIÓN DOM: Toggle clase del tema oscuro
    if (isDarkTheme) {
        body.classList.add('dark-theme');

        // Se itera sobre la HTMLCollection de botones para aplicar un filtro.
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.filter = 'brightness(1.2)';
        }


    } else {
        body.classList.remove('dark-theme');

        // Se restaura el estilo original de los botones.
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].style.filter = 'none';
        }


    }

    // MANIPULACIÓN DOM: Efecto de transición suave
    body.style.transition = 'all 0.5s ease';
}

// =============================
// INICIALIZACIÓN Y EVENTOS ADICIONALES
// =============================

/**
 * Inicialización al cargar la página: configura canvas, efectos y mensaje de bienvenida.
 */
document.addEventListener('DOMContentLoaded', function () {
    // Configuración inicial del canvas
    canvas.style.transition = 'all 0.3s ease';

    // Efecto hover sutil en los grupos de controles
    for (let i = 0; i < controlGroups.length; i++) {
        controlGroups[i].addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'all 0.3s ease';
        });
        controlGroups[i].addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    }

    // Cargar imagen por defecto
    loadDefaultImage();

    // Mensaje de bienvenida y resumen de funcionalidades
    console.log('🎭 Generador de Memes cargado exitosamente!');
    console.log('💻 Funcionalidades DOM implementadas: getElementById, querySelector, getElementsByClassName');
    console.log('🎯 Acciones: Generar meme, aleatorio, limpiar, descargar, cambiar tema');
});

/**
 * Carga la imagen por defecto en el canvas y muestra un texto de bienvenida.
 */
function loadDefaultImage() {
    const img = new Image();
    // Necesario para poder dibujar la imagen en el canvas si proviene de otro dominio.
    img.crossOrigin = 'anonymous';

    // Se asegura que la imagen esté cargada antes de intentar dibujarla.
    img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Se calcula un tamaño de fuente ligeramente más pequeño para el texto de bienvenida.
        const fontSize = Math.floor(canvas.width / 14);
        // Agregar texto de bienvenida
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.floor(fontSize / 20);
        ctx.font = `bold ${fontSize}px Impact, Arial`;
        ctx.textAlign = 'center';

        // Se centra el texto verticalmente.
        ctx.fillText('¡CREA TU MEME AQUÍ!', canvas.width / 2, canvas.height / 2 + (fontSize / 4));
        ctx.strokeText('¡CREA TU MEME AQUÍ!', canvas.width / 2, canvas.height / 2 + (fontSize / 4));
    };

    img.src = imageSelect.value;
}

// =============================
// VALIDACIÓN EN TIEMPO REAL DE INPUTS
// =============================
topTextInput.addEventListener('input', function () {
    // Cambia el estilo según la longitud del texto
    if (this.value.length > 30) {
        this.style.borderColor = '#f39c12';
        this.style.boxShadow = '0 0 5px rgba(243, 156, 18, 0.5)';
    } else {
        this.style.borderColor = '#27ae60';
        this.style.boxShadow = '0 0 5px rgba(39, 174, 96, 0.3)';
    }
});
bottomTextInput.addEventListener('input', function () {
    if (this.value.length > 30) {
        this.style.borderColor = '#f39c12';
        this.style.boxShadow = '0 0 5px rgba(243, 156, 18, 0.5)';
    } else {
        this.style.borderColor = '#27ae60';
        this.style.boxShadow = '0 0 5px rgba(39, 174, 96, 0.3)';
    }
});

// =============================
// CAMBIO DE IMAGEN EN EL SELECTOR
// =============================
imageSelect.addEventListener('change', function () {
    // Efecto visual de "fade out" antes de cargar la nueva imagen
    canvas.style.opacity = '0.3';
    setTimeout(() => {
        loadDefaultImage();
        canvas.style.opacity = '1';
    }, 200);
});

// =============================
// ATAJOS DE TECLADO
// =============================
document.addEventListener('keydown', function (event) {
    // Ctrl/Cmd + Enter: Generar meme
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        generateMeme();
        generateBtn.style.background = '#27ae60';
        generateBtn.textContent = '¡Generado con atajo!';
        setTimeout(() => {
            generateBtn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
            generateBtn.textContent = 'Generar Meme';
        }, 2000);
    }
    // Ctrl/Cmd + Delete/Backspace: Limpiar todo
    if ((event.ctrlKey || event.metaKey) && (event.key === 'Delete' || event.key === 'Backspace')) {
        event.preventDefault();
        clearAll();
    }
});

// =============================
// ANIMACIÓN AL HACER SCROLL
// =============================
/**
 * Anima las secciones principales cuando aparecen en pantalla al hacer scroll.
 */
function animateOnScroll() {
    const elements = document.querySelectorAll('.creator-section, .gallery-section');
    elements.forEach(element => {
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;
        const viewportTop = window.pageYOffset;
        const viewportBottom = viewportTop + window.innerHeight;
        if (elementBottom > viewportTop && elementTop < viewportBottom) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}
window.addEventListener('scroll', animateOnScroll);
