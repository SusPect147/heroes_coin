document.addEventListener('DOMContentLoaded', () => {
    // Общие элементы
    const banner = document.getElementById('startBanner');
    const banner2 = document.getElementById('startBanner2');
    const banner3 = document.getElementById('startBanner3');
    const currentScoreElement = document.querySelector('.currentScore');

    let totalCoins = parseInt(localStorage.getItem('totalCoins')) || 0;
    currentScoreElement.textContent = totalCoins;

    // Игра 1: Лови монеты
    const gameContainer = document.getElementById('gameContainer');
    const bag = document.getElementById('bag');
    const scoreElement = document.getElementById('scoreValue');
    const gameOverScreen = document.getElementById('gameOver');
    const finalScoreElement = document.getElementById('finalScore');
    const exitButton = document.getElementById('exitButton');

    let score = 0;
    let gameActive = false;
    let bagPosition = window.innerWidth / 2 - 50;
    let coins = [];
    let coinSpeed = 2;
    let spawnInterval;
    let isDraggingBag = false;

    // Проверка на существование элементов
    if (!gameContainer || !bag || !scoreElement || !gameOverScreen || !finalScoreElement || !exitButton) {
        console.error("One or more DOM elements for Game 1 are missing. Please check your HTML.");
        return;
    }

    exitButton.style.display = 'none';

    banner.addEventListener('click', () => {
        banner.classList.add('hidden');
        banner2.classList.add('hidden');
        banner3.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        startGame();
    });

    // Управление мышью
    gameContainer.addEventListener('mousedown', (e) => {
        if (!gameActive) return; // Предотвращаем управление после завершения игры
        isDraggingBag = true;
        moveBag(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
        if (!gameActive || !isDraggingBag) return; // Предотвращаем движение после завершения
        moveBag(e.clientX);
    });

    document.addEventListener('mouseup', () => {
        isDraggingBag = false;
    });

    // Управление сенсорным экраном
    gameContainer.addEventListener('touchstart', (e) => {
        if (!gameActive) return; // Предотвращаем управление после завершения игры
        e.preventDefault();
        isDraggingBag = true;
        moveBag(e.touches[0].clientX);
    });

    gameContainer.addEventListener('touchmove', (e) => {
        if (!gameActive || !isDraggingBag) return; // Предотвращаем движение после завершения
        e.preventDefault();
        moveBag(e.touches[0].clientX);
    });

    gameContainer.addEventListener('touchend', () => {
        isDraggingBag = false;
    });

    function moveBag(clientX) {
        const rect = gameContainer.getBoundingClientRect();
        bagPosition = clientX - rect.left - bag.offsetWidth / 2;
        if (bagPosition < 0) bagPosition = 0;
        if (bagPosition > gameContainer.offsetWidth - bag.offsetWidth) {
            bagPosition = gameContainer.offsetWidth - bag.offsetWidth;
        }
        bag.style.left = `${bagPosition}px`;
    }

    exitButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Предотвращаем всплытие события, чтобы не срабатывало управление мешком
        endGame(); // Завершаем игру полностью
        gameContainer.classList.add('hidden');
        banner.classList.remove('hidden');
        banner2.classList.remove('hidden');
        banner3.classList.remove('hidden');
        exitButton.style.display = 'none'; // Скрываем кнопку после выхода
    });

    function startGame() {
        gameActive = true;
        score = 0;
        scoreElement.textContent = score;
        coinSpeed = 2;
        coins = [];
        gameOverScreen.classList.add('hidden');
        exitButton.style.display = 'none';
        bag.style.left = `${bagPosition}px`;
        spawnCoins();
        gameLoop();
    }

    function spawnCoins() {
        if (!gameActive) return;
        spawnCoin();
        spawnInterval = setTimeout(spawnCoins, 1000 - Math.min(score * 50, 700));
    }

    function spawnCoin() {
        if (!gameActive) return;
        const coin = document.createElement('div');
        coin.classList.add('coin3');
        const coinWidth = 80;
        coin.style.left = `${Math.random() * (gameContainer.offsetWidth - coinWidth)}px`;
        coin.style.top = '0px';
        gameContainer.appendChild(coin);
        coins.push(coin);
    }

    function gameLoop() {
        if (!gameActive) return;
        coins.forEach((coin, index) => {
            let coinTop = parseFloat(coin.style.top) || 0;
            coinTop += coinSpeed;
            coin.style.top = `${coinTop}px`;
            const coinRect = coin.getBoundingClientRect();
            const bagRect = bag.getBoundingClientRect();

            const bagActiveHeight = bagRect.height * 0.2;
            const bagActiveBottom = bagRect.top + bagActiveHeight;
            const bagActiveWidth = 80;
            const bagActiveLeft = bagRect.left + (bagRect.width - bagActiveWidth) / 2;
            const bagActiveRight = bagActiveLeft + bagActiveWidth;

            if (
                coinRect.bottom >= bagRect.top &&
                coinRect.top <= bagActiveBottom &&
                coinRect.right >= bagActiveLeft &&
                coinRect.left <= bagActiveRight
            ) {
                coin.remove();
                coins.splice(index, 1);
                score++;
                totalCoins += window.coinsPerPoint; // Используем улучшение
                currentScoreElement.textContent = totalCoins;
                localStorage.setItem('totalCoins', totalCoins);
                scoreElement.textContent = score;
                coinSpeed += 0.05;
            }

            if (coinTop > gameContainer.offsetHeight) {
                endGame();
            }
        });
        requestAnimationFrame(gameLoop);
    }

    function endGame() {
        gameActive = false;
        clearTimeout(spawnInterval);
        coins.forEach(coin => coin.remove());
        coins = [];
        finalScoreElement.textContent = score;
        gameOverScreen.classList.remove('hidden');
        exitButton.style.display = 'block';
        window.incrementMinigamesPlayed();
    }

// Игра 2: Лопай шарики
const gameContainer2 = document.getElementById('gameContainer2');
const scoreElement2 = document.getElementById('scoreValue2');
const missedElement = document.getElementById('missedValue2');
const gameOverScreen2 = document.getElementById('gameOver2');
const finalScoreElement2 = document.getElementById('finalScore2');
const exitButton2 = document.getElementById('exitButton2');

let score2 = 0;
let missed = 0;
let gameActive2 = false;
let circles = [];
const maxMissed = 5;
let spawnInterval2;

gameOverScreen2.classList.add('hidden');

banner2.addEventListener('click', () => {
    banner2.classList.add('hidden');
    banner.classList.add('hidden');
    banner3.classList.add('hidden');
    gameContainer2.classList.remove('hidden');
    startGame2();
});

exitButton2.addEventListener('click', () => {
    gameContainer2.classList.add('hidden');
    banner.classList.remove('hidden');
    banner2.classList.remove('hidden');
    banner3.classList.remove('hidden');
});

function startGame2() {
    gameActive2 = true;
    score2 = 0;
    missed = 0;
    scoreElement2.textContent = score2;
    missedElement.textContent = missed;
    circles = [];
    gameOverScreen2.classList.add('hidden');
    spawnCircles();
}

function spawnCircles() {
    if (!gameActive2) return;

    // Сразу появляется от 2 до 5 кругов
    const circleCount = Math.min(2 + Math.floor(score2 / 15), 5); // Начинаем с 2, максимум 5

    for (let i = 0; i < circleCount; i++) {
        spawnCircle();
    }

    // Плавное ускорение: от 2500мс до 700мс
    const interval = Math.max(2500 - score2 * 25, 700);
    spawnInterval2 = setTimeout(spawnCircles, interval);
}

function spawnCircle() {
    if (!gameActive2) return;
    const circle = document.createElement('div');
    circle.classList.add('circle');

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    circle.style.backgroundColor = randomColor;

    const circleSize = 60 + Math.random() * 40;
    const navBarHeight = 40; // Восстановил отступ сверху
    const bottomMargin = 20; // Добавил небольшой отступ снизу

    circle.style.width = `${circleSize}px`;
    circle.style.height = `${circleSize}px`;

    // Рандомное положение с учетом отступов сверху и снизу
    circle.style.left = `${Math.random() * (gameContainer2.offsetWidth - circleSize)}px`;
    const maxTop = gameContainer2.offsetHeight - circleSize - navBarHeight - bottomMargin;
    circle.style.top = `${navBarHeight + Math.random() * maxTop}px`;

    gameContainer2.appendChild(circle);
    circles.push(circle);

    const lifetime = Math.max(3000 - score2 * 50, 1000);
    setTimeout(() => {
        if (circle.parentElement && gameActive2) {
            circle.remove();
            circles = circles.filter(c => c !== circle);
            missed++;
            missedElement.textContent = missed;
            if (missed >= maxMissed) endGame2();
        }
    }, lifetime);

    circle.addEventListener('click', () => {
        circle.remove();
        circles = circles.filter(c => c !== circle);
        score2++;
        totalCoins += window.coinsPerPoint; // Используем улучшение
        currentScoreElement.textContent = totalCoins;
        localStorage.setItem('totalCoins', totalCoins);
        scoreElement2.textContent = score2;
    });
}

function endGame2() {
    gameActive2 = false;
    clearTimeout(spawnInterval2);
    circles.forEach(circle => circle.remove());
    circles = [];
    finalScoreElement2.textContent = score2;
    gameOverScreen2.classList.remove('hidden');
    window.incrementMinigamesPlayed();
}

// Игра 3: Битва с боссами
const gameContainer3 = document.getElementById('gameContainer3');
const scoreElement3 = document.getElementById('scoreValue3');
const bossHealthElement = document.getElementById('bossHealthValue');
const gameOverScreen3 = document.getElementById('gameOver3');
const finalScoreElement3 = document.getElementById('finalScore3');
const gameOverMessage3 = document.getElementById('gameOverMessage3');
const exitButton3 = document.getElementById('exitButton3');
const boss = document.getElementById('boss');
const cannon = document.getElementById('cannon');

if (!gameContainer3 || !scoreElement3 || !bossHealthElement || !gameOverScreen3 ||
    !finalScoreElement3 || !gameOverMessage3 || !exitButton3 || !boss || !cannon) {
    console.error("One or more DOM elements are missing. Please check your HTML.");
    throw new Error("Required DOM elements not found.");
}

let score3 = 0;
let gameActive3 = false;
let cannonPosition = window.innerWidth / 2 - 50;
let bossPosition = window.innerWidth / 2 - 75;
let bossDirection = 1;
let bossSpeed = 2; // Общая скорость, будет переопределена для boss1 и boss2
let bossHealth = 100;
let playerBullets = [];
let bossBullets = [];
let canShoot = true;
let currentBoss = 1;
let autoShootInterval;
let bossDirectionChangeInterval;
let boss4Pause = false;
let boss4PauseTimer = 0;
let boss4Speed = 2;
let boss4BulletTimer = 0;
let boss5TeleportTimer = 0;
let boss5Angle = 0;
let boss6WaveTimer = 0;
let boss6SineOffset = 0;
let boss6FastBulletTimer = 0;
let boss7CloneTimer = 300;
let clones = [];
let boss7BulletSpeed = 1.5;
let isDraggingCannon = false;

gameOverScreen3.classList.add('hidden');

banner3.addEventListener('click', () => {
    banner.classList.add('hidden');
    banner2.classList.add('hidden');
    banner3.classList.add('hidden');
    gameContainer3.classList.remove('hidden');
    startGame3();
});

// Управление мышью
gameContainer3.addEventListener('mousedown', (e) => {
    if (!gameActive3) return;
    isDraggingCannon = true;
    moveCannon(e.clientX);
});

document.addEventListener('mousemove', (e) => {
    if (!gameActive3 || !isDraggingCannon) return;
    moveCannon(e.clientX);
});

document.addEventListener('mouseup', () => {
    isDraggingCannon = false;
});

// Управление сенсорным экраном
gameContainer3.addEventListener('touchstart', (e) => {
    if (!gameActive3) return;
    e.preventDefault();
    isDraggingCannon = true;
    moveCannon(e.touches[0].clientX);
});

gameContainer3.addEventListener('touchmove', (e) => {
    if (!gameActive3 || !isDraggingCannon) return;
    e.preventDefault();
    moveCannon(e.touches[0].clientX);
});

gameContainer3.addEventListener('touchend', () => {
    isDraggingCannon = false;
});

function moveCannon(clientX) {
    const rect = gameContainer3.getBoundingClientRect();
    cannonPosition = clientX - rect.left - cannon.offsetWidth / 2;
    if (cannonPosition < 0) cannonPosition = 0;
    if (cannonPosition > gameContainer3.offsetWidth - cannon.offsetWidth) {
        cannonPosition = gameContainer3.offsetWidth - cannon.offsetWidth;
    }
    cannon.style.left = `${cannonPosition}px`;
}

function startGame3() {
    gameActive3 = true;
    score3 = 0;
    bossHealth = 100;
    currentBoss = 1;
    cannonPosition = window.innerWidth / 2 - 50;
    bossPosition = window.innerWidth / 2 - 75;
    bossDirection = 1;
    playerBullets = [];
    bossBullets = [];
    clones.forEach(clone => clone.element.remove());
    clones = [];
    scoreElement3.textContent = score3;
    bossHealthElement.textContent = bossHealth;
    gameOverScreen3.classList.add('hidden');
    cannon.style.left = `${cannonPosition}px`;
    boss.style.left = `${bossPosition}px`;
    boss.style.top = '50px';
    const backgroundImagePlat = 'brawl_clicker-master/static/images/plat.png';
    gameContainer3.style.backgroundImage = `url('${backgroundImagePlat}')`;
    boss.classList.remove('boss2', 'boss3', 'boss4', 'boss5', 'boss6', 'boss7');
    boss.classList.add('boss1');
    boss7CloneTimer = 300;
    spawnBossBullets();
    gameLoop3();

    autoShootInterval = setInterval(() => {
        if (gameActive3 && canShoot) {
            shootPlayerBullet();
            canShoot = false;
            setTimeout(() => (canShoot = true), 300);
        }
    }, 300);
}

function shootPlayerBullet() {
    const bullet = document.createElement('div');
    bullet.classList.add('player-bullet');
    bullet.style.left = `${cannonPosition + cannon.offsetWidth / 2 - 5}px`;
    bullet.style.bottom = `${cannon.offsetHeight + 50}px`;
    gameContainer3.appendChild(bullet);
    playerBullets.push(bullet);
}

function spawnBossBullets() {
    if (!gameActive3) return;

    if (currentBoss === 1) {
        const bullet = document.createElement('div');
        bullet.classList.add('boss-bullet', 'boss1-bullet');
        bullet.style.left = `${bossPosition + boss.offsetWidth / 2 - 10}px`;
        bullet.style.top = `${boss.offsetHeight + 50}px`;
        bullet.dataset.angle = 0;
        gameContainer3.appendChild(bullet);
        bossBullets.push(bullet);
    } else if (currentBoss === 2) {
        const angles = [-20, 0, 20];
        angles.forEach(angle => {
            const bullet = document.createElement('div');
            bullet.classList.add('boss-bullet', 'boss2-bullet');
            bullet.style.left = `${bossPosition + boss.offsetWidth / 2 - 10}px`;
            bullet.style.top = `${boss.offsetHeight + 50}px`;
            bullet.dataset.angle = angle;
            gameContainer3.appendChild(bullet);
            bossBullets.push(bullet);
        });
    } else if (currentBoss === 3) {
        const bullet = document.createElement('div');
        bullet.classList.add('boss-bullet', 'boss3-bullet');
        bullet.style.left = `${bossPosition + boss.offsetWidth / 2 - 10}px`;
        bullet.style.top = `${boss.offsetHeight + 50}px`;
        bullet.dataset.dx = (Math.random() * 2 - 1) * 2;
        bullet.dataset.dy = 2;
        gameContainer3.appendChild(bullet);
        bossBullets.push(bullet);
    } else if (currentBoss === 4) {
        if (boss4BulletTimer <= 0) {
            const bullet = document.createElement('div');
            bullet.classList.add('boss-bullet', 'boss4-bullet');
            bullet.style.left = `${bossPosition + boss.offsetWidth / 2 - 15}px`;
            bullet.style.top = `${boss.offsetHeight + 50}px`;
            bullet.dataset.angle = 0;
            gameContainer3.appendChild(bullet);
            bossBullets.push(bullet);
            boss4BulletTimer = 90;
        }
    } else if (currentBoss === 5) {
        const numBullets = 4;
        const cannonCenterX = cannonPosition + cannon.offsetWidth / 2;
        const bossCenterX = bossPosition + boss.offsetWidth / 2;
        const bossCenterY = parseFloat(boss.style.top) + boss.offsetHeight / 2;
        const dx = cannonCenterX - bossCenterX;
        const dy = gameContainer3.offsetHeight - bossCenterY;
        const baseAngle = Math.atan2(dy, dx) * 180 / Math.PI;

        for (let i = 0; i < numBullets; i++) {
            const bullet = document.createElement('div');
            bullet.classList.add('boss-bullet', 'boss5-beam');
            bullet.style.left = `${bossPosition + boss.offsetWidth / 2}px`;
            bullet.style.top = `${parseFloat(boss.style.top) + boss.offsetHeight}px`;
            bullet.dataset.angle = baseAngle + (i - 1.5) * 28;
            bullet.dataset.speed = 2.5;
            gameContainer3.appendChild(bullet);
            bossBullets.push(bullet);
        }
    } else if (currentBoss === 6) {
        const numBullets = 6;
        for (let i = 0; i < numBullets; i++) {
            const bullet = document.createElement('div');
            bullet.classList.add('boss-bullet', 'boss6-bullet');
            bullet.style.left = `${bossPosition + boss.offsetWidth / 2}px`;
            bullet.style.top = `${boss.offsetHeight + 50}px`;
            bullet.dataset.angle = (i * 360) / numBullets;
            gameContainer3.appendChild(bullet);
            bossBullets.push(bullet);
        }
        if (boss6FastBulletTimer <= 0) {
            const bullet = document.createElement('div');
            bullet.classList.add('boss-bullet', 'boss6-fast-bullet');
            bullet.style.left = `${bossPosition + boss.offsetWidth / 2}px`;
            bullet.style.top = `${boss.offsetHeight + 50}px`;
            const cannonCenterX = cannonPosition + cannon.offsetWidth / 2;
            const cannonCenterY = gameContainer3.offsetHeight - cannon.offsetHeight / 2;
            const bulletCenterX = bossPosition + boss.offsetWidth / 2;
            const bulletCenterY = 50 + boss.offsetHeight / 2;
            const dx = cannonCenterX - bulletCenterX;
            const dy = cannonCenterY - bulletCenterY;
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            bullet.dataset.angle = angle;
            gameContainer3.appendChild(bullet);
            bossBullets.push(bullet);
            boss6FastBulletTimer = 240;
        }
        if (boss6WaveTimer <= 0) {
            const wave = document.createElement('div');
            wave.classList.add('boss-bullet', 'boss6-wave');
            wave.style.left = `${bossPosition + boss.offsetWidth / 2}px`;
            wave.style.top = `${boss.offsetHeight + 50}px`;
            wave.dataset.radius = 0;
            gameContainer3.appendChild(wave);
            bossBullets.push(wave);
            boss6WaveTimer = 360;
        }
    } else if (currentBoss === 7) {
        const direction = Math.sin(Date.now() / 1000) > 0 ? 1 : -1;
        const bullet = document.createElement('div');
        bullet.classList.add('boss-bullet', 'boss7-bullet');
        bullet.style.left = `${bossPosition + boss.offsetWidth / 2 - 15}px`;
        bullet.style.top = `${boss.offsetHeight + 50}px`;
        bullet.dataset.dx = direction * boss7BulletSpeed;
        bullet.dataset.dy = 0.8;
        gameContainer3.appendChild(bullet);
        bossBullets.push(bullet);
    }

    setTimeout(spawnBossBullets,
        currentBoss === 1 ? 1500 : // Было 1000, замедляем стрельбу
        currentBoss === 2 ? 1800 : // Было 1200, замедляем стрельбу
        currentBoss === 3 ? 1300 :
        currentBoss === 4 ? 1500 :
        currentBoss === 5 ? 2000 :
        currentBoss === 6 ? 1500 :
        4000);
}

function gameLoop3() {
    if (!gameActive3) return;

    if (currentBoss === 1) {
        bossPosition += 1 * bossDirection; // Уменьшаем скорость с 2 до 1
        if (bossPosition <= 0 || bossPosition >= gameContainer3.offsetWidth - boss.offsetWidth) {
            bossDirection *= -1;
        }
    } else if (currentBoss === 2) {
        bossPosition += 1 * bossDirection; // Уменьшаем скорость с 2 до 1
        if (bossPosition <= 0 || bossPosition >= gameContainer3.offsetWidth - boss.offsetWidth) {
            bossDirection *= -1;
        }
    } else if (currentBoss === 3) {
        bossPosition += bossSpeed * bossDirection;
        if (bossPosition <= 0 || bossPosition >= gameContainer3.offsetWidth - boss.offsetWidth) {
            bossDirection *= -1;
        }
    } else if (currentBoss === 4) {
        const targetPosition = cannonPosition + cannon.offsetWidth / 2 - boss.offsetWidth / 2;
        const diff = targetPosition - bossPosition;
        bossPosition += diff * 0.01;
        if (bossPosition < 0) bossPosition = 0;
        if (bossPosition > gameContainer3.offsetWidth - boss.offsetWidth) {
            bossPosition = gameContainer3.offsetWidth - boss.offsetWidth;
        }
        boss4BulletTimer--;
    } else if (currentBoss === 5) {
        boss5TeleportTimer--;
        if (boss5TeleportTimer <= 0) {
            bossPosition = Math.random() * (gameContainer3.offsetWidth - boss.offsetWidth);
            const maxHeight = gameContainer3.offsetHeight / 3;
            const bossTop = 50 + Math.random() * (maxHeight - boss.offsetHeight - 50);
            boss.style.left = `${bossPosition}px`;
            boss.style.top = `${bossTop}px`;
            boss5TeleportTimer = 180;
        }
        boss5Angle += 0.02;
    } else if (currentBoss === 6) {
        boss6SineOffset += 0.02;
        bossPosition = (gameContainer3.offsetWidth - boss.offsetWidth) / 2 + Math.sin(boss6SineOffset) * 150;
        if (bossPosition < 0) bossPosition = 0;
        if (bossPosition > gameContainer3.offsetWidth - boss.offsetWidth) {
            bossPosition = gameContainer3.offsetWidth - boss.offsetWidth;
        }
        boss.style.left = `${bossPosition}px`;
        boss.style.top = '50px';
        boss6WaveTimer--;
        boss6FastBulletTimer--;
    } else if (currentBoss === 7) {
        bossPosition += bossSpeed * bossDirection;
        if (bossPosition <= 0 || bossPosition >= gameContainer3.offsetWidth - boss.offsetWidth) {
            bossDirection *= -1;
        }

        boss7CloneTimer--;
        if (boss7CloneTimer <= 0 && clones.length < 2) {
            for (let i = 0; i < 1; i++) {
                const clone = {
                    element: document.createElement('div'),
                    hp: 60,
                    position: bossPosition + (Math.random() - 0.5) * 100,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    shootTimer: 180
                };
                clone.element.classList.add('boss7-clone');
                clone.element.style.left = `${clone.position}px`;
                clone.element.style.top = `${100 + i * 50}px`;
                gameContainer3.appendChild(clone.element);
                clones.push(clone);
            }
            boss7CloneTimer = 600;
        }

        clones.forEach((clone, index) => {
            clone.position += clone.direction * 2;
            if (clone.position <= 0 || clone.position >= gameContainer3.offsetWidth - 50) {
                clone.direction *= -1;
            }
            clone.element.style.left = `${clone.position}px`;

            clone.shootTimer--;
            if (clone.shootTimer <= 0) {
                const bullet = document.createElement('div');
                bullet.classList.add('boss-bullet', 'boss7-clone-bullet');
                bullet.style.left = `${clone.position + 25}px`;
                bullet.style.top = `${parseFloat(clone.element.style.top) + 50}px`;
                bullet.dataset.angle = 0;
                bullet.dataset.speed = 1.5;
                gameContainer3.appendChild(bullet);
                bossBullets.push(bullet);
                clone.shootTimer = 180;
            }
        });
    }

    if (currentBoss !== 5 && currentBoss !== 6 && currentBoss !== 7) {
        boss.style.left = `${bossPosition}px`;
        boss.style.top = '50px';
    } else if (currentBoss === 7) {
        boss.style.left = `${bossPosition}px`;
        boss.style.top = '50px';
    }

    playerBullets.forEach((bullet, index) => {
        let bulletTop = parseFloat(bullet.style.bottom) || 0;
        bulletTop += 5;
        bullet.style.bottom = `${bulletTop}px`;

        const bulletRect = bullet.getBoundingClientRect();
        const bossRect = boss.getBoundingClientRect();

        if (
            bulletRect.bottom >= bossRect.top &&
            bulletRect.top <= bossRect.bottom &&
            bulletRect.right >= bossRect.left &&
            bulletRect.left <= bossRect.right
        ) {
            bullet.remove();
            playerBullets.splice(index, 1);
            bossHealth -= 30;
            score3 += 1;
            totalCoins += window.coinsPerPoint;
            currentScoreElement.textContent = totalCoins;
            localStorage.setItem('totalCoins', totalCoins);
            scoreElement3.textContent = score3;
            bossHealthElement.textContent = bossHealth;
            boss.classList.remove('hit');
            void boss.offsetWidth;
            boss.classList.add('hit');

            if (bossHealth <= 0) {
                if (currentBoss === 1) {
                    currentBoss = 2;
                    bossHealth = 150;
                    bossHealthElement.textContent = bossHealth;
                    const backgroundImageDark = 'brawl_clicker-master/static/images/dark.png';
                    gameContainer3.style.backgroundImage = `url('${backgroundImageDark}')`;
                    boss.classList.remove('boss1');
                    boss.classList.add('boss2');
                } else if (currentBoss === 2) {
                    bossBullets.forEach(bullet => bullet.remove());
                    bossBullets = [];
                    currentBoss = 3;
                    bossHealth = 200;
                    bossHealthElement.textContent = bossHealth;
                    const backgroundImageIce4 = 'brawl_clicker-master/static/images/ice4.png';
                    gameContainer3.style.backgroundImage = `url('${backgroundImageIce4}')`;
                    boss.classList.remove('boss2');
                    boss.classList.add('boss3');
                    bossDirectionChangeInterval = setInterval(() => {
                        bossDirection = Math.random() > 0.5 ? 1 : -1;
                    }, 2000);
                } else if (currentBoss === 3) {
                    bossBullets.forEach(bullet => bullet.remove());
                    bossBullets = [];
                    clearInterval(bossDirectionChangeInterval);
                    currentBoss = 4;
                    bossHealth = 250;
                    bossHealthElement.textContent = bossHealth;
                    const backgroundImageRude = 'brawl_clicker-master/static/images/rude.png';
                    gameContainer3.style.backgroundImage = `url('${backgroundImageRude}')`;
                    boss.classList.remove('boss3');
                    boss.classList.add('boss4');
                    boss4Pause = false;
                    boss4PauseTimer = 0;
                    boss4Speed = 2;
                    boss4BulletTimer = 0;
                } else if (currentBoss === 4) {
                    bossBullets.forEach(bullet => bullet.remove());
                    bossBullets = [];
                    currentBoss = 5;
                    bossHealth = 300;
                    bossHealthElement.textContent = bossHealth;
                    const backgroundImagePoison = 'brawl_clicker-master/static/images/poison.png';
                    gameContainer3.style.backgroundImage = `url('${backgroundImagePoison}')`;
                    boss.classList.remove('boss4');
                    boss.classList.add('boss5');
                    boss5TeleportTimer = 0;
                    boss5Angle = 0;
                    boss.style.top = '50px';
                } else if (currentBoss === 5) {
                    bossBullets.forEach(bullet => bullet.remove());
                    bossBullets = [];
                    currentBoss = 6;
                    bossHealth = 350;
                    bossHealthElement.textContent = bossHealth;
                    const backgroundImageDark3 = 'brawl_clicker-master/static/images/dark_3.png';
                    gameContainer3.style.backgroundImage = `url('${backgroundImageDark3}')`;
                    boss.classList.remove('boss5');
                    boss.classList.add('boss6');
                    boss6WaveTimer = 0;
                    boss6SineOffset = 0;
                    boss6FastBulletTimer = 0;
                } else if (currentBoss === 6) {
                    bossBullets.forEach(bullet => bullet.remove());
                    bossBullets = [];
                    clones.forEach(clone => clone.element.remove());
                    clones = [];
                    currentBoss = 7;
                    bossHealth = 5000;
                    bossHealthElement.textContent = bossHealth;
                    const backgroundImageMystical = 'brawl_clicker-master/static/images/mystical.png';
                    gameContainer3.style.backgroundImage = `url('${backgroundImageMystical}')`;
                    boss.classList.remove('boss6');
                    boss.classList.add('boss7');
                    boss7CloneTimer = 300;
                } else {
                    endGame3(true);
                }
            }
        } else if (currentBoss === 7) {
            clones.forEach((clone, cloneIndex) => {
                const cloneRect = clone.element.getBoundingClientRect();
                if (
                    bulletRect.bottom >= cloneRect.top &&
                    bulletRect.top <= cloneRect.bottom &&
                    bulletRect.right >= cloneRect.left &&
                    bulletRect.left <= cloneRect.right
                ) {
                    bullet.remove();
                    playerBullets.splice(index, 1);
                    clone.hp -= 50;
                    score3 += 5;
                    totalCoins += 5;
                    currentScoreElement.textContent = totalCoins;
                    localStorage.setItem('totalCoins', totalCoins);
                    scoreElement3.textContent = score3;
                    if (clone.hp <= 0) {
                        clone.element.remove();
                        clones.splice(cloneIndex, 1);
                    }
                    return;
                }
            });
        }

        if (bulletTop > gameContainer3.offsetHeight) {
            bullet.remove();
            playerBullets.splice(index, 1);
        }
    });

    bossBullets.forEach((bullet, index) => {
        let bulletTop = parseFloat(bullet.style.top) || 0;
        let bulletLeft = parseFloat(bullet.style.left) || 0;

        if (currentBoss === 3) {
            let dx = parseFloat(bullet.dataset.dx) || 0;
            let dy = parseFloat(bullet.dataset.dy) || 0;
            bulletTop += dy * 0.7; // Уменьшаем скорость по Y в 2 раза (было dy, стало dy * 0.5)
            bulletLeft += dx * 0.7;
            if (bulletLeft <= 0 || bulletLeft >= gameContainer3.offsetWidth - bullet.offsetWidth) {
                bullet.dataset.dx = -dx;
                bulletLeft = bulletLeft <= 0 ? 0 : gameContainer3.offsetWidth - bullet.offsetWidth;
            }
            bullet.style.top = `${bulletTop}px`;
            bullet.style.left = `${bulletLeft}px`;
        } else if (currentBoss === 4) {
            const angle = parseFloat(bullet.dataset.angle) || 0;
            const speed = 2.5;
            bulletTop += speed;
            bulletLeft += (angle / 30) * speed;
            bullet.style.top = `${bulletTop}px`;
            bullet.style.left = `${bulletLeft}px`;
        } else if (currentBoss === 5) {
            const angle = parseFloat(bullet.dataset.angle) || 0;
            const speed = parseFloat(bullet.dataset.speed) || 2.5;
            bulletTop += Math.sin(angle * Math.PI / 180) * speed;
            bulletLeft += Math.cos(angle * Math.PI / 180) * speed;
            bullet.style.top = `${bulletTop}px`;
            bullet.style.left = `${bulletLeft}px`;
            if (bulletLeft < 0 || bulletLeft > gameContainer3.offsetWidth || bulletTop > gameContainer3.offsetHeight) {
                bullet.remove();
                bossBullets.splice(index, 1);
                return;
            }
        } else if (currentBoss === 6) {
            if (bullet.classList.contains('boss6-bullet')) {
                let angle = parseFloat(bullet.dataset.angle) || 0;
                const speed = 2.5;
                bulletLeft += Math.cos(angle * Math.PI / 180) * speed;
                bulletTop += Math.sin(angle * Math.PI / 180) * speed;
                bullet.style.top = `${bulletTop}px`;
                bullet.style.left = `${bulletLeft}px`;
                if (bulletLeft < 0 || bulletLeft > gameContainer3.offsetWidth || bulletTop > gameContainer3.offsetHeight) {
                    bullet.remove();
                    bossBullets.splice(index, 1);
                    return;
                }
            } else if (bullet.classList.contains('boss6-fast-bullet')) {
                let angle = parseFloat(bullet.dataset.angle) || 0;
                const speed = 2;
                bulletLeft += Math.cos(angle * Math.PI / 180) * speed;
                bulletTop += Math.sin(angle * Math.PI / 180) * speed;
                bullet.style.top = `${bulletTop}px`;
                bullet.style.left = `${bulletLeft}px`;
                if (bulletLeft < 0 || bulletLeft > gameContainer3.offsetWidth || bulletTop > gameContainer3.offsetHeight) {
                    bullet.remove();
                    bossBullets.splice(index, 1);
                    return;
                }
            } else if (bullet.classList.contains('boss6-wave')) {
                let radius = parseFloat(bullet.dataset.radius) || 0;
                radius += 5;
                bullet.dataset.radius = radius;
                bullet.style.width = `${radius * 2}px`;
                bullet.style.height = `${radius * 2}px`;
                bullet.style.left = `${bossPosition + boss.offsetWidth / 2 - radius}px`;
                bullet.style.top = `${boss.offsetHeight + 50 - radius}px`;
                if (radius > 300) {
                    for (let i = 0; i < 4; i++) {
                        const shard = document.createElement('div');
                        shard.classList.add('boss-bullet', 'boss6-shard');
                        shard.style.left = `${bulletLeft + radius * Math.cos((i * 90) * Math.PI / 180)}px`;
                        shard.style.top = `${bulletTop + radius * Math.sin((i * 90) * Math.PI / 180)}px`;
                        shard.dataset.dy = 1.5;
                        gameContainer3.appendChild(shard);
                        bossBullets.push(shard);
                    }
                    bullet.remove();
                    bossBullets.splice(index, 1);
                    return;
                }
            } else if (bullet.classList.contains('boss6-shard')) {
                bulletTop += parseFloat(bullet.dataset.dy) || 1;
                bullet.style.top = `${bulletTop}px`;
                if (bulletTop > gameContainer3.offsetHeight) {
                    bullet.remove();
                    bossBullets.splice(index, 1);
                    return;
                }
            }
        } else if (currentBoss === 7 && bullet.classList.contains('boss7-bullet')) {
            let dx = parseFloat(bullet.dataset.dx) || 0;
            let dy = parseFloat(bullet.dataset.dy) || 0;
            bulletLeft += dx;
            bulletTop += dy;

            if (bulletLeft <= 0 || bulletLeft >= gameContainer3.offsetWidth - 30) {
                bullet.dataset.dx = -dx;
                bulletLeft = bulletLeft <= 0 ? 0 : gameContainer3.offsetWidth - 30;
            }
            if (bulletTop <= 0) {
                bullet.dataset.dy = -dy;
                bulletTop = 0;
            }

            bullet.style.top = `${bulletTop}px`;
            bullet.style.left = `${bulletLeft}px`;

            if (bulletTop > gameContainer3.offsetHeight) {
                bullet.remove();
                bossBullets.splice(index, 1);
                return;
            }
        } else if (currentBoss === 7 && bullet.classList.contains('boss7-clone-bullet')) {
            const speed = parseFloat(bullet.dataset.speed) || 1.5;
            bulletTop += speed;
            bullet.style.top = `${bulletTop}px`;

            if (bulletTop > gameContainer3.offsetHeight) {
                bullet.remove();
                bossBullets.splice(index, 1);
                return;
            }
        } else {
            const angle = parseFloat(bullet.dataset.angle) || 0;
            const speed = currentBoss === 1 ? 2 : // Уменьшаем скорость пуль boss1 с 3 до 2
                           currentBoss === 2 ? 1.5 : // Уменьшаем скорость пуль boss2 с 2 до 1.5
                           2; // Оставляем для остальных
            bulletTop += speed;
            bulletLeft += (angle / 30) * speed;
            bullet.style.top = `${bulletTop}px`;
            bullet.style.left = `${bulletLeft}px`;
        }

        const bulletRect = bullet.getBoundingClientRect();
        const cannonRect = cannon.getBoundingClientRect();

        if (
            bulletRect.bottom >= cannonRect.top &&
            bulletRect.top <= cannonRect.bottom &&
            bulletRect.right >= cannonRect.left &&
            bulletRect.left <= cannonRect.right
        ) {
            bullet.remove();
            bossBullets.splice(index, 1);
            endGame3(false);
        } else if (bulletTop > gameContainer3.offsetHeight && currentBoss !== 5 && currentBoss !== 6 && currentBoss !== 7) {
            bullet.remove();
            bossBullets.splice(index, 1);
        }
    });

    requestAnimationFrame(gameLoop3);
}

function endGame3(victory) {
    gameActive3 = false;
    clearInterval(autoShootInterval);
    clearInterval(bossDirectionChangeInterval);
    playerBullets.forEach(bullet => bullet.remove());
    bossBullets.forEach(bullet => bullet.remove());
    clones.forEach(clone => clone.element.remove());
    playerBullets = [];
    bossBullets = [];
    clones = [];
    finalScoreElement3.textContent = score3;
    gameOverMessage3.textContent = victory ? 'Win!' : 'Lose!';
    gameOverScreen3.classList.remove('hidden');
    if (victory) {
        totalCoins += 50;
        localStorage.setItem('totalCoins', totalCoins);
        currentScoreElement.textContent = totalCoins;
    }
    window.incrementMinigamesPlayed();
}

exitButton3.addEventListener('click', () => {
    gameContainer3.classList.add('hidden');
    banner.classList.remove('hidden');
    banner2.classList.remove('hidden');
    banner3.classList.remove('hidden');
});
});







