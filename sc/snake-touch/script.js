const gameArea = document.getElementById('game-area');
const snakeSpeed = 200;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * 50), y: Math.floor(Math.random() * 50) };
let swipeStartX = 0;
let swipeStartY = 0;

function createDiv(className) {
    const div = document.createElement('div');
    div.classList.add(className);
    gameArea.appendChild(div);
    return div;
}

function draw() {
    gameArea.innerHTML = '';
    snake.forEach(segment => {
        const snakeElement = createDiv('snake');
        snakeElement.style.left = `${segment.x * 2}vmin`;
        snakeElement.style.top = `${segment.y * 2}vmin`;
    });

    const foodElement = createDiv('food');
    foodElement.style.left = `${food.x * 2}vmin`;
    foodElement.style.top = `${food.y * 2}vmin`;
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        food = { x: Math.floor(Math.random() * 50), y: Math.floor(Math.random() * 50) };
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= 50 || head.y < 0 || head.y >= 50 || snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y)) {
        alert('Game over');
        snake = [{ x: 10, y: 10 }];
        direction = { x: 0, y: 0 };
    }

    draw();
}

function setDirection(newDirection) {
    if (newDirection.x !== -direction.x || newDirection.y !== -direction.y) {
        direction = newDirection;
    }
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            setDirection({ x: 0, y: -1 });
            break;
        case 'ArrowDown':
            setDirection({ x: 0, y: 1 });
            break;
        case 'ArrowLeft':
            setDirection({ x: -1, y: 0 });
            break;
        case 'ArrowRight':
            setDirection({ x: 1, y: 0 });
            break;
    }
});

gameArea.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    swipeStartX = touch.clientX;
    swipeStartY = touch.clientY;
});

gameArea.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    const dx = touch.clientX - swipeStartX;
    const dy = touch.clientY - swipeStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) setDirection({ x: 1, y: 0 });
        else setDirection({ x: -1, y: 0 });
    } else {
        if (dy > 0) setDirection({ x: 0, y: 1 });
        else setDirection({ x: 0, y: -1 });
    }

    swipeStartX = touch.clientX;
    swipeStartY = touch.clientY;
});

setInterval(moveSnake, snakeSpeed);
draw();