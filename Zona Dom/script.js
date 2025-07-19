// Manipulation 1: Cambio de tema claro/oscuro
const themeToggle = document.querySelector('.theme-toggle');
let darkMode = localStorage.getItem('darkMode') === 'true';

// Aplicar el modo almacenado al cargar la página 
if (darkMode) {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = 'Modo Claro';
}

themeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode');
    
    // Guardar  en localStorage
    localStorage.setItem('darkMode', darkMode);
    
    if (darkMode) {
        themeToggle.textContent = 'Modo Claro';
    } else {
        themeToggle.textContent = 'Modo Oscuro';
    }
});


// Manipulation 2: Efecto de cambiar el encabezado 
const header = document.querySelector('.header-title'); 
const originalText = header.textContent;

header.addEventListener('mouseenter', () => {
    header.textContent = '🎮 ¡Presiona para comenzar la diversión!';
});

header.addEventListener('mouseleave', () => {
    header.textContent = originalText;
    header.style.color = ''; 
});

// Manipulation 3: Notificación flotante al seleccionar un juego
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Prevenir el comportamiento predeterminado del enlace
        e.preventDefault();
        
        const gameName = this.querySelector('h2').textContent;
        const targetUrl = this.getAttribute('href');
        
        showGameNotification(`Redirigiendo a: ${gameName}`, () => {
            // Redirigir después de que la notificación se muestre
            window.location.href = targetUrl;
        });
    });
});

function showGameNotification(message, callback) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'game-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Ejecutar el callback después de 0.5 segundos para que se vean y no inicie inmediatamente
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        
        // Eliminar completamente después de la animación
        setTimeout(() => {
            notification.remove();
            if (callback) callback();
        }, 300);
    }, 500);
}