document.addEventListener('DOMContentLoaded', () => {
    // Общие элементы
    const banner = document.getElementById('startBanner');
    const banner2 = document.getElementById('startBanner2');
    const banner3 = document.getElementById('startBanner3');
    const currentScoreElement = document.querySelector('.currentScore');

    let totalCoins = parseInt(localStorage.getItem('totalCoins')) || 0;
    if (currentScoreElement) {
        currentScoreElement.textContent = totalCoins;
    } else {
        console.warn("Element '.currentScore' not found. Score display may not work.");
    }

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

    // Проверка элементов для 1-й игры
    if (!gameContainer || !bag || !scoreElement || !gameOverScreen || !finalScoreElement || !exitButton) {
        console.error("One or more DOM elements for Game 1 are missing. Game 1 will not be initialized.");
    } else {
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
            if (!gameActive) return;
            isDraggingBag = true;
            moveBag(e.clientX);
        });

        document.addEventListener('mousemove', (e) => {
            if (!gameActive || !isDraggingBag) return;
            moveBag(e.clientX);
        });

        document.addEventListener('mouseup', () => {
            isDraggingBag = false;
        });

        // Управление сенсорным экраном
        gameContainer.addEventListener('touchstart', (e) => {
            if (!gameActive) return;
            e.preventDefault();
            isDraggingBag = true;
            moveBag(e.touches[0].clientX);
        });

        gameContainer.addEventListener('touchmove', (e) => {
            if (!gameActive || !isDraggingBag) return;
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
            e.stopPropagation();
            endGame();
            gameContainer.classList.add('hidden');
            banner.classList.remove('hidden');
            banner2.classList.remove('hidden');
            banner3.classList.remove('hidden');
            exitButton.style.display = 'none';
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
                    totalCoins += window.coinsPerPoint || 1; // Добавляем проверку на существование coinsPerPoint
                    if (currentScoreElement) currentScoreElement.textContent = totalCoins;
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
            if (window.incrementMinigamesPlayed) window.incrementMinigamesPlayed();
        }
    }

// Игра 2: Аэрохоккей
const gameContainer2 = document.getElementById('gameContainer2');
const paddle = document.getElementById('paddle');
const computerPaddle = document.getElementById('computerPaddle');
const puck = document.getElementById('puck');
const playerScoreElement = document.getElementById('playerScore');
const computerScoreElement = document.getElementById('computerScore');
const levelElement = document.getElementById('levelValue');
const gameOverScreen2 = document.getElementById('gameOver2');
const finalPlayerScore = document.getElementById('finalPlayerScore');
const finalComputerScore = document.getElementById('finalComputerScore');
const exitButton2 = document.getElementById('exitButton2');

let gameActive2 = false;
let playerScore = 0;
let computerScore = 0;
let level = 1;
let puckX = gameContainer2 ? gameContainer2.offsetWidth / 2 - 10 : 0;
let puckY = gameContainer2 ? gameContainer2.offsetHeight / 2 - 10 : 0;
let puckSpeedX = 3; // Оставляем сниженную скорость шайбы
let puckSpeedY = 3; // Оставляем сниженную скорость шайбы
let paddleX = gameContainer2 ? gameContainer2.offsetWidth / 2 - 50 : 0;
let computerPaddleX = gameContainer2 ? gameContainer2.offsetWidth / 2 - 50 : 0;
let computerSpeed = 0.05; // Возвращаем исходную скорость компьютера (было 0.02, теперь 0.05)
let timeSinceLastGoal = 0;
let speedMultiplier = 1;
const maxSpeed = 15;
const minSpeed = 2;
const speedBoost = 1.05;
let lastPaddleHit = null;

// Проверка элементов для 2-й игры
if (!gameContainer2 || !paddle || !computerPaddle || !puck || !playerScoreElement || !computerScoreElement || !levelElement || !gameOverScreen2 || !finalPlayerScore || !finalComputerScore || !exitButton2) {
    console.error("One or more DOM elements for Game 2 are missing. Game 2 will not be initialized.");
} else {
    // Скрываем кнопку выхода изначально, как в 1-й игре
    exitButton2.style.display = 'none';

    banner2.addEventListener('click', () => {
        banner.classList.add('hidden');
        banner2.classList.add('hidden');
        banner3.classList.add('hidden');
        gameContainer2.classList.remove('hidden');
        startGame2();
    });

    gameContainer2.addEventListener('mousemove', (e) => {
        const rect = gameContainer2.getBoundingClientRect();
        paddleX = e.clientX - rect.left - paddle.offsetWidth / 2;
        if (paddleX < 0) paddleX = 0;
        if (paddleX > gameContainer2.offsetWidth - paddle.offsetWidth) {
            paddleX = gameContainer2.offsetWidth - paddle.offsetWidth;
        }
        paddle.style.left = `${paddleX}px`;
    });

    // Поддержка сенсорного управления
    gameContainer2.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = gameContainer2.getBoundingClientRect();
        paddleX = touch.clientX - rect.left - paddle.offsetWidth / 2;
        if (paddleX < 0) paddleX = 0;
        if (paddleX > gameContainer2.offsetWidth - paddle.offsetWidth) {
            paddleX = gameContainer2.offsetWidth - paddle.offsetWidth;
        }
        paddle.style.left = `${paddleX}px`;
    });

    gameContainer2.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = gameContainer2.getBoundingClientRect();
        paddleX = touch.clientX - rect.left - paddle.offsetWidth / 2;
        if (paddleX < 0) paddleX = 0;
        if (paddleX > gameContainer2.offsetWidth - paddle.offsetWidth) {
            paddleX = gameContainer2.offsetWidth - paddle.offsetWidth;
        }
        paddle.style.left = `${paddleX}px`;
    });

    exitButton2.addEventListener('click', (e) => {
        e.stopPropagation(); // Предотвращаем всплытие события, как в 1-й игре
        endGame2();
        gameContainer2.classList.add('hidden');
        banner.classList.remove('hidden');
        banner2.classList.remove('hidden');
        banner3.classList.remove('hidden');
        exitButton2.style.display = 'none'; // Скрываем кнопку при выходе, как в 1-й игре
    });

    function startGame2() {
        gameActive2 = true;
        playerScore = 0;
        computerScore = 0;
        level = 1;
        playerScoreElement.textContent = playerScore;
        computerScoreElement.textContent = computerScore;
        levelElement.textContent = level;
        puckX = gameContainer2.offsetWidth / 2 - 10;
        puckY = gameContainer2.offsetHeight / 2 - 10;
        puckSpeedX = 3 * (Math.random() > 0.5 ? 1 : -1);
        puckSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
        paddleX = gameContainer2.offsetWidth / 2 - 50;
        computerPaddleX = gameContainer2.offsetWidth / 2 - 50;
        computerSpeed = 0.05; // Возвращаем исходную скорость компьютера
        timeSinceLastGoal = 0;
        speedMultiplier = 1;
        lastPaddleHit = null;
        gameOverScreen2.classList.add('hidden');
        exitButton2.style.display = 'none'; // Убеждаемся, что кнопка скрыта во время игры
        gameLoop2();
    }

    function gameLoop2() {
        if (!gameActive2) return;

        timeSinceLastGoal++;
        if (timeSinceLastGoal % 300 === 0) {
            speedMultiplier += 0.05;
            if (speedMultiplier > 2) speedMultiplier = 2;
        }

        puckX += puckSpeedX * (1 + level * 0.1) * speedMultiplier;
        puckY += puckSpeedY * (1 + level * 0.1) * speedMultiplier;
        puck.style.left = `${puckX}px`;
        puck.style.top = `${puckY}px`;

        const speed = Math.sqrt(puckSpeedX * puckSpeedX + puckSpeedY * puckSpeedY);
        if (speed > maxSpeed) {
            const scale = maxSpeed / speed;
            puckSpeedX *= scale;
            puckSpeedY *= scale;
        }
        if (speed < minSpeed && speed > 0) {
            const scale = minSpeed / speed;
            puckSpeedX *= scale;
            puckSpeedY *= scale;
        }

        if (puckX <= 0 || puckX >= gameContainer2.offsetWidth - puck.offsetWidth) {
            puckSpeedX = -puckSpeedX;
        }

        if (puckY <= 0) {
            playerScore++;
            level++;
            totalCoins += window.coinsPerPoint || 1;
            if (currentScoreElement) currentScoreElement.textContent = totalCoins;
            localStorage.setItem('totalCoins', totalCoins);
            playerScoreElement.textContent = playerScore;
            levelElement.textContent = level;
            resetPuck();
            timeSinceLastGoal = 0;
            speedMultiplier = 1;
        } else if (puckY >= gameContainer2.offsetHeight - puck.offsetHeight) {
            computerScore++;
            computerScoreElement.textContent = computerScore;
            resetPuck();
            timeSinceLastGoal = 0;
            speedMultiplier = 1;
        }

        const puckRect = puck.getBoundingClientRect();
        const paddleRect = paddle.getBoundingClientRect();
        const computerPaddleRect = computerPaddle.getBoundingClientRect();

        if (
            puckRect.bottom >= paddleRect.top &&
            puckRect.top <= paddleRect.bottom &&
            puckRect.right >= paddleRect.left &&
            puckRect.left <= paddleRect.right &&
            lastPaddleHit !== 'player'
        ) {
            puckSpeedY = -Math.abs(puckSpeedY);
            puckSpeedX *= speedBoost;
            puckSpeedY *= speedBoost;
            lastPaddleHit = 'player';
        }

        if (
            puckRect.bottom >= computerPaddleRect.top &&
            puckRect.top <= computerPaddleRect.bottom &&
            puckRect.right >= computerPaddleRect.left &&
            puckRect.left <= computerPaddleRect.right &&
            lastPaddleHit !== 'computer'
        ) {
            puckSpeedY = Math.abs(puckSpeedY);
            puckSpeedX *= speedBoost;
            puckSpeedY *= speedBoost;
            lastPaddleHit = 'computer';
        }

        if (
            !(
                puckRect.bottom >= paddleRect.top &&
                puckRect.top <= paddleRect.bottom &&
                puckRect.right >= paddleRect.left &&
                puckRect.left <= paddleRect.right
            ) &&
            !(
                puckRect.bottom >= computerPaddleRect.top &&
                puckRect.top <= computerPaddleRect.bottom &&
                puckRect.right >= computerPaddleRect.left &&
                puckRect.left <= computerPaddleRect.right
            )
        ) {
            lastPaddleHit = null;
        }

        const targetX = puckX - computerPaddle.offsetWidth / 2 + (Math.random() - 0.5) * 50;
        computerPaddleX += (targetX - computerPaddleX) * (computerSpeed + level * 0.03);
        if (computerPaddleX < 0) computerPaddleX = 0;
        if (computerPaddleX > gameContainer2.offsetWidth - computerPaddle.offsetWidth) {
            computerPaddleX = gameContainer2.offsetWidth - computerPaddle.offsetWidth;
        }
        computerPaddle.style.left = `${computerPaddleX}px`;

        if (computerScore >= 5) {
            endGame2();
        }

        requestAnimationFrame(gameLoop2);
    }

    function resetPuck() {
        puckX = gameContainer2.offsetWidth / 2 - 10;
        puckY = gameContainer2.offsetHeight / 2 - 10;
        puckSpeedX = 3 * (Math.random() > 0.5 ? 1 : -1) * (1 + level * 0.1);
        puckSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1) * (1 + level * 0.1);
        lastPaddleHit = null;
    }

    function endGame2() {
        gameActive2 = false;
        finalPlayerScore.textContent = playerScore;
        finalComputerScore.textContent = computerScore;
        gameOverScreen2.classList.remove('hidden');
        exitButton2.style.display = 'block'; // Показываем кнопку на экране "Game Over", как в 1-й игре
        if (window.incrementMinigamesPlayed) window.incrementMinigamesPlayed();
    }

    function restartGame2() {
        endGame2();
        gameOverScreen2.classList.add('hidden');
        startGame2();
    }
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

    let score3 = 0;
    let gameActive3 = false;
    let cannonPosition = window.innerWidth / 2 - 50;
    let bossPosition = window.innerWidth / 2 - 75;
    let bossDirection = 1;
    let bossSpeed = 2;
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

    // Проверка элементов для 3-й игры
    if (!gameContainer3 || !scoreElement3 || !bossHealthElement || !gameOverScreen3 || !finalScoreElement3 || !gameOverMessage3 || !exitButton3 || !boss || !cannon) {
        console.error("One or more DOM elements for Game 3 are missing. Game 3 will not be initialized.");
    } else {
        gameOverScreen3.classList.add('hidden');

        banner3.addEventListener('click', () => {
            banner.classList.add('hidden');
            banner2.classList.add('hidden');
            banner3.classList.add('hidden');
            gameContainer3.classList.remove('hidden');
            startGame3();
        });

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
                    bullet.dataset.angle = baseAngle + (i - 1.5) * 32;
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
                currentBoss === 1 ? 1500 :
                currentBoss === 2 ? 1800 :
                currentBoss === 3 ? 1300 :
                currentBoss === 4 ? 1500 :
                currentBoss === 5 ? 2000 :
                currentBoss === 6 ? 1500 :
                4000);
        }

        function gameLoop3() {
            if (!gameActive3) return;

            if (currentBoss === 1) {
                bossPosition += 1 * bossDirection;
                if (bossPosition <= 0 || bossPosition >= gameContainer3.offsetWidth - boss.offsetWidth) {
                    bossDirection *= -1;
                }
            } else if (currentBoss === 2) {
                bossPosition += 1 * bossDirection;
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
                    totalCoins += window.coinsPerPoint || 1;
                    if (currentScoreElement) currentScoreElement.textContent = totalCoins;
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
                            if (currentScoreElement) currentScoreElement.textContent = totalCoins;
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
                    bulletTop += dy * 0.7;
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
                    const speed = currentBoss === 1 ? 2 :
                                   currentBoss === 2 ? 1.5 :
                                   2;
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
                if (currentScoreElement) currentScoreElement.textContent = totalCoins;
                localStorage.setItem('totalCoins', totalCoins);
            }
            if (window.incrementMinigamesPlayed) window.incrementMinigamesPlayed();
        }

        exitButton3.addEventListener('click', () => {
            gameContainer3.classList.add('hidden');
            banner.classList.remove('hidden');
            banner2.classList.remove('hidden');
            banner3.classList.remove('hidden');
        });
    }
});