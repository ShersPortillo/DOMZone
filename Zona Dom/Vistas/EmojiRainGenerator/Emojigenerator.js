const boton = document.querySelector(".btn-lluvia");
let atrapados = 0; //variable para contar emojis 

boton.addEventListener('click', () => {
    //agregamos la funcion de cambiar el texto del boton temporalmente
    boton.innerText = 'Estan lloviendo emojis!';

    //cambiamos el cursor a una red de mariposas agregando la clase
    document.body.classList.add('red-cursor');


    const lluvia = setInterval(() => {
        crearEmoji();

    }, 200); //cada 200 milisegundo crea un emoji

    //detener la lluvia de emojis cada 5 sigundos
    setTimeout(() => {
       clearInterval(lluvia);

        //se espera el tiempo de caida de los ultimos emojis antes de quitar la red
        setTimeout(() => {
            document.body.classList.remove('red-cursor'); //quitamos el emoji de red de mariposa una ves que termine la lluvia
             boton.innerText = '🌧🌧 Comenzar lluvia de emojis';

             //se muestra el numero de emojis atrapados
             resultado.innerText = `Atrapastes ${atrapados} emojis!`;

             //reiniciar el contador para la siguiente ronda
             atrapados = 0;
        }, 3000);
    }, 7000); 
});

const contenedor = document.querySelector('.emoji-container');

function crearEmoji(){
    const emoji = document.createElement('div');
    emoji.classList.add('emoji');

    //se elige un emoji aleatorio de la lista 
    const emojis = ['😀','😁','😂','🤣','🌟','😅','😉','😋','😎','😊','🥶','👻','🍁','🙀','🎈','🎇','😭','🤧','🥺','🌺','🌸'];
    emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];

    //posicion horizontal aleatoriamente
    emoji.style.left = Math.random() * window.innerWidth + 'px';
     
    //se agrega un emoji al contenedor 
    contenedor.appendChild(emoji);
 
    //eliminar los emojis despues de la animacion
    emoji.addEventListener('animationend', () => {
        emoji.remove();
    });

    //Funcion de eliminar emoji cuando pase el cursor sobre ellos 
    emoji.addEventListener('mouseover', () => {
        atrapados ++; //aumenta uno cada ves que se atrape un emoji
        emoji.remove();
    });
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

//CUANTOS ACCIONES DE MANIPULACION DEL DOM HICE ?
//en total 8 acciones las cuales son:
// Seleccion de elementos
// Creacion de elementos 
// Agregado de elementos 
// Modificacion de estilos
// Manipulacion de clases CSS
// Modificacion de textos
// Eliminacion de elementos
// Escuchar Eventos