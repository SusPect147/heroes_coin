const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');

let score = 0;
let playerPosition = 180; // Начальная позиция игрока (по оси X)
let fallingCubes = [];
let gameOver = false;
let gameInterval, cubeInterval;

// Управление игроком
document.addEventListener('keydown', (e) => {
  if (gameOver) return;

  if (e.key === 'ArrowLeft' && playerPosition > 0) {
    playerPosition -= 10;
  } else if (e.key === 'ArrowRight' && playerPosition < gameContainer.offsetWidth - player.offsetWidth) {
    playerPosition += 10;
  }

  player.style.left = playerPosition + 'px';
});

// Создание падающих кубиков
function spawnFallingCube() {
  const cube = document.createElement('div');
  cube.classList.add('falling-cube');
  const startPosition = Math.random() * (gameContainer.offsetWidth - 20); // Позиция по оси X
  cube.style.left = startPosition + 'px';
  gameContainer.appendChild(cube);

  fallingCubes.push({ element: cube, x: startPosition, y: 0 });
}

// Обновление состояния игры
function gameLoop() {
  if (gameOver) return;

  fallingCubes.forEach((cube, index) => {
    cube.y += 3; // скорость падения кубика
    cube.element.style.top = cube.y + 'px';

    // Проверка, собрал ли игрок кубик
    if (
      cube.y >= gameContainer.offsetHeight - player.offsetHeight - 10 && // Кубик достиг земли
      cube.x >= playerPosition && cube.x <= playerPosition + player.offsetWidth
    ) {
      score++;
      fallingCubes.splice(index, 1);
      cube.element.remove();
    }

    // Если кубик упал за пределы экрана, игра окончена
    if (cube.y > gameContainer.offsetHeight) {
      gameOver = true;
      clearInterval(gameInterval);
      clearInterval(cubeInterval);
      alert('Игра окончена! Ваш счёт: ' + score);
    }
  });

  scoreElement.textContent = 'Счёт: ' + score;
}

// Инициализация игры
function startGame() {
  score = 0;
  gameOver = false;
  fallingCubes = [];

  // Скрыть кнопку "Играть" при начале игры
  startButton.style.display = 'none';

  gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
  cubeInterval = setInterval(spawnFallingCube, 1000); // Создаём новый кубик каждую секунду
}

// Обработчик события для кнопки "Играть"
startButton.addEventListener('click', startGame);
