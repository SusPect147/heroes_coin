const boss = document.getElementById('boss');
const healthBarInner = document.getElementById('health-bar-inner');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const nextLevelButton = document.getElementById('next-level-button');
const levelText = document.getElementById('level-text');
const finalMessage = document.getElementById('final-message');

let maxHealth = 100;
let currentHealth = maxHealth;
let totalTime = 10;
let timeLeft = totalTime;
let timerInterval;
let gameStarted = false;

const bosses = [
    { health: 100, image: 'brawl_clicker-master/static/images/boss1.png', bgColor: 'brawl_clicker-master/static/images/theme_7.png', level: 1 },
    { health: 200, image: 'brawl_clicker-master/static/images/spider.png', bgColor: 'brawl_clicker-master/static/images/theme_8.png', level: 2 },
    { health: 300, image: 'brawl_clicker-master/static/images/pumpkin.png', bgColor: 'brawl_clicker-master/static/images/theme_9.png', level: 3 },
    { health: 400, image: 'brawl_clicker-master/static/images/drako.png', bgColor: 'brawl_clicker-master/static/images/theme_10.png', level: 4 },
    { health: 500, image: 'brawl_clicker-master/static/images/boss5.png', bgColor: '#000', level: 5 },
    { health: 600, image: 'brawl_clicker-master/static/images/boss6.png', bgColor: '#000', level: 6 },
    { health: 700, image: 'brawl_clicker-master/static/images/boss7.png', bgColor: '#000', level: 7 },
    { health: 800, image: 'brawl_clicker-master/static/images/boss8.png', bgColor: '#000', level: 8 },
    { health: 900, image: 'brawl_clicker-master/static/images/boss9.png', bgColor: '#000', level: 9 },
    { health: 1000, image: 'brawl_clicker-master/static/images/boss10.png', bgColor: '#000', level: 10 },
];

let currentBossIndex = 0;

// Вызов функции для установки фона первого босса при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    loadBoss(); // Загружаем первого босса и устанавливаем фон сразу при загрузке
});

function startGame() {
    boss.style.pointerEvents = 'auto'; // Включаем клики для босса
    startButton.style.display = 'none';  // Скрываем кнопку старта
    nextLevelButton.style.display = 'none'; // Скрываем кнопку следующего уровня
    gameStarted = true;
    timeLeft = totalTime;
    loadBoss(); // Загружаем босса
    startTimer();
}

function loadBoss() {
    const bossData = bosses[currentBossIndex];
    maxHealth = bossData.health;
    currentHealth = maxHealth;
    healthBarInner.style.width = '100%';
    healthBarInner.style.backgroundColor = 'orange'; /* Белый цвет здоровья */
    boss.src = bossData.image;

    // Получаем раздел #top
    const topSection = document.getElementById('top');

    // Проверяем, является ли фон изображением или цветом
    if (bossData.bgColor.includes('.png') || bossData.bgColor.includes('.jpg')) {
        // Изменяем фон только в #top
        topSection.style.background = `url(${bossData.bgColor})`;
        topSection.style.backgroundSize = "cover";
        topSection.style.backgroundPosition = "center";
    } else {
        // Если это просто цвет, меняем фон в #top
        topSection.style.background = bossData.bgColor;
    }

    levelText.textContent = `Уровень ${bossData.level}`;
}

function startTimer() {
    timerElement.style.display = 'block';
    timerElement.textContent = `Time Left: ${timeLeft}s`;

    clearInterval(timerInterval); // Очищаем предыдущий таймер
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(false);
        }
    }, 1000);
}

boss.addEventListener('click', () => {
    if (gameStarted && timeLeft > 0 && currentHealth > 0) {
        currentHealth -= 20;

        if (currentHealth < 0) currentHealth = 0;

        const healthPercentage = (currentHealth / maxHealth) * 100;
        healthBarInner.style.width = `${healthPercentage}%`;

        // Добавляем эффект удара
        boss.classList.add('boss-hit');
        setTimeout(() => {
            boss.classList.remove('boss-hit');
        }, 150); // Уменьшаем длительность до 0.15 секунды

        if (currentHealth === 0) {
            clearInterval(timerInterval);
            currentBossIndex++;
            if (currentBossIndex >= bosses.length) {
                endGame(true);
            } else {
                // Загружаем следующего босса и показываем кнопку
                loadBoss();
                nextLevelButton.style.display = 'block';
                gameStarted = false;
            }
        }
    }
});

function endGame(won) {
    if (won) {
        // Если победа над всеми боссами
        if (currentBossIndex >= bosses.length) {
            hideGameElements();
            finalMessage.style.display = 'block';
        }
    } else {
        startButton.style.display = 'block';
        startButton.textContent = "Готов отыграться?";
    }
    gameStarted = false;
}

function hideGameElements() {
    timerElement.style.display = 'none';
    healthBarInner.style.display = 'none';
    boss.style.display = 'none';
    levelText.style.display = 'none';
    startButton.style.display = 'none';
    nextLevelButton.style.display = 'none';
}

startButton.addEventListener('click', () => {
    if (!gameStarted) {
        startGame();
    } else {
        timeLeft = totalTime; // Сброс таймера для нового босса
        startGame();
    }
});

nextLevelButton.addEventListener('click', () => {
    startGame();
});
