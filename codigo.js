
// Todas las constantes serán escritas aquí


const grid = document.querySelector('.grid');

const resultDisplay = document.querySelector('.results');

const figureWin = document.querySelector('.figure img')

let results = 0;

let currentShooterIndex = 405;

const width = 30;

let goingRight = true;

let direction = 1;

let timerId;

let laserId;

let aliensRemoved = [];

// creamos todos los cuadros que estarán contenidos en la grilla. Como es un cuadrado de 1200 x 600 y cada cuadro es de 40x40 entonces tenemos un total de 450 cuadros 

for (let i = 0; i < 450; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);

}

const squares = [...document.querySelectorAll('.grid div')];

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
    90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109
    
]

// la función dibujar (draw()), nos permite dibujar los aliens en los caudros seleccionados en el Array anterior.

function draw () {
    for ( let i = 0; i < alienInvaders.length; i++) {

        if (!aliensRemoved.includes(i)) { 
        squares[alienInvaders[i]].classList.add('invader');
      }
    }
}

draw ();

function remove () {
    for ( let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader');

    }
}

squares[currentShooterIndex].classList.add('shooter');

// creamos una función que permita mover la nave tocando las teclas direccionales izquierda y derecha.

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter');
    switch(e.key) {
        case 'ArrowLeft':
            if(currentShooterIndex % width !== 0) {
                currentShooterIndex--
            } break;

        case 'ArrowRight':
            if(currentShooterIndex % width !== width - 1) {
                currentShooterIndex++
            } break;
    }
    squares[currentShooterIndex].classList.add('shooter');
}

document.addEventListener('keydown', moveShooter);

// Creamos una función que permita el movimiento de los aliens... Es importante que esta función se realicé cada intervalo de tiempo

function moveInvaders () {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove ()
   // Esto es para permitir el movimiento de los aliens, y que cuando toquen el bordes, estos bajen una linea completa
    if (rightEdge && goingRight) {
        for ( let i = 0; i < alienInvaders.length; i++) { 
            alienInvaders[i] += width + 1;
            direction = -1;
            goingRight = false;
          }
    }

    if (leftEdge && !goingRight) {
        for ( let i = 0; i < alienInvaders.length; i++) { 
            alienInvaders[i] += width - 1;
            direction = 1;
            goingRight = true;
         }
    }

    for ( let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw();

    // Verificamos cuando se pierde... El primer caso es cuando los aliens tocan a la nave, y el otro caso es cuando los aliens llegan a la última línea inferior. Si se pierde, paramos la función.

    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        clearInterval(timerId);
        resultDisplay.innerHTML = 'Has perdido :(, inténtalo de nuevo. Tu resultado final fue de ' + results;
        document.removeEventListener('keydown', moveShooter);
        document.removeEventListener('keydown', shoot);
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if (alienInvaders[i] > squares.length - width) {
            clearInterval(timerId);
            resultDisplay.innerHTML = 'Has perdido :(, inténtalo de nuevo. Tu resultado final fue de ' + results;
            document.removeEventListener('keydown', moveShooter);
            document.removeEventListener('keydown', shoot);
        }
    }

    // verificamos cuando ganamos

    if (aliensRemoved.length === alienInvaders.length) {
        clearInterval(timerId);
        resultDisplay.innerHTML = 'Has ganado :D ! Gracias por jugar. Tu resultado final fue de ' + results;
        document.removeEventListener('keydown', moveShooter);
        document.removeEventListener('keydown', shoot);
        figureWin.classList.remove('figure__img--display')
    }

}

// Aplicamos la función en un intervalo de tiempo

timerId = setInterval(moveInvaders, 200);

// Creamos la función que permita realizar los tiros de la nave

function shoot(e) {
    let currentLaserIndex = currentShooterIndex;
   

    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser');
        currentLaserIndex -= width;
        squares[currentLaserIndex].classList.add('laser');

      
        // Verificamos cuando el láser coincida con los aliens 
       
        if (squares[currentLaserIndex].classList.contains('invader', 'laser')) {
            
            squares[currentLaserIndex].classList.remove('laser');
            squares[currentLaserIndex].classList.remove('invader');
            squares[currentLaserIndex].classList.add('boom');
            
            clearInterval(laserId);

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            
            results += 90;
            resultDisplay.innerHTML = results;
            aliensRemoved.push(alienRemoved)
        }

        

    }

    // esta función nos ayudará a borrar el láser y efecto "boom" cuando el láser y alien coincida 

       function removeBoom () {
        for (let i = 0; i < squares.length; i++) {
            squares[i].classList.remove('boom');
            squares[currentLaserIndex].classList.remove('laser');
        }
    }
    

    // Aplicamos el movimiento del láser

    switch(e.key) {
        case 'ArrowUp':
        laserId = setInterval(moveLaser, 100);
        setInterval(removeBoom, 2000)
        break;
    }
}

document.addEventListener('keydown', shoot);

// Ante cualquier duda o sugerencia, escribir al correo: joedavid182@gmail.com