document.addEventListener('DOMContentLoaded', () => {
    // Существующие элементы и переменные (оставляем как есть)
    const currentScoreElement = document.querySelector('.currentScore');
    let totalCoins = parseInt(localStorage.getItem('totalCoins')) || 0;
    currentScoreElement.textContent = totalCoins;

    // Переменная для монет за очко в мини-играх
    window.coinsPerPoint = parseInt(localStorage.getItem('coinsPerPoint')) || 1;
    let coinsPerPointLevel = parseInt(localStorage.getItem('coinsPerPointLevel')) || 1;

    // Функция обновления монет
    function updateScore(newScore) {
        totalCoins = newScore;
        const scoreElements = document.querySelectorAll('.currentScore');
        scoreElements.forEach((element) => element.innerText = totalCoins);
        localStorage.setItem('totalCoins', totalCoins);
    }

    // Логика магазина улучшений
    const upgradeItems = {
        autoclick: { button: '.item_up1', overlay: '.overlay_1', container: '.container_up_buy_1', priceElement: '.coin_up1', buyButton: '.upgrade-button_1', closeButton: '.close-button_1', basePrice: 2000, levelElement: '.item-details_1' },
        click: { button: '.item_up2', overlay: '.overlay', container: '.container_up_buy_2', priceElement: '.coin_up', buyButton: '.upgrade-button_2', closeButton: '.close-button_2', basePrice: 1000, levelElement: '.item-details' },
        energy: { button: '.item_up3', overlay: '.overlay_3', container: '.container_up_buy_3', priceElement: '.coin_up3', buyButton: '.upgrade-button_3', closeButton: '.close-button_3', basePrice: 2000, levelElement: '.item-details_3' },
        recharge: { button: '.item_up4', overlay: '.overlay_4', container: '.container_up_buy_4', priceElement: '.coin_up4', buyButton: '.upgrade-button_4', closeButton: '.close-button_4', basePrice: 2000, levelElement: '.item-details_4' },
        coinsPerPoint: { button: '.item_up5', overlay: '.overlay_5', container: '.container_up_buy_5', priceElement: '.coin_up5', buyButton: '.upgrade-button_5', closeButton: '.close-button_5', basePrice: 1500, levelElement: '.item-details_5' }
    };

    // Инициализация уровней
    Object.keys(upgradeItems).forEach(key => {
        const level = parseInt(localStorage.getItem(`${key}Level`)) || 1;
        const item = upgradeItems[key];
        const levelElement = document.querySelector(item.levelElement);
        if (key === 'autoclick') {
            levelElement.textContent = `${item.basePrice} / 1h • Level ${level}`;
        } else {
            levelElement.textContent = `${level} • Level ${level}`;
        }
        const priceElement = document.querySelector(item.priceElement);
        priceElement.textContent = item.basePrice * level;
    });

    // Обработчики для открытия окон
    Object.keys(upgradeItems).forEach(key => {
        const item = upgradeItems[key];
        const button = document.querySelector(item.button);
        const overlay = document.querySelector(item.overlay);
        const container = document.querySelector(item.container);
        const closeButton = document.querySelector(item.closeButton);

        button.addEventListener('click', () => {
            overlay.style.display = 'block';
            container.style.display = 'block';
        });

        closeButton.addEventListener('click', () => {
            overlay.style.display = 'none';
            container.style.display = 'none';
        });
    });

    // Покупка улучшений
    function buyUpgrade(key) {
        const item = upgradeItems[key];
        const level = parseInt(localStorage.getItem(`${key}Level`)) || 1;
        const price = item.basePrice * level;
        if (totalCoins >= price) {
            totalCoins -= price;
            updateScore(totalCoins);

            const newLevel = level + 1;
            localStorage.setItem(`${key}Level`, newLevel);
            const priceElement = document.querySelector(item.priceElement);
            priceElement.textContent = item.basePrice * newLevel;
            const levelElement = document.querySelector(item.levelElement);
            if (key === 'autoclick') {
                levelElement.textContent = `${item.basePrice * newLevel} / 1h • Level ${newLevel}`;
            } else {
                levelElement.textContent = `${newLevel} • Level ${newLevel}`;
            }

            // Применение улучшений
            if (key === 'autoclick') {
                // Логика автокликера (уже есть в твоем коде)
            } else if (key === 'click') {
                window.updateCoinsPerClick(newLevel);
            } else if (key === 'energy') {
                window.maxEnergy = 100 + (newLevel - 1) * 50;
                localStorage.setItem('maxEnergy', window.maxEnergy);
            } else if (key === 'recharge') {
                window.updateEnergyRecoveryRate(newLevel * 3);
            } else if (key === 'coinsPerPoint') {
                window.coinsPerPoint = newLevel;
                localStorage.setItem('coinsPerPoint', newLevel);
                localStorage.setItem('coinsPerPointLevel', newLevel);
            }
        } else {
            alert('Недостаточно монет!');
        }
    }

    // Привязка кнопок покупки
    document.querySelector('.upgrade-button_1').addEventListener('click', () => buyUpgrade('autoclick'));
    document.querySelector('.upgrade-button_2').addEventListener('click', () => buyUpgrade('click'));
    document.querySelector('.upgrade-button_3').addEventListener('click', () => buyUpgrade('energy'));
    document.querySelector('.upgrade-button_4').addEventListener('click', () => buyUpgrade('recharge'));
    document.querySelector('.upgrade-button_5').addEventListener('click', () => buyUpgrade('coinsPerPoint'));

    // Существующий код кликера и мини-игр остается без изменений
});




document.addEventListener('DOMContentLoaded', () => {
  const clickButton = document.getElementById('clickButton');
  const currentScoreElement = document.querySelector('.currentScore');
  const progressBar = document.querySelector('#progressBar');
  const progressLabel = document.querySelector('#progressLabel');
  const energyDisplay = document.querySelector('#energyDisplay');
  const coinContainer = document.querySelector('#coinContainer');
  const conditionsModal = document.getElementById('conditionsModal');
  const closeModal = document.getElementById('closeModal');
  const subscribeButton = document.getElementById('subscribeButton');

  let progress = 0;
  const maxProgress = 100;
  let leagueLevel = 0;
  let clicksPerLevel = 10;

  window.energy = parseInt(localStorage.getItem('currentEnergy'), 10) || 100;
  window.maxEnergy = parseInt(localStorage.getItem('maxEnergy'), 10) || 100;
  const energyCost = 10;
  window.energyRecoveryRate = parseInt(localStorage.getItem('energyRecoveryRate'), 10) || 5;
  window.coinsPerClick = 1;

  // Переменные для условий
  let minigamesPlayed = parseInt(localStorage.getItem('minigamesPlayed')) || 0;
  let isSubscribedToTelegram = localStorage.getItem('isSubscribedToTelegram') === 'true';

  const savedCoinsPerClick = localStorage.getItem('coinsPerClick');
  if (savedCoinsPerClick) window.coinsPerClick = parseInt(savedCoinsPerClick, 10);

  const savedLeagueLevel = localStorage.getItem('leagueLevel');
  if (savedLeagueLevel !== null) {
    leagueLevel = parseInt(savedLeagueLevel, 10);
    setLeagueBackground(leagueLevel);
  }

  const savedEnergy = localStorage.getItem('currentEnergy');
  if (savedEnergy !== null) {
    window.energy = parseInt(savedEnergy, 10);
    energyDisplay.textContent = `${Math.round(window.energy)}/${window.maxEnergy}`;
  }

  const savedProgress = localStorage.getItem('currentProgress');
  if (savedProgress !== null) {
    progress = parseFloat(savedProgress);
    progressBar.style.width = `${progress}%`;
  }

  const savedCharacterImg = localStorage.getItem('selectedCharacterImg');
  if (savedCharacterImg) clickButton.src = savedCharacterImg;

  // Обновление интерфейса условий
  function updateConditionsDisplay() {
    const coins = parseInt(currentScoreElement.innerText) || 0;
    document.getElementById('coinsCondition').innerHTML = `Набрать 1000 монет: <span>${coins}/1000</span>`;
    document.getElementById('minigamesCondition').innerHTML = `Сыграть в мини-игры 5 раз: <span>${minigamesPlayed}/5</span>`;
    document.getElementById('telegramCondition').innerHTML = `Подписаться на Telegram: ${
      isSubscribedToTelegram ? 'Выполнено' : '<button id="subscribeButton">Подписаться</button>'
    }`;
    if (!isSubscribedToTelegram) {
      document.getElementById('subscribeButton').addEventListener('click', subscribeToTelegram);
    }
  }

  // Функция подписки на Telegram
  function subscribeToTelegram() {
    window.open('https://t.me/heroes_coin', '_blank'); // Замени на ссылку на твой канал
    isSubscribedToTelegram = true;
    localStorage.setItem('isSubscribedToTelegram', 'true');
    updateConditionsDisplay();
  }

  // Показать модальное окно
  function showConditionsModal() {
    updateConditionsDisplay();
    conditionsModal.style.display = 'flex';
  }

  // Закрыть модальное окно
  closeModal.addEventListener('click', () => {
    conditionsModal.style.display = 'none';
  });

  window.updateClickButtonImage = (imgSrc) => {
    const cleanSrc = imgSrc.includes('brawl_clicker-master/static/images/') ? imgSrc : `brawl_clicker-master/static/images/${imgSrc}`;
    clickButton.src = cleanSrc;
  };

  window.updateCoinsPerClick = (newCoinsPerClick) => {
    window.coinsPerClick = newCoinsPerClick;
    localStorage.setItem('coinsPerClick', newCoinsPerClick);
    const coinsPerClickDisplay = document.getElementById('coinsPerClickDisplay');
    if (coinsPerClickDisplay) coinsPerClickDisplay.textContent = `Монет за клик: ${window.coinsPerClick}`;
  };

  window.updateEnergyRecoveryRate = (newRate) => {
    window.energyRecoveryRate = newRate;
    localStorage.setItem('energyRecoveryRate', newRate);
    const energyRecoveryRateDisplay = document.getElementById('energyRecoveryRateDisplay');
    if (energyRecoveryRateDisplay) energyRecoveryRateDisplay.textContent = `Скорость восстановления энергии: ${newRate}`;
  };

  function recoverEnergy() {
    window.energy = Math.min(window.energy + window.energyRecoveryRate / 10, window.maxEnergy);
    energyDisplay.textContent = `${Math.round(window.energy)}/${window.maxEnergy}`;
  }

  setInterval(recoverEnergy, 50);

  function handleTap(event) {
    if (window.energy >= energyCost) {
      let score = parseInt(currentScoreElement.innerText) || 0;
      score += window.coinsPerClick;
      updateScore(score);

      const progressIncrement = (maxProgress / clicksPerLevel) * window.coinsPerClick;
      progress = Math.min(progress + progressIncrement, maxProgress);
      progressBar.style.width = `${progress}%`;
      localStorage.setItem('currentProgress', progress);

      window.energy = Math.max(window.energy - energyCost, 0);
      energyDisplay.textContent = `${Math.round(window.energy)}/${window.maxEnergy}`;

      const selectedCharacter = localStorage.getItem('selectedCharacter');
      spawnEffect(selectedCharacter, event);

      if (progress === maxProgress) {
        checkAndUpdateLeague();
      }
    }
  }

  function checkAndUpdateLeague() {
    const coins = parseInt(currentScoreElement.innerText) || 0;
    const conditionsMet = coins >= 1000 && minigamesPlayed >= 5 && isSubscribedToTelegram;

    if (leagueLevel === 0 && !conditionsMet) {
      showConditionsModal();
    } else {
      updateLeague();
      progress = 0;
      progressBar.style.width = '0%';
      localStorage.setItem('currentProgress', 0);
    }
  }

  // Пример функции для увеличения счетчика мини-игр (вызывай ее, когда игрок завершает мини-игру)
  window.incrementMinigamesPlayed = () => {
    minigamesPlayed++;
    localStorage.setItem('minigamesPlayed', minigamesPlayed);
  };

  clickButton.onclick = (event) => {
    handleTap(event);
    clickButton.classList.add('active');
    setTimeout(() => clickButton.classList.remove('active'), 300);
  };

  clickButton.addEventListener('touchstart', (event) => {
    event.preventDefault();
    const touches = event.touches;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const rect = clickButton.getBoundingClientRect();
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        const tapEvent = { clientX: touch.clientX, clientY: touch.clientY };
        handleTap(tapEvent);
      }
    }
    clickButton.classList.add('active');
    setTimeout(() => clickButton.classList.remove('active'), 300);
  });

  function updateScore(newScore) {
    const scoreElements = document.querySelectorAll('.currentScore');
    scoreElements.forEach((element) => element.innerText = newScore);
    localStorage.setItem('currentScore', newScore);
  }

  function updateLeague() {
    leagueLevel++;
    localStorage.setItem('leagueLevel', leagueLevel);
    setLeagueBackground(leagueLevel);
  }

  function setLeagueBackground(level) {
    const body = document.body;
    let backgroundImage = '';

    switch (level) {
      case 1:
        progressLabel.innerText = 'Ледяной мир';
        clicksPerLevel = 5;
        backgroundImage = 'brawl_clicker-master/static/images/ice.png';
        break;
      case 2:
        progressLabel.innerText = 'Адский мир';
        clicksPerLevel = 6;
        backgroundImage = 'brawl_clicker-master/static/images/ad.png';
        break;
      case 3:
        progressLabel.innerText = 'Китай';
        clicksPerLevel = 7;
        backgroundImage = 'brawl_clicker-master/static/images/china.png';
        break;
      case 4:
        progressLabel.innerText = 'Водный мир';
        clicksPerLevel = 8;
        backgroundImage = 'brawl_clicker-master/static/images/water_world.png';
        break;
      case 5:
        progressLabel.innerText = 'Мистика';
        clicksPerLevel = 8;
        backgroundImage = 'brawl_clicker-master/static/images/mystical.png';
        break;
      case 6:
        progressLabel.innerText = 'Кубический мир';
        clicksPerLevel = 10;
        backgroundImage = 'brawl_clicker-master/static/images/minecraft.png';
        break;
      case 7:
        progressLabel.innerText = 'Тьма';
        clicksPerLevel = 11;
        backgroundImage = 'brawl_clicker-master/static/images/dark.png';
        break;
      case 8:
        progressLabel.innerText = 'Космос';
        clicksPerLevel = 12;
        backgroundImage = 'brawl_clicker-master/static/images/cosmos.png';
        break;
      case 9:
        progressLabel.innerText = 'Темнота';
        clicksPerLevel = 13;
        backgroundImage = 'brawl_clicker-master/static/images/dark_2.png';
        break;
      case 10:
        progressLabel.innerText = 'НЛО';
        clicksPerLevel = 14;
        backgroundImage = 'brawl_clicker-master/static/images/plat.png';
        break;
      default:
        progressLabel.innerText = 'Деревня';
        leagueLevel = 0;
        clicksPerLevel = 5;
        backgroundImage = 'brawl_clicker-master/static/images/hogwarts.png';
    }

    body.style.backgroundImage = `url("${backgroundImage}")`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundAttachment = 'fixed';
    progressLabel.style.backgroundImage = `url("${backgroundImage}")`;
    progressLabel.style.backgroundSize = 'cover';
    progressLabel.style.backgroundPosition = 'center';

    if (backgroundImage === 'brawl_clicker-master/static/images/hogwarts.png' || backgroundImage === 'brawl_clicker-master/static/images/ice.png') {
      body.style.backgroundPosition = 'center calc(50% - 12vh)';
    } else {
      body.style.backgroundPosition = 'center';
    }

    localStorage.setItem('backgroundImage', backgroundImage);
  }

  function spawnEffect(selectedCharacter, event) {
    const effects = {
      "1": spawnCoinDrop,
      "2": createGhostEffect,
      "3": createLeafEffect,
      "4": createStoneEffect,
      "5": createFireEffect,
      "6": createWaterEffect,
      "7": createGodEffect,
      "8": createMagicEffect,
      "9": createHeartEffect,
      "10": createAnanasEffect,
      "11": createFrogEffect,
      "12": createRedEffect,
      "13": createDarkEffect,
      "14": createFishEffect,
      "15": createMinionEffect
    };
    if (effects[selectedCharacter]) effects[selectedCharacter](event);
  }

  function spawnCoinDrop(event) {
    const coin = document.createElement('div');
    coin.classList.add('coin_drop');
    coin.style.left = `${event.clientX - 20}px`;
    coin.style.top = `${event.clientY - 20}px`;
    coinContainer.appendChild(coin);
    coin.addEventListener('animationend', () => coin.remove());
  }
});

// Оставшиеся функции эффектов остаются без изменений (createGhostEffect, createLeafEffect и т.д.)

function createGhostEffect(event) {
  const ghost = document.createElement('div');
  ghost.classList.add('ghost-effect');
  const x = event.clientX;
  const y = event.clientY;
  ghost.style.left = `${x - 25}px`;
  ghost.style.top = `${y - 25}px`;
  document.body.appendChild(ghost);
  setTimeout(() => {
    ghost.remove();
  }, 1000);
}

function createLeafEffect(event) {
  const leaf = document.createElement('div');
  leaf.classList.add('leaf-effect');
  const x = event.clientX;
  const y = event.clientY;
  leaf.style.left = `${x - 25}px`;
  leaf.style.top = `${y - 25}px`;
  document.body.appendChild(leaf);
  setTimeout(() => {
    leaf.remove();
  }, 1000);
}

function createStoneEffect(event) {
  const stone = document.createElement('div');
  stone.classList.add('stone-effect');
  const x = event.clientX;
  const y = event.clientY;
  stone.style.left = `${x - 25}px`;
  stone.style.top = `${y - 25}px`;
  document.body.appendChild(stone);
  setTimeout(() => {
    stone.remove();
  }, 1000);
}

function createFireEffect(event) {
  const fire = document.createElement('div');
  fire.classList.add('fire-effect');
  const x = event.clientX;
  const y = event.clientY;
  fire.style.left = `${x - 25}px`;
  fire.style.top = `${y - 25}px`;
  document.body.appendChild(fire);
  setTimeout(() => {
    fire.remove();
  }, 1000);
}

function createWaterEffect(event) {
  const water = document.createElement('div');
  water.classList.add('water-effect');
  const x = event.clientX;
  const y = event.clientY;
  water.style.left = `${x - 25}px`;
  water.style.top = `${y - 25}px`;
  water.style.backgroundImage = 'url("brawl_clicker-master/static/images/water.png")';
  document.body.appendChild(water);
  setTimeout(() => {
    water.remove();
  }, 1000);
}

function createGodEffect(event) {
  const god = document.createElement('div');
  god.classList.add('god-effect');
  const x = event.clientX;
  const y = event.clientY;
  god.style.left = `${x - 25}px`;
  god.style.top = `${y - 25}px`;
  document.body.appendChild(god);
  setTimeout(() => {
    god.remove();
  }, 1000);
}

function createMagicEffect(event) {
  const magic = document.createElement('div');
  magic.classList.add('magic-effect');
  const x = event.clientX;
  const y = event.clientY;
  magic.style.left = `${x - 25}px`;
  magic.style.top = `${y - 25}px`;
  document.body.appendChild(magic);
  setTimeout(() => {
    magic.remove();
  }, 1000);
}

function createHeartEffect(event) {
  const heart = document.createElement('div');
  heart.classList.add('heart-effect');
  const x = event.clientX;
  const y = event.clientY;
  heart.style.left = `${x - 25}px`;
  heart.style.top = `${y - 25}px`;
  document.body.appendChild(heart);
  setTimeout(() => {
    heart.remove();
  }, 1000);
}

function createAnanasEffect(event) {
  const ananas = document.createElement('div');
  ananas.classList.add('ananas-effect');
  const x = event.clientX;
  const y = event.clientY;
  ananas.style.left = `${x - 25}px`;
  ananas.style.top = `${y - 25}px`;
  document.body.appendChild(ananas);
  setTimeout(() => {
    ananas.remove();
  }, 1000);
}

function createFrogEffect(event) {
  const frog = document.createElement('div');
  frog.classList.add('frog-effect');
  const x = event.clientX;
  const y = event.clientY;
  frog.style.left = `${x - 25}px`;
  frog.style.top = `${y - 25}px`;
  document.body.appendChild(frog);
  setTimeout(() => {
    frog.remove();
  }, 1000);
}

function createRedEffect(event) {
  const red = document.createElement('div');
  red.classList.add('red-effect');
  const x = event.clientX;
  const y = event.clientY;
  red.style.left = `${x - 25}px`;
  red.style.top = `${y - 25}px`;
  document.body.appendChild(red);
  setTimeout(() => {
    red.remove();
  }, 1000);
}

function createDarkEffect(event) {
  const dark = document.createElement('div');
  dark.classList.add('dark-effect');
  const x = event.clientX;
  const y = event.clientY;
  dark.style.left = `${x - 25}px`;
  dark.style.top = `${y - 25}px`;
  document.body.appendChild(dark);
  setTimeout(() => {
    dark.remove();
  }, 1000);
}

function createFishEffect(event) {
  const fish = document.createElement('div');
  fish.classList.add('fish-effect');
  const x = event.clientX;
  const y = event.clientY;
  fish.style.left = `${x - 25}px`;
  fish.style.top = `${y - 25}px`;
  document.body.appendChild(fish);
  setTimeout(() => {
    fish.remove();
  }, 1000);
}

function createMinionEffect(event) {
  const minion = document.createElement('div');
  minion.classList.add('minion-effect');
  const x = event.clientX;
  const y = event.clientY;
  minion.style.left = `${x - 25}px`;
  minion.style.top = `${y - 25}px`;
  document.body.appendChild(minion);
  setTimeout(() => {
    minion.remove();
  }, 1000);
}








document.addEventListener('DOMContentLoaded', () => {
  const itemUp1 = document.querySelector('.item_up1');
  const containerUpBuy1 = document.querySelector('.container_up_buy_1');
  const overlay1 = document.querySelector('.overlay_1');
  const closeButton1 = document.querySelector('.close-button_1');
  const upgradeButton1 = document.querySelector('.upgrade-button_1');
  const upgradeMessage1 = document.createElement('div'); // Сообщение
  const coinElement1 = document.querySelector('.coin_up1');
  const currentScoreElements1 = document.querySelectorAll('.currentScore');

  let currentScore = parseInt(localStorage.getItem('currentScore')) || 5000; // Баланс монет
  let autoClickerLevel = 1;
  const upgradePricesAutoClicker = [2000, 5000, 15000, 30000, 60000]; // Цены на улучшения
  const maxAutoClickerLevel = upgradePricesAutoClicker.length; // Максимальный уровень автокликера (5 уровней)
  let autoClickInterval = 5000; // Интервал автоклика в миллисекундах
  let autoClickerEnabled = false; // Автокликер изначально выключен

  // Добавляем сообщение на страницу
  upgradeMessage1.classList.add('upgrade-message');
  upgradeMessage1.style.display = 'none';
  document.body.appendChild(upgradeMessage1);

  // Функция обновления счета
  function updateScore(newScore) {
    currentScore = newScore;
    currentScoreElements1.forEach((element) => {
      element.innerText = currentScore;
    });
    localStorage.setItem('currentScore', currentScore); // Сохраняем баланс монет в localStorage
  }

  // Обновление информации об улучшении
  function updateAutoClickerDetails() {
    const upgradeCost = upgradePricesAutoClicker[autoClickerLevel - 1];

    if (coinElement1) {
      if (autoClickerLevel < maxAutoClickerLevel) {
        coinElement1.textContent = upgradeCost; // Если не максимальный уровень, показываем стоимость
      } else {
        coinElement1.textContent = "Максимум"; // Если максимальный уровень, пишем "Максимум"
      }
    }
    const coinsPerClick = autoClickerLevel * 10; // Количество монет за клик на текущем уровне
    const clicksPerHour = (3600 / (autoClickInterval / 1000)); // Количество кликов в час
    const coinsPerHour = coinsPerClick * clicksPerHour; // Количество монет в час

    // Обновляем информацию в интерфейсе
    const itemDetails1 = document.querySelector('.item_up1 .item-details_1');
    itemDetails1.textContent = `${coinsPerHour.toFixed(0)} монет в час • Уровень ${autoClickerLevel}`;
  }

  // Функция автокликера
  function startAutoClicker() {
    if (!autoClickerEnabled) {
      autoClickerEnabled = true; // Активируем автокликер
      setInterval(() => {
        if (autoClickerEnabled) {
          currentScore += autoClickerLevel * 10; // Прибавляем монеты за автоклики
          updateScore(currentScore);
        }
      }, autoClickInterval);
    }
  }

  // Покупка улучшения автокликера
  upgradeButton1.addEventListener('click', () => {
    const upgradeCost = upgradePricesAutoClicker[autoClickerLevel - 1];

    if (currentScore >= upgradeCost && autoClickerLevel < maxAutoClickerLevel) {
      currentScore -= upgradeCost;
      autoClickerLevel++;
      autoClickInterval = Math.max(1000, autoClickInterval - 500); // Уменьшаем интервал автокликов
      updateScore(currentScore);
      updateAutoClickerDetails();

      if (!autoClickerEnabled) {
        startAutoClicker(); // Запускаем автокликер при первой покупке
      }

      upgradeMessage1.textContent = 'Автокликер улучшен!';
      upgradeMessage1.style.display = 'block';

      setTimeout(() => {
        upgradeMessage1.style.display = 'none';
      }, 1500);

      // Закрываем окно улучшения
      containerUpBuy1.style.display = 'none';
      overlay1.style.display = 'none';
    } else if (autoClickerLevel >= maxAutoClickerLevel) {
      upgradeMessage1.textContent = 'Вы достигли максимального уровня автокликера!';
      upgradeMessage1.style.display = 'block';

      setTimeout(() => {
        upgradeMessage1.style.display = 'none';
      }, 1500);
    } else {
      upgradeMessage1.textContent = 'У вас недостаточно средств для улучшения!';
      upgradeMessage1.style.display = 'block';

      setTimeout(() => {
        upgradeMessage1.style.display = 'none';
      }, 1500);
    }
  });

  // Открытие окна улучшения
  itemUp1.addEventListener('click', () => {
    containerUpBuy1.style.display = 'block';
    overlay1.style.display = 'block';
  });

  // Закрытие окна улучшения
  closeButton1.addEventListener('click', () => {
    containerUpBuy1.style.display = 'none';
    overlay1.style.display = 'none';
  });

  // Закрытие окна при клике на затемнение
  overlay1.addEventListener('click', () => {
    containerUpBuy1.style.display = 'none';
    overlay1.style.display = 'none';
  });

  // Инициализация интерфейса
  updateScore(currentScore);
  updateAutoClickerDetails();
});


window.addEventListener('DOMContentLoaded', () => {
  const characters = document.querySelectorAll('.character');
  const preview = document.getElementById('preview');
  const previewImg = preview.querySelector('img');
  const characterDescription = document.getElementById('character-description');
  const selectButton = document.getElementById('select-button');

  const shopBox = document.querySelector('.shop_box');
  const overlayBox1 = document.querySelector('.overlay_box1');
  const containerBox1 = document.querySelector('.container_box_1');
  const containerBox11 = document.querySelector('.container_box_11');
  const closeButtonBox1 = document.querySelector('.close-button_box1');
  const closeRewardButton = document.querySelector('.close-reward-button');
  const upgradeButtonBox1 = document.querySelector('.upgrade-button_box1');
  const rewardImage = document.getElementById('rewardImage');

  // Список героев с ID
  const heroes = [
    { id: "1", img: "brawl_clicker-master/static/images/croco.png", name: "Character 1" },
    { id: "2", img: "brawl_clicker-master/static/images/cot.png", name: "Character 2" },
    { id: "3", img: "brawl_clicker-master/static/images/groot.png", name: "Character 3" },
    { id: "4", img: "brawl_clicker-master/static/images/golem.png", name: "Character 4" },
    { id: "5", img: "brawl_clicker-master/static/images/fire.png", name: "Character 5" },
    { id: "6", img: "brawl_clicker-master/static/images/water.png", name: "Character 6" },
    { id: "7", img: "brawl_clicker-master/static/images/tor.png", name: "Character 7" },
    { id: "8", img: "brawl_clicker-master/static/images/witch.png", name: "Character 8" },
    { id: "9", img: "brawl_clicker-master/static/images/angel.png", name: "Character 9" },
    { id: "10", img: "brawl_clicker-master/static/images/ananas.png", name: "Character 10" },
    { id: "11", img: "brawl_clicker-master/static/images/frog.png", name: "Character 11" },
    { id: "12", img: "brawl_clicker-master/static/images/leon.png", name: "Character 12" },
    { id: "13", img: "brawl_clicker-master/static/images/syth.png", name: "Character 13" },
    { id: "14", img: "brawl_clicker-master/static/images/cat.png", name: "Character 14" },
    { id: "15", img: "brawl_clicker-master/static/images/minion.png", name: "Character 15" },
  ];

  // Функция для блокировки персонажей
  function lockSpecificCharacters() {
    // Массив персонажей, которых нужно заблокировать
    const charactersToLock = [

    ];

    // Проходим по каждому из персонажей в массиве и блокируем их
    charactersToLock.forEach(hero => {
      const character = document.querySelector(`.character[data-id="${hero.id}"]`);
      if (character) {
        character.classList.add('locked'); // Добавляем класс 'locked'
        character.setAttribute('data-locked', 'true'); // Добавляем атрибут блокировки
      }
    });
  }

  // Функция для разблокировки персонажа
  function unlockCharacter(characterId) {
    const character = document.querySelector(`.character[data-id="${characterId}"]`);
    if (character) {
      character.classList.remove('locked'); // Убираем класс 'locked'
      character.removeAttribute('data-locked'); // Убираем атрибут блокировки
    }
  }

  // Блокируем персонажей при загрузке
  lockSpecificCharacters();

  // Открытие окна сундука
  shopBox.addEventListener('click', () => {
    overlayBox1.style.display = 'block';
    containerBox1.style.display = 'block';
  });

  // Закрытие окна при нажатии на кнопку закрытия
  closeButtonBox1.addEventListener('click', () => {
    overlayBox1.style.display = 'none';
    containerBox1.style.display = 'none';
  });

  // Закрытие окна при клике на слой затемнения
  overlayBox1.addEventListener('click', () => {
    overlayBox1.style.display = 'none';
    containerBox1.style.display = 'none';
  });

  // Открытие сундука
  upgradeButtonBox1.addEventListener('click', () => {
    containerBox1.style.display = 'none';

    // Выбираем случайного персонажа
    const randomHero = heroes[Math.floor(Math.random() * heroes.length)];

    // Показываем окно с выпавшим героем
    containerBox11.style.display = 'block';
    rewardImage.src = randomHero.img;
    rewardImage.alt = 'Выпавший герой';

    // Разблокировка персонажа после выпадения
    unlockCharacter(randomHero.id);  // Разблокируем персонажа
  });

  // Закрытие окна с выпавшим героем
  closeRewardButton.addEventListener('click', () => {
    overlayBox1.style.display = 'none';
    containerBox11.style.display = 'none';
  });

  let currentPreviewCharacter = null;
  let selectedCharacter = null;

  characters.forEach(character => {
    character.addEventListener('click', () => {
      const imgSrc = character.getAttribute('data-img');
      const description = character.getAttribute('data-description');

      previewImg.src = imgSrc;
      characterDescription.textContent = description;

      if (currentPreviewCharacter) {
        currentPreviewCharacter.classList.remove('selected-preview');
      }

      character.classList.add('selected-preview');
      currentPreviewCharacter = character;
    });
  });

  selectButton.addEventListener('click', () => {
    if (!currentPreviewCharacter) {
      alert('Выберите персонажа!');
      return;
    }

    if (currentPreviewCharacter.classList.contains('locked')) {
      alert('Этот персонаж заблокирован. Откройте его через сундук!');
      return;
    }

    const imgSrc = currentPreviewCharacter.getAttribute('data-img');
    const name = currentPreviewCharacter.getAttribute('data-name'); // Эта переменная не используется
    const description = currentPreviewCharacter.getAttribute('data-description');
    const characterId = currentPreviewCharacter.getAttribute('data-id');

    localStorage.setItem('selectedCharacter', characterId);
    localStorage.setItem('selectedCharacterImg', imgSrc);
    localStorage.setItem('selectedCharacterName', name); // И эта тоже
    localStorage.setItem('selectedCharacterDescription', description);

    if (selectedCharacter) {
      selectedCharacter.classList.remove('selected');
    }

    currentPreviewCharacter.classList.remove('selected-preview');
    currentPreviewCharacter.classList.add('selected');
    selectedCharacter = currentPreviewCharacter;

    if (window.updateClickButtonImage) {
      window.updateClickButtonImage(imgSrc);
    }
  });
});



document.addEventListener("DOMContentLoaded", function() {
  const menuButtons = document.querySelectorAll(".nav-button");
  const pages = document.querySelectorAll(".page");


  // Восстановление значений из localStorage (при загрузке страницы)
  function initializeScore() {
    const storedScore = parseInt(localStorage.getItem('currentScore')) || 0;
    updateScoreDisplay(storedScore);
  }

  // Функция для скрытия всех страниц
  function hideAllPages() {
    pages.forEach(page => {
      page.style.display = "none"; // Скрываем все страницы
    });
  }

  // Функция для деактивации всех кнопок меню
  function deactivateAllButtons() {
    menuButtons.forEach(button => {
      button.classList.remove("active"); // Убираем активный класс
    });
  }

  // Обработчик кликов по кнопкам меню
  menuButtons.forEach(button => {
    button.addEventListener("click", function(event) {
      event.preventDefault();

      // Деактивируем все кнопки
      deactivateAllButtons();

      // Активируем текущую кнопку
      this.classList.add("active");

      // Скрываем все страницы
      hideAllPages();

      // Получаем id страницы из атрибута data-page
      const pageId = this.getAttribute("data-page");

      // Отображаем нужную страницу
      const activePage = document.getElementById(pageId);
      activePage.style.display = "block"; // Показываем нужную страницу
    });
  });
});

// Менюшка
const menuIcon = document.getElementById('menu-icon');
const dropdownMenu = document.getElementById('dropdown-menu');

// Переключение видимости меню при клике на картинку
menuIcon.addEventListener('click', (event) => {
  event.stopPropagation(); // Предотвращаем всплытие события
  dropdownMenu.classList.toggle('active');
});

// Закрываем меню, если кликнули вне его
document.addEventListener('click', (event) => {
  if (!menuIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.remove('active');
  }
});

// Функция для загрузки содержимого по вкладке
function loadContent(section) {
  // Скрываем все секции
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.style.display = 'none';
  });

  // Показываем нужную секцию
  const activeSection = document.getElementById(section);
  if (activeSection) {
    activeSection.style.display = 'block';
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const previewImage = document.getElementById('preview-image');
  const previewName = document.getElementById('background-preview-name');
  const backgroundOptions = document.querySelectorAll('.background-option');
  const selectButton = document.getElementById('background-select-button');
  const resetButton = document.getElementById('background-reset-button');

  let currentSelectedBackground = null;

  // Функция для предпросмотра фона
  backgroundOptions.forEach(option => {
    option.addEventListener('click', () => {
      const imgSrc = option.getAttribute('data-img');
      const name = option.getAttribute('data-name');

      // Обновляем предпросмотр
      previewImage.src = imgSrc;
      previewName.textContent = name;

      // Убираем выделение с других опций
      backgroundOptions.forEach(option => option.classList.remove('selected'));

      // Выделяем текущую
      option.classList.add('selected');
      currentSelectedBackground = option;
    });
  });

  // Функция для применения выбранного фона
  selectButton.addEventListener('click', () => {
    if (!currentSelectedBackground) {
      alert('Выберите фон перед применением!');
      return;
    }

    const imgSrc = currentSelectedBackground.getAttribute('data-img');
    document.body.style.backgroundImage = `url('${imgSrc}')`;

    // Сохраняем выбранный фон в localStorage
    localStorage.setItem('selectedBackground', imgSrc);
  });

  // Функция для сброса фона
  resetButton.addEventListener('click', () => {
    document.body.style.backgroundImage = '';
    localStorage.removeItem('selectedBackground');
    alert('Фон сброшен!');
  });

  // Проверка сохраненного фона при загрузке страницы
  const savedBackground = localStorage.getItem('selectedBackground');
  if (savedBackground) {
    document.body.style.backgroundImage = `url('${savedBackground}')`;
  }
});

// Применение фона на всех страницах при загрузке
window.addEventListener('load', () => {
  const savedBackground = localStorage.getItem('selectedBackground');
  if (savedBackground) {
    document.body.style.backgroundImage = `url('${savedBackground}')`;
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const itemUp2 = document.querySelector('.item_up2');
  const containerUpBuy2 = document.querySelector('.container_up_buy_2');
  const overlay = document.querySelector('.overlay');
  const closeButton2 = document.querySelector('.close-button_2');
  const upgradeButton = document.querySelector('.upgrade-button_2');
  const upgradeMessage = document.createElement('div'); // Сообщение
  const itemDetails = document.querySelector('.item_up2 .item-details'); // Поле для обновления
  const coinElement = document.querySelector('.coin_up'); // Элемент для отображения цены улучшения
  const currentScoreElements = document.querySelectorAll('.currentScore'); // Все элементы для отображения текущего баланса монет

  // Создание и добавление сообщения на страницу
  upgradeMessage.classList.add('upgrade-message');
  upgradeMessage.style.display = 'none';
  document.body.appendChild(upgradeMessage);

  // Начальные значения
  let coinsPerClick = parseInt(localStorage.getItem('coinsPerClick')) || 1;
  let level = parseInt(localStorage.getItem('level')) || 1;
  const maxLevel = 10;
  const upgradePrices = [1000, 5000, 20000, 100000, 400000, 1000000, 3000000, 7000000, 18000000];

  // Экспортируем глобальные переменные и функции
  window.coinsPerClick = coinsPerClick;

  // Обновление coinsPerClick
  window.updateCoinsPerClick = (newCoinsPerClick) => {
    window.coinsPerClick = newCoinsPerClick;
    localStorage.setItem('coinsPerClick', newCoinsPerClick);

    // Обновляем интерфейс
    updateLevelDetails();  // Обновляем отображение уровня
  };

  // Функция обновления счета
  window.updateScore = (newScore) => {
    currentScoreElements.forEach((element) => {
      element.innerText = newScore;
    });
    localStorage.setItem('currentScore', newScore);  // Сохраняем в localStorage
  };

  // Функция обновления уровня и монет за клик
  function updateLevelDetails() {
    itemDetails.textContent = `${window.coinsPerClick} • Уровень ${level}`;  // Обновляем значение coinsPerClick в UI
    if (level < maxLevel) {
      coinElement.textContent = upgradePrices[level - 1];
    } else {
      coinElement.textContent = "Максимум";
    }

    // Обновление значения монет за клик на экране
    const coinsPerClickDisplay = document.getElementById('coinsPerClickDisplay');
    if (coinsPerClickDisplay) {
      coinsPerClickDisplay.textContent = `Монет за клик: ${window.coinsPerClick}`;
    }
  }

  // Первоначальное обновление UI
  updateLevelDetails();

  // Обработчик нажатия кнопки "Улучшить"
  upgradeButton.addEventListener('click', () => {
    const currentPrice = upgradePrices[level - 1];
    const currentScore = parseInt(localStorage.getItem('currentScore')) || 0;

    // Если уровень не максимальный
    if (level < maxLevel) {
      if (currentScore >= currentPrice) {
        level++;  // Увеличиваем уровень
        coinsPerClick = level;  // Увеличиваем монеты за клик до уровня
        window.updateCoinsPerClick(coinsPerClick);  // Сразу обновляем значение в глобальной переменной

        // Сохраняем данные
        localStorage.setItem('level', level);
        window.updateScore(currentScore - currentPrice);  // Обновляем счет

        // Обновляем интерфейс
        updateLevelDetails();

        upgradeMessage.innerText = `Монеты за клик увеличены до ${window.coinsPerClick}!`;
        upgradeMessage.style.display = 'block';

        setTimeout(() => {
          upgradeMessage.style.display = 'none';
        }, 1500);

        // Закрытие окна улучшений
        containerUpBuy2.style.display = 'none';
        overlay.style.display = 'none';
      } else {
        upgradeMessage.innerText = 'У вас недостаточно средств для улучшения!';
        upgradeMessage.style.display = 'block';

        setTimeout(() => {
          upgradeMessage.style.display = 'none';
        }, 1500);
      }
    } else {
      upgradeMessage.innerText = 'Вы достигли максимального уровня!';
      upgradeMessage.style.display = 'block';

      setTimeout(() => {
        upgradeMessage.style.display = 'none';
      }, 1500);
    }
  });

  // Открытие окна улучшений (при клике на itemUp2)
  itemUp2.addEventListener('click', () => {
    containerUpBuy2.style.display = 'block';
    overlay.style.display = 'block';
  });

  // Закрытие окна улучшений
  closeButton2.addEventListener('click', () => {
    containerUpBuy2.style.display = 'none';
    overlay.style.display = 'none';
  });

  // Закрытие окна при клике на overlay
  overlay.addEventListener('click', () => {
    containerUpBuy2.style.display = 'none';
    overlay.style.display = 'none';
  });
});


localStorage.setItem('level', 1);
localStorage.setItem('coinsPerClick', 1);


document.addEventListener('DOMContentLoaded', () => {
  const itemUp3 = document.querySelector('.item_up3');
  const containerUpBuy3 = document.querySelector('.container_up_buy_3');
  const overlay3 = document.querySelector('.overlay_3');
  const closeButton3 = document.querySelector('.close-button_3');
  const upgradeButton3 = document.querySelector('.upgrade-button_3');
  const upgradeMessage3 = document.createElement('div'); // Сообщение
  const itemDetails3 = document.querySelector('.item_up3 .item-details_3');
  const coinElement3 = document.querySelector('.coin_up3');
  const currentScoreElements3 = document.querySelectorAll('.currentScore');

  // Добавляем сообщение на страницу
  upgradeMessage3.classList.add('upgrade-message');
  upgradeMessage3.style.display = 'none';
  document.body.appendChild(upgradeMessage3);

  // Массив цен для каждого уровня улучшения энергии (теперь 5 уровней)
  const upgradePricesEnergy = [2000, 5000, 15000, 30000, 60000]; // Цены на улучшения для 5 уровней
  let energyLevel = parseInt(localStorage.getItem('energyLevel'), 10) || 1; // Уровень энергии
  const maxEnergyLevel = upgradePricesEnergy.length; // Максимальный уровень (5 уровней)

  // Инициализация глобальных переменных для энергии
  window.energy = parseInt(localStorage.getItem('currentEnergy'), 10) || 100; // Начальная энергия = 100
  window.maxEnergy = parseInt(localStorage.getItem('maxEnergy'), 10) || 100;

  // Функция обновления отображения уровня энергии и стоимости
  function updateEnergyDetails() {
    console.log(`Текущая энергия: ${window.energy}, Максимальная энергия: ${window.maxEnergy}`);

    if (itemDetails3) {
      itemDetails3.textContent = `${window.maxEnergy} • Уровень ${energyLevel}`;
    }

    if (coinElement3) {
      coinElement3.textContent = energyLevel < maxEnergyLevel ? upgradePricesEnergy[energyLevel - 1] : "Максимум";
    }
  }

  // Функция обновления счета
  function updateScore(newScore) {
    currentScoreElements3.forEach((element) => {
      element.innerText = newScore;
    });
    localStorage.setItem('currentScore', newScore); // Сохраняем баланс монет в localStorage
  }

  // Восстановление энергии до максимума
  function restoreEnergy() {
    window.energy = window.maxEnergy;  // Устанавливаем текущую энергию равной максимальной
    localStorage.setItem('currentEnergy', window.energy); // Сохраняем текущую энергию
    updateEnergyDetails(); // Обновляем интерфейс
  }

  // Инициализация интерфейса
  updateEnergyDetails();

  // Обработка нажатия кнопки улучшения энергии
  upgradeButton3.addEventListener('click', () => {
    const currentScore = parseInt(localStorage.getItem('currentScore')) || 0;
    const currentPriceEnergy = upgradePricesEnergy[energyLevel - 1];

    // Если достаточно монет и не достигнут максимальный уровень
    if (currentScore >= currentPriceEnergy && energyLevel < maxEnergyLevel) {
      // Обновляем счет
      updateScore(currentScore - currentPriceEnergy);

      // Показ сообщения об успешном улучшении
      upgradeMessage3.textContent = `Максимальная энергия увеличена до ${window.maxEnergy + 50}!`;
      upgradeMessage3.style.display = 'block';

      setTimeout(() => {
        upgradeMessage3.style.display = 'none';
      }, 1500);

      // Закрытие окна улучшения
      containerUpBuy3.style.display = 'none';
      overlay3.style.display = 'none';

      // Увеличиваем уровень энергии
      energyLevel++;
      localStorage.setItem('energyLevel', energyLevel);

      // Увеличиваем максимальную энергию в зависимости от уровня
      window.maxEnergy += 50; // Прибавляем 20 к максимальной энергии за каждый уровень
      localStorage.setItem('maxEnergy', window.maxEnergy);

      // Восстанавливаем энергию до максимума сразу
      restoreEnergy();

      // Обновляем интерфейс с новыми значениями
      updateEnergyDetails();
    } else if (energyLevel >= maxEnergyLevel) {
      // Если максимальный уровень достигнут
      upgradeMessage3.textContent = 'Вы достигли максимального уровня!';
      upgradeMessage3.style.display = 'block';

      setTimeout(() => {
        upgradeMessage3.style.display = 'none';
      }, 1500);
    } else {
      // Если недостаточно монет
      upgradeMessage3.textContent = 'У вас недостаточно средств для улучшения!';
      upgradeMessage3.style.display = 'block';

      setTimeout(() => {
        upgradeMessage3.style.display = 'none';
      }, 1500);
    }
  });

  // Открытие окна улучшения
  itemUp3.addEventListener('click', () => {
    containerUpBuy3.style.display = 'block';
    overlay3.style.display = 'block';
  });

  // Закрытие окна улучшения
  closeButton3.addEventListener('click', () => {
    containerUpBuy3.style.display = 'none';
    overlay3.style.display = 'none';
  });

  // Закрытие окна при клике на затемнение
  overlay3.addEventListener('click', () => {
    containerUpBuy3.style.display = 'none';
    overlay3.style.display = 'none';
  });

  // Обновляем интерфейс в случае изменений
  updateEnergyDetails();
});

// Сброс энергии до 0
localStorage.setItem('currentEnergy', 0); // Сброс текущей энергии
localStorage.setItem('maxEnergy', 100); // Установка начальной максимальной энергии (например, 100)
localStorage.setItem('energyLevel', 1); // Установка начального уровня энергии


document.addEventListener('DOMContentLoaded', () => {
  // Элементы интерфейса
  const itemUp4 = document.querySelector('.item_up4');
  const containerUpBuy4 = document.querySelector('.container_up_buy_4');
  const overlay4 = document.querySelector('.overlay_4');
  const closeButton4 = document.querySelector('.close-button_4');
  const upgradeButton4 = document.querySelector('.upgrade-button_4');
  const upgradeMessage4 = document.createElement('div'); // Сообщение
  const itemDetails4 = document.querySelector('.item_up4 .item-details_4'); // Поле для обновления уровня
  const coinElement4 = document.querySelector('.coin_up4'); // Элемент для отображения цены улучшения
  const currentScoreElements = document.querySelectorAll('.currentScore'); // Все элементы для отображения текущего баланса монет

  // Добавление сообщения в DOM
  upgradeMessage4.classList.add('upgrade-message'); // Добавляем класс для стилизации
  document.body.appendChild(upgradeMessage4); // Добавляем в body

  // Начальные значения
  let recoveryLevel = parseInt(localStorage.getItem('recoveryLevel'), 10) || 1;
  const maxRecoveryLevel = 5;
  const baseRecoveryRate = 3;
  const recoveryRateIncrement = 5;
  const upgradePrices = [1000, 5000, 20000, 100000]; // Стоимость улучшения на каждом уровне

  // Рассчитываем текущую скорость восстановления энергии
  window.energyRecoveryRate = baseRecoveryRate + (recoveryLevel - 1) * recoveryRateIncrement;

  // Обновление интерфейса (скорость восстановления и уровень)
  function updateEnergyRecoveryDisplay() {
    const energyRecoveryRateDisplay = document.getElementById('energyRecoveryRateDisplay');
    if (energyRecoveryRateDisplay) {
      energyRecoveryRateDisplay.textContent = `Уровень восстановления энергии: ${recoveryLevel}, Скорость: ${window.energyRecoveryRate}`;
    }

    // Обновляем текстовое поле itemDetails4 (если есть)
    if (itemDetails4) {
      itemDetails4.textContent = `${window.energyRecoveryRate} • Уровень ${recoveryLevel}`;
    }
  }

  // Обновление монет
  function updatePlayerCoinsDisplay() {
    currentScoreElements.forEach((element) => {
      const playerCoins = parseInt(localStorage.getItem('currentScore'), 10) || 0;
      element.innerText = playerCoins;
    });
  }

  // Рассчитываем стоимость улучшения
  function calculateUpgradeCost(level) {
    return upgradePrices[level - 1];
  }

  // Обновление отображения стоимости улучшения
  function updateUpgradeCostDisplay() {
    const cost = recoveryLevel < maxRecoveryLevel ? calculateUpgradeCost(recoveryLevel) : 'Максимум'; // Если максимальный уровень, отображаем "Максимум"
    if (coinElement4) {
      coinElement4.textContent = cost;
    }
  }

  // Первоначальная настройка
  updateEnergyRecoveryDisplay();
  updatePlayerCoinsDisplay();
  updateUpgradeCostDisplay();

  // Обработчик нажатия кнопки "Улучшить"
  upgradeButton4.addEventListener('click', () => {
    const currentScore = parseInt(localStorage.getItem('currentScore'), 10) || 0;
    const currentPrice = calculateUpgradeCost(recoveryLevel);

    // Проверяем, достаточно ли монет
    if (recoveryLevel < maxRecoveryLevel) {
      if (currentScore >= currentPrice) {
        // Увеличиваем уровень восстановления
        recoveryLevel++;
        window.energyRecoveryRate = baseRecoveryRate + (recoveryLevel - 1) * recoveryRateIncrement;

        // Списываем монеты
        const newScore = currentScore - currentPrice;
        localStorage.setItem('currentScore', newScore);
        localStorage.setItem('recoveryLevel', recoveryLevel);
        localStorage.setItem('energyRecoveryRate', window.energyRecoveryRate);

        // Обновляем интерфейс
        updateEnergyRecoveryDisplay();
        updatePlayerCoinsDisplay();
        updateUpgradeCostDisplay();

        // Сообщение об успехе
        upgradeMessage4.innerText = `Уровень восстановления улучшен! Скорость восстановления: ${window.energyRecoveryRate}.`;
        upgradeMessage4.style.display = 'block';
        setTimeout(() => {
          upgradeMessage4.style.display = 'none';
        }, 1500);

        // Закрытие окна улучшений
        containerUpBuy4.style.display = 'none';
        overlay4.style.display = 'none';
      } else {
        // Если монет недостаточно
        upgradeMessage4.innerText = 'У вас недостаточно монет для улучшения!';
        upgradeMessage4.style.display = 'block';
        setTimeout(() => {
          upgradeMessage4.style.display = 'none';
        }, 1500);
      }
    } else {
      // Если достигнут максимальный уровень
      upgradeMessage4.innerText = 'Вы достигли максимального уровня восстановления энергии!';
      upgradeMessage4.style.display = 'block';
      setTimeout(() => {
        upgradeMessage4.style.display = 'none';
      }, 1500);
    }
  });

  // Открытие окна улучшений
  itemUp4.addEventListener('click', () => {
    containerUpBuy4.style.display = 'block';
    overlay4.style.display = 'block';
    updateUpgradeCostDisplay();
  });

  // Закрытие окна улучшений
  closeButton4.addEventListener('click', () => {
    containerUpBuy4.style.display = 'none';
    overlay4.style.display = 'none';
  });

  // Закрытие окна при клике на overlay
  overlay4.addEventListener('click', () => {
    containerUpBuy4.style.display = 'none';
    overlay4.style.display = 'none';
  });
});

// Сброс прогресса восстановления энергии
localStorage.setItem('recoveryLevel', 1); // Сброс уровня восстановления
localStorage.setItem('energyRecoveryRate', baseRecoveryRate); // Сброс скорости восстановления до начальной
// Обновление интерфейса
recoveryLevel = 1;
window.energyRecoveryRate = baseRecoveryRate;
updateEnergyRecoveryDisplay(); // Обновляем отображение уровня и скорости восстановления


 // Показ/скрытие рулетки
        const openWheelBtn = document.getElementById('open-wheel');
        const closeWheelBtn = document.getElementById('close-btn');
        const wheelContainer = document.getElementById('wheel-container');

        openWheelBtn.addEventListener('click', () => {
            wheelContainer.style.display = 'flex';
        });

        closeWheelBtn.addEventListener('click', () => {
            wheelContainer.style.display = 'none';
        });

        // Логика рулетки
        const spinButton = document.getElementById('spin-btn');
        const wheel = document.getElementById('wheel');
        const result = document.getElementById('result');

        const prizes = [
            "Приз: 100 монет",
            "Приз: 200 монет",
            "Приз: 500 монет",
            "Приз: Бесплатный сундук",
            "Приз: Скидка 10%",
            "Приз: Секретный подарок"
        ];

        let isSpinning = false;
        let currentRotation = 0;

        spinButton.addEventListener('click', () => {
            if (isSpinning) return;
            isSpinning = true;

            const randomStop = Math.floor(Math.random() * 360);
            const fullRotations = 5;
            const targetRotation = fullRotations * 360 + randomStop;

            wheel.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
            wheel.style.transform = `rotate(${currentRotation + targetRotation}deg)`;

            const sectorAngle = 360 / prizes.length;
            const winningIndex = Math.floor((randomStop / sectorAngle) % prizes.length);

            setTimeout(() => {
                result.textContent = prizes[winningIndex];
                isSpinning = false;
                currentRotation += targetRotation;
            }, 5000);
        });

        const prizesContainer = document.getElementById('prizes-container');


// Функция сброса кликов до 1
function resetClicks() {
  coinsPerClick = 1; // Сбрасываем количество монет за клик
  localStorage.setItem('coinsPerClick', coinsPerClick); // Обновляем значение в localStorage
}

// Вызываем сброс
resetClicks();



// Функция сброса уровня до 1
// Сброс уровня до 1 и монет за клик для теста
localStorage.setItem('level', 1);
localStorage.setItem('coinsPerClick', 1);



// Монеты
localStorage.setItem('currentScore', 100000000);


 // Сбросить к начальному состоянию
  energyRecoveryRate = 5;
  recoveryLevel = 1;
  itemDetails4.textContent = `${energyRecoveryRate} • Уровень ${recoveryLevel}`;
});



// Сброс скорости восстановления энергии до начального значения
energyRecoveryRate = 5; // Сбрасываем на начальное значение
localStorage.setItem('energyRecoveryRate', energyRecoveryRate); // Сохраняем в localStorage
console.log(`Скорость восстановления энергии сброшена до начального значения: ${energyRecoveryRate}`);


// Сброс скорости восстановления энергии до начального значения
energyRecoveryRate = 5; // Сбрасываем на начальное значение
localStorage.setItem('energyRecoveryRate', energyRecoveryRate); // Сохраняем в localStorage
console.log(`Скорость восстановления энергии сброшена до начального значения: ${energyRecoveryRate}`);



// Сброс прогресса
localStorage.setItem('currentProgress', 0);
progressBar.style.width = '0%';
console.log('Прогресс сброшен до 0 для тестирования.');


// Сброс прогресса восстановления энергии
localStorage.setItem('recoveryLevel', 1); // Сброс уровня восстановления
localStorage.setItem('energyRecoveryRate', baseRecoveryRate); // Сброс скорости восстановления до начальной
// Обновление интерфейса
recoveryLevel = 1;
window.energyRecoveryRate = baseRecoveryRate;
updateEnergyRecoveryDisplay(); // Обновляем отображение уровня и скорости восстановления



// Сброс энергии до 0
localStorage.setItem('currentEnergy', 0); // Сброс текущей энергии
localStorage.setItem('maxEnergy', 100); // Установка начальной максимальной энергии (например, 100)
localStorage.setItem('energyLevel', 1); // Установка начального уровня энергии
