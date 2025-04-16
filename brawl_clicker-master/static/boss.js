// Получаем элементы
const upgradeIcons = document.querySelectorAll('.upgrade-icon');
const modal = document.getElementById('upgradeModal');
const modalImage = document.getElementById('modalImage');
const modalText = document.getElementById('modalText');
const buyButton = document.getElementById('buyButton');

// Описания улучшений для каждой игры
const upgrades = {
    game1: {
        image: 'brawl_clicker-master/static/images/safe.png',
        text: 'Сейф: заменяет мешок на сейф, увеличивая его размер и зону захвата.',
        price: 500
    },
    game2: {
        image: 'brawl_clicker-master/static/images/paddle2.png',
        text: 'Увеличенная бита: заменяет стандартную биту на увеличенную (105px).',
        price: 600
    },
    game3: {
        image: 'brawl_clicker-master/static/images/cannon2.png',
        text: 'Новая пушка: заменяет стандартную пушку на улучшенную с уроном 25.',
        price: 700
    },
    game4: {
        image: 'brawl_clicker-master/static/images/fireshot.png',
        text: 'Маленький мяч: уменьшает размер мяча, облегчая уклонение от препятствий.',
        price: 400
    }
};

// Переменные для отслеживания состояния улучшений
let isSafeActive = localStorage.getItem('isSafeActive') === 'true'; // Для игры 1
let isPaddle2Active = localStorage.getItem('isPaddle2Active') === 'true'; // Для игры 2
let isCannon2Active = localStorage.getItem('isCannon2Active') === 'true'; // Для игры 3
let isSmallBallActive = localStorage.getItem('isSmallBallActive') === 'true'; // Для игры 4

// Обработчик клика по значку улучшения
upgradeIcons.forEach(icon => {
    icon.addEventListener('click', (event) => {
        event.stopPropagation();

        const game = icon.getAttribute('data-game');
        const upgrade = upgrades[game];

        modalImage.src = upgrade.image;
        if (game === 'game1' && isSafeActive) {
            modalText.textContent = 'Убрать сейф и вернуть мешок?';
            buyButton.textContent = 'Убрать';
        } else if (game === 'game2' && isPaddle2Active) {
            modalText.textContent = 'Убрать увеличенную биту и вернуть стандартную?';
            buyButton.textContent = 'Убрать';
        } else if (game === 'game3' && isCannon2Active) {
            modalText.textContent = 'Убрать улучшенную пушку и вернуть стандартную?';
            buyButton.textContent = 'Убрать';
        } else if (game === 'game4' && isSmallBallActive) {
            modalText.textContent = 'Убрать маленький мяч и вернуть стандартный?';
            buyButton.textContent = 'Убрать';
        } else {
            modalText.textContent = `${upgrade.text} Цена: ${upgrade.price} монет`;
            buyButton.textContent = 'Купить';
        }
        buyButton.setAttribute('data-game', game);

        modal.style.display = 'flex';
    });
});

// Переменная totalCoins должна быть доступна глобально
let totalCoins = parseInt(localStorage.getItem('totalCoins')) || 0;
const currentScoreElement = document.querySelector('.currentScore');
if (currentScoreElement) {
    currentScoreElement.textContent = totalCoins;
}

// Закрытие модального окна при клике на кнопку "Купить" или "Убрать"
buyButton.addEventListener('click', () => {
    const game = buyButton.getAttribute('data-game');

    if (game === 'game1' && isSafeActive) {
        isSafeActive = false;
        localStorage.setItem('isSafeActive', 'false');
        alert('Сейф убран, мешок возвращён!');
    } else if (game === 'game2' && isPaddle2Active) {
        isPaddle2Active = false;
        localStorage.setItem('isPaddle2Active', 'false');
        alert('Увеличенная бита убрана, стандартная бита возвращена!');
    } else if (game === 'game3' && isCannon2Active) {
        isCannon2Active = false;
        localStorage.setItem('isCannon2Active', 'false');
        alert('Улучшенная пушка убрана, стандартная пушка возвращена!');
    } else if (game === 'game4' && isSmallBallActive) {
        isSmallBallActive = false;
        localStorage.setItem('isSmallBallActive', 'false');
        alert('Маленький мяч убран, стандартный мяч возвращён!');
    } else {
        const price = upgrades[game].price;

        if (totalCoins >= price) {
            totalCoins -= price;
            localStorage.setItem('totalCoins', totalCoins);
            if (currentScoreElement) currentScoreElement.textContent = totalCoins;
            alert(`Улучшение для ${game} куплено!`);

            if (game === 'game1') {
                isSafeActive = true;
                localStorage.setItem('isSafeActive', 'true');
            } else if (game === 'game2') {
                isPaddle2Active = true;
                localStorage.setItem('isPaddle2Active', 'true');
            } else if (game === 'game3') {
                isCannon2Active = true;
                localStorage.setItem('isCannon2Active', 'true');
            } else if (game === 'game4') {
                isSmallBallActive = true;
                localStorage.setItem('isSmallBallActive', 'true');
            }
        } else {
            alert('Недостаточно монет для покупки улучшения!');
        }
    }

    modal.style.display = 'none';
});

// Закрытие модального окна при клике вне его
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('startBanner');
    const banner2 = document.getElementById('startBanner2');
    const banner3 = document.getElementById('startBanner3');
    const banner4 = document.getElementById('startBanner4');

    if (!currentScoreElement) {
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

    if (!gameContainer || !bag || !scoreElement || !gameOverScreen || !finalScoreElement || !exitButton) {
        console.error("One or more DOM elements for Game 1 are missing. Game 1 will not be initialized.");
    } else {
        exitButton.style.display = 'none';

        banner.addEventListener('click', () => {
            banner.classList.add('hidden');
            banner2.classList.add('hidden');
            banner3.classList.add('hidden');
            banner4.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            startGame();
        });

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
            banner4.classList.remove('hidden');
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

            if (isSafeActive) {
                bag.classList.remove('bag');
                bag.classList.add('safe');
            } else {
                bag.classList.remove('safe');
                bag.classList.add('bag');
            }

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
                const bagActiveWidth = isSafeActive ? 120 : 80;
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
                    totalCoins += window.coinsPerPoint || 1;
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
    const finalLevel = document.getElementById('finalLevel');
    const exitButton2 = document.getElementById('exitButton2');

    let gameActive2 = false;
    let playerScore = 0;
    let computerScore = 0;
    let level = 1;
    let puckX = gameContainer2 ? gameContainer2.offsetWidth / 2 - 15 : 0;
    let puckY = gameContainer2 ? gameContainer2.offsetHeight / 2 - 15 : 0;
    let puckSpeedX = 5;
    let puckSpeedY = 5;
    let paddleX = gameContainer2 ? gameContainer2.offsetWidth / 2 - 50 : 0;
    let computerPaddleX = gameContainer2 ? gameContainer2.offsetWidth / 2 - 50 : 0;
    let computerSpeed = 0.005;
    let timeSinceLastGoal = 0;
    let speedMultiplier = 1;
    const maxSpeed = 15;
    const minSpeed = 2;
    const speedBoost = 1.05;
    let lastPaddleHit = null;
    let frameCounter = 0;
    let targetX = (gameContainer2 ? gameContainer2.offsetWidth - (computerPaddle ? computerPaddle.offsetWidth : 0) : 0) / 2;
    let lastTime = performance.now();

    if (exitButton2) {
        exitButton2.style.display = 'none';
    }

    if (banner2) {
        banner2.addEventListener('click', () => {
            banner.classList.add('hidden');
            banner2.classList.add('hidden');
            banner3.classList.add('hidden');
            banner4.classList.add('hidden');
            gameContainer2.classList.remove('hidden');
            startGame2();
        });
    }

    const handleMouseMove = (e) => {
        if (!gameActive2) return;
        const rect = gameContainer2.getBoundingClientRect();
        paddleX = e.clientX - rect.left - paddle.offsetWidth / 2;
        if (paddleX < 0) paddleX = 0;
        if (paddleX > gameContainer2.offsetWidth - paddle.offsetWidth) {
            paddleX = gameContainer2.offsetWidth - paddle.offsetWidth;
        }
        if (paddle) paddle.style.transform = `translateX(${paddleX}px)`;
    };

    const handleTouchMove = (e) => {
        if (!gameActive2) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = gameContainer2.getBoundingClientRect();
        paddleX = touch.clientX - rect.left - paddle.offsetWidth / 2;
        if (paddleX < 0) paddleX = 0;
        if (paddleX > gameContainer2.offsetWidth - paddle.offsetWidth) {
            paddleX = gameContainer2.offsetWidth - paddle.offsetWidth;
        }
        if (paddle) paddle.style.transform = `translateX(${paddleX}px)`;
    };

    if (gameContainer2) {
        gameContainer2.addEventListener('mousemove', handleMouseMove);
        gameContainer2.addEventListener('touchstart', handleTouchMove);
        gameContainer2.addEventListener('touchmove', handleTouchMove);
    }

    if (exitButton2) {
        exitButton2.addEventListener('click', (e) => {
            e.stopPropagation();
            endGame2();
            gameContainer2.classList.add('hidden');
            banner.classList.remove('hidden');
            banner2.classList.remove('hidden');
            banner3.classList.remove('hidden');
            banner4.classList.remove('hidden');
            if (gameOverScreen2) {
                gameOverScreen2.classList.add('hidden');
                gameOverScreen2.style.display = 'none';
            }
            if (exitButton2) {
                exitButton2.style.display = 'none';
            }
        });
    }

    function startGame2() {
        gameActive2 = true;
        playerScore = 0;
        computerScore = 0;
        level = 1;
        if (playerScoreElement) playerScoreElement.textContent = playerScore;
        if (computerScoreElement) computerScoreElement.textContent = computerScore;
        if (levelElement) levelElement.textContent = level;
        puckX = gameContainer2.offsetWidth / 2 - 15;
        puckY = gameContainer2.offsetHeight / 2 - 35;
        puckSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
        puckSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);
        paddleX = gameContainer2.offsetWidth / 2 - 50;
        computerPaddleX = gameContainer2.offsetWidth / 2 - 50;
        computerSpeed = 0.005;
        timeSinceLastGoal = 0;
        speedMultiplier = 1;
        lastPaddleHit = null;
        frameCounter = 0;
        targetX = (gameContainer2.offsetWidth - computerPaddle.offsetWidth) / 2;

        if (gameOverScreen2) {
            gameOverScreen2.classList.add('hidden');
            gameOverScreen2.style.display = 'none';
        }
        if (exitButton2) exitButton2.style.display = 'none';
        lastTime = performance.now();

        // Применяем улучшение, если увеличенная бита активна
        if (isPaddle2Active) {
            paddle.classList.remove('paddle');
            paddle.classList.add('paddle2');
        } else {
            paddle.classList.remove('paddle2');
            paddle.classList.add('paddle');
        }

        if (puck) puck.style.transform = `translate(${puckX}px, ${puckY}px)`;
        if (paddle) paddle.style.transform = `translateX(${paddleX}px)`;
        if (computerPaddle) computerPaddle.style.transform = `translateX(${computerPaddleX}px)`;

        gameLoop2();
    }

    function gameLoop2(timestamp) {
        if (!gameActive2) return;

        const currentTime = timestamp || performance.now();
        const deltaTime = (currentTime - lastTime) / 16.67;
        lastTime = currentTime;

        timeSinceLastGoal++;
        if (timeSinceLastGoal % 300 === 0) {
            speedMultiplier += 0.015;
            if (speedMultiplier > 1.5) speedMultiplier = 1.5;
        }

        puckX += puckSpeedX * (1 + level * 0.05) * speedMultiplier * deltaTime;
        puckY += puckSpeedY * (1 + level * 0.05) * speedMultiplier * deltaTime;
        if (puck) puck.style.transform = `translate(${puckX}px, ${puckY}px)`;

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
            if (Math.abs(puckSpeedY) < 1) {
                puckSpeedY = (puckSpeedY >= 0 ? 1 : -1) * (1 + Math.random());
            }
        }

        if (puckY <= 0) {
            playerScore++;
            level = Math.min(level + 1, 10);
            totalCoins += window.coinsPerPoint || 1;
            if (currentScoreElement) currentScoreElement.textContent = totalCoins;
            localStorage.setItem('totalCoins', totalCoins);
            if (playerScoreElement) playerScoreElement.textContent = playerScore;
            if (levelElement) levelElement.textContent = level;
            resetPuck();
            timeSinceLastGoal = 0;
            speedMultiplier = 1;
        } else if (puckY >= gameContainer2.offsetHeight - puck.offsetHeight) {
            computerScore++;
            if (computerScoreElement) computerScoreElement.textContent = computerScore;
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

        frameCounter++;
        const updateInterval = Math.max(10, 30 - level * 2);
        if (frameCounter % updateInterval === 0) {
            const predictionChance = Math.min(0.9, 0.5 + level * 0.05);
            const randomness = Math.max(30, 120 - level * 10);

            if (puckSpeedY < 0 && Math.random() < predictionChance) {
                const timeToTop = puckY / Math.abs(puckSpeedY);
                let predictedPuckX = puckX + puckSpeedX * timeToTop;

                while (predictedPuckX < 0 || predictedPuckX > gameContainer2.offsetWidth - puck.offsetWidth) {
                    if (predictedPuckX < 0) {
                        predictedPuckX = -predictedPuckX;
                    } else if (predictedPuckX > gameContainer2.offsetWidth - puck.offsetWidth) {
                        predictedPuckX = 2 * (gameContainer2.offsetWidth - puck.offsetWidth) - predictedPuckX;
                    }
                }

                targetX = predictedPuckX - computerPaddle.offsetWidth / 2 + (Math.random() - 0.5) * randomness;
            } else {
                targetX = puckX - computerPaddle.offsetWidth / 2 + (Math.random() - 0.5) * randomness;
            }
        }

        const adaptiveSpeed = computerSpeed + level * 0.015;
        computerPaddleX += (targetX - computerPaddleX) * adaptiveSpeed;

        if (computerPaddleX < 0) computerPaddleX = 0;
        if (computerPaddleX > gameContainer2.offsetWidth - computerPaddle.offsetWidth) {
            computerPaddleX = gameContainer2.offsetWidth - computerPaddle.offsetWidth;
        }
        if (computerPaddle) computerPaddle.style.transform = `translateX(${computerPaddleX}px)`;

        if (computerScore >= 3) {
            endGame2();
        }

        requestAnimationFrame(gameLoop2);
    }

    function resetPuck() {
        puckX = gameContainer2.offsetWidth / 2 - 15;
        puckY = gameContainer2.offsetHeight / 2 - 30;
        puckSpeedX = 0;
        puckSpeedY = 0;
        lastPaddleHit = null;
        if (puck) {
            puck.style.transform = `translate(${puckX}px, ${puckY}px)`;
            puck.classList.add('blinking');
        }

        setTimeout(() => {
            puckSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1) * (1 + level * 0.05);
            puckSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1) * (1 + level * 0.05);
            if (puck) puck.classList.remove('blinking');
        }, 500);
    }

    function endGame2() {
        gameActive2 = false;
        if (finalPlayerScore) finalPlayerScore.textContent = playerScore;
        if (finalComputerScore) finalComputerScore.textContent = computerScore;
        if (finalLevel) finalLevel.textContent = level;

        if (gameOverScreen2) {
            gameOverScreen2.classList.remove('hidden');
            gameOverScreen2.style.display = 'block';
        }

        if (exitButton2) {
            exitButton2.style.display = 'block';
        }

        if (window.incrementMinigamesPlayed) {
            window.incrementMinigamesPlayed();
        }
    }

    function restartGame2() {
        endGame2();
        if (gameOverScreen2) {
            gameOverScreen2.classList.add('hidden');
            gameOverScreen2.style.display = 'none';
        }
        startGame2();
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
    const cannon2 = document.getElementById('cannon2'); // Новая пушка

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
    let currentCannon = cannon; // Текущая пушка

    // Функция для проверки попадания точки в треугольник
    function isPointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
        const d = (by - cy) * (ax - cx) + (cy - ay) * (bx - cx);
        const alpha = ((by - cy) * (px - cx) + (cy - py) * (bx - cx)) / d;
        const beta = ((cy - ay) * (px - cx) + (py - ay) * (cx - bx)) / d;
        const gamma = 1 - alpha - beta;
        return alpha >= 0 && beta >= 0 && gamma >= 0;
    }

    if (!gameContainer3 || !scoreElement3 || !bossHealthElement || !gameOverScreen3 || !finalScoreElement3 || !gameOverMessage3 || !exitButton3 || !boss || !cannon || !cannon2) {
        console.error("One or more DOM elements for Game 3 are missing. Game 3 will not be initialized.");
    } else {
        gameOverScreen3.classList.add('hidden');
        cannon2.style.display = 'none'; // По умолчанию скрываем cannon2

        banner3.addEventListener('click', () => {
            banner.classList.add('hidden');
            banner2.classList.add('hidden');
            banner3.classList.add('hidden');
            banner4.classList.add('hidden');
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
            cannonPosition = clientX - rect.left - currentCannon.offsetWidth / 2;
            if (cannonPosition < 0) cannonPosition = 0;
            if (cannonPosition > gameContainer3.offsetWidth - currentCannon.offsetWidth) {
                cannonPosition = gameContainer3.offsetWidth - currentCannon.offsetWidth;
            }
            currentCannon.style.left = `${cannonPosition}px`;
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

            // Устанавливаем текущую пушку в зависимости от улучшения
            currentCannon = isCannon2Active ? cannon2 : cannon;
            cannon.style.display = isCannon2Active ? 'none' : 'block';
            cannon2.style.display = isCannon2Active ? 'block' : 'none';
            currentCannon.style.left = `${cannonPosition}px`;

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
            // Выбираем тип снаряда в зависимости от текущей пушки
            bullet.classList.add(currentCannon === cannon ? 'player-bullet' : 'player-bullet2');
            bullet.style.left = `${cannonPosition + currentCannon.offsetWidth / 2 - 14}px`; // Учитываем ширину снаряда (28px / 2)
            bullet.style.bottom = `${currentCannon.offsetHeight + 50}px`;
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
                const cannonCenterX = cannonPosition + currentCannon.offsetWidth / 2;
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
                    const cannonCenterX = cannonPosition + currentCannon.offsetWidth / 2;
                    const cannonCenterY = gameContainer3.offsetHeight - currentCannon.offsetHeight / 2;
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
                const targetPosition = cannonPosition + currentCannon.offsetWidth / 2 - boss.offsetWidth / 2;
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
                    // Урон зависит от типа снаряда
                    const damage = bullet.classList.contains('player-bullet2') ? 25 : 15;
                    bossHealth -= damage;
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
                            const backgroundImageIce4 = 'brawl_clicker-master/static/images/ice.png';
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
                            const backgroundImageDark3 = 'brawl_clicker-master/static/images/pirate.png';
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
                            const backgroundImageMystical = 'brawl_clicker-master/static/images/poison.png';
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
                            // Урон клону тоже зависит от типа снаряда
                            const damage = bullet.classList.contains('player-bullet2') ? 25 : 15;
                            clone.hp -= damage;
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
                const containerRect = gameContainer3.getBoundingClientRect();

                // Координаты центра снаряда относительно gameContainer3
                const bulletCenterX = bulletRect.left + bulletRect.width / 2 - containerRect.left;
                const bulletCenterY = bulletRect.top + bulletRect.height / 2 - containerRect.top;

                // Определяем маленький треугольный хитбокс, привязанный к центру пушки
                const hitboxWidth = 50; // Ширина основания треугольника (меньше визуальной ширины 90px)
                const hitboxHeight = 70; // Высота треугольника (меньше визуальной высоты 110px)
                const cannonCenterX = cannonPosition + 90 / 2; // Центр пушки (визуальная ширина 90px)
                const cannonBottomY = gameContainer3.offsetHeight - 80; // bottom: 80px
                const cannonTopY = cannonBottomY - hitboxHeight; // Верх треугольника

                // Вершины треугольника
                const ax = cannonCenterX; // Вершина A (середина верха)
                const ay = cannonTopY;
                const bx = cannonCenterX - hitboxWidth / 2; // Вершина B (левый нижний угол)
                const by = cannonBottomY;
                const cx = cannonCenterX + hitboxWidth / 2; // Вершина C (правый нижний угол)
                const cy = cannonBottomY;

                // Проверяем попадание центра снаряда в треугольник
                if (isPointInTriangle(bulletCenterX, bulletCenterY, ax, ay, bx, by, cx, cy)) {
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
            banner4.classList.remove('hidden');
        });
    }

// Игра 4: Уклонение от препятствий
const gameContainer4 = document.getElementById('gameContainer4');
const ball = document.getElementById('ball');
const survivalTimeElement = document.getElementById('survivalTime');
const gameOverScreen4 = document.getElementById('gameOver4');
const finalSurvivalTimeElement = document.getElementById('finalSurvivalTime');
const earnedCoinsElement = document.getElementById('earnedCoins');
const exitButton4 = document.getElementById('exitButton4');

if (!gameContainer4 || !ball || !survivalTimeElement || !gameOverScreen4 || !finalSurvivalTimeElement || !earnedCoinsElement || !exitButton4) {
    console.error("One or more DOM elements for Game 4 are missing. Game 4 will not be initialized.");
} else {
    let gameActive4 = false;
    let survivalTime = 0;
    let obstacles = [];
    let obstacleSpawnInterval;
    let timeTrackingInterval;
    let ballOnLeft = true;
    let earnedCoins = 0;
    let obstacleSpeed = 1;
    let spawnInterval = 2000;
    let lastSideSwitchTime = 0;

    gameContainer4.style.backgroundImage = 'url("brawl_clicker-master/static/images/race.png")';
    gameContainer4.style.backgroundSize = 'cover';
    gameContainer4.style.backgroundPosition = 'center';

    exitButton4.style.display = 'none';

    banner4.addEventListener('click', () => {
        console.log("Banner 4 clicked, starting Game 4");
        banner.classList.add('hidden');
        banner2.classList.add('hidden');
        banner3.classList.add('hidden');
        banner4.classList.add('hidden');
        gameContainer4.classList.remove('hidden');
        startGame4();
    });

    ball.addEventListener('click', () => {
        if (!gameActive4) return;
        ballOnLeft = !ballOnLeft;
        lastSideSwitchTime = survivalTime;
        const ballWidth = ball.getBoundingClientRect().width || 60;
        ball.style.left = ballOnLeft ? '20px' : `${gameContainer4.offsetWidth - ballWidth - 20}px`;
    });

    ball.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!gameActive4) return;
        ballOnLeft = !ballOnLeft;
        lastSideSwitchTime = survivalTime;
        const ballWidth = ball.getBoundingClientRect().width || 60;
        ball.style.left = ballOnLeft ? '20px' : `${gameContainer4.offsetWidth - ballWidth - 20}px`;
    });

    exitButton4.addEventListener('click', (e) => {
        e.stopPropagation();
        endGame4();
        gameContainer4.classList.add('hidden');
        banner.classList.remove('hidden');
        banner2.classList.remove('hidden');
        banner3.classList.remove('hidden');
        banner4.classList.remove('hidden');
        exitButton4.style.display = 'none';
    });

    function startGame4() {
        console.log("Starting Game 4");
        gameActive4 = true;
        survivalTime = 0;
        earnedCoins = 0;
        obstacleSpeed = 1;
        spawnInterval = 2000;
        lastSideSwitchTime = 0;
        survivalTimeElement.textContent = survivalTime;
        obstacles = [];
        gameOverScreen4.classList.add('hidden');
        exitButton4.style.display = 'none';

        if (isSmallBallActive) {
            ball.classList.add('small-ball');
        } else {
            ball.classList.remove('small-ball');
        }

        ballOnLeft = true;
        ball.style.left = '20px';
        spawnObstacles();
        trackTime();
        gameLoop4();
    }

    function spawnObstacle() {
        if (!gameActive4) return;
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        const obstacleWidth = 100;
        obstacle.style.left = `${Math.random() * (gameContainer4.offsetWidth - obstacleWidth)}px`;
        obstacle.style.top = '0px';
        gameContainer4.appendChild(obstacle);
        obstacles.push(obstacle);
        console.log("Spawned regular obstacle at left:", obstacle.style.left);
    }

    function spawnObstacles() {
        if (!gameActive4) {
            console.log("Game is not active, stopping obstacle spawning");
            return;
        }
        console.log("Spawning obstacle");
        spawnObstacle();
        obstacleSpawnInterval = setTimeout(spawnObstacles, spawnInterval);
    }

    function trackTime() {
        if (!gameActive4) return;
        survivalTime++;
        survivalTimeElement.textContent = survivalTime;

        if (survivalTime % 5 === 0) {
            earnedCoins += 1;
        }

        if (survivalTime % 10 === 0 && survivalTime > 0) {
            spawnInterval = Math.max(500, spawnInterval - 200);
            obstacleSpeed += 0.1;
            console.log("New spawn interval:", spawnInterval, "New obstacle speed:", obstacleSpeed);
        }

        timeTrackingInterval = setTimeout(trackTime, 1000);
    }

    function gameLoop4() {
        if (!gameActive4) return;

        obstacles.forEach((obstacle, index) => {
            let obstacleTop = parseFloat(obstacle.style.top) || 0;
            obstacleTop += obstacleSpeed;
            obstacle.style.top = `${obstacleTop}px`;

            const obstacleRect = obstacle.getBoundingClientRect();
            const ballRect = ball.getBoundingClientRect();

            // Уменьшаем хитбокс мяча на 20% по ширине и высоте
            const hitboxShrink = 0.2; // 20% уменьшение
            const ballHitbox = {
                top: ballRect.top + ballRect.height * hitboxShrink / 2,
                bottom: ballRect.bottom - ballRect.height * hitboxShrink / 2,
                left: ballRect.left + ballRect.width * hitboxShrink / 2,
                right: ballRect.right - ballRect.width * hitboxShrink / 2
            };

            if (
                obstacleRect.bottom >= ballHitbox.top &&
                obstacleRect.top <= ballHitbox.bottom &&
                obstacleRect.right >= ballHitbox.left &&
                obstacleRect.left <= ballHitbox.right
            ) {
                endGame4();
            }

            if (obstacleTop > gameContainer4.offsetHeight) {
                obstacle.remove();
                obstacles.splice(index, 1);
            }
        });

        requestAnimationFrame(gameLoop4);
    }

    function endGame4() {
        gameActive4 = false;
        clearTimeout(obstacleSpawnInterval);
        clearTimeout(timeTrackingInterval);
        obstacles.forEach(obstacle => obstacle.remove());
        obstacles = [];
        finalSurvivalTimeElement.textContent = survivalTime;
        earnedCoinsElement.textContent = earnedCoins;

        totalCoins += earnedCoins;
        if (currentScoreElement) currentScoreElement.textContent = totalCoins;
        localStorage.setItem('totalCoins', totalCoins);

        gameOverScreen4.classList.remove('hidden');
        exitButton4.style.display = 'block';
        if (window.incrementMinigamesPlayed) window.incrementMinigamesPlayed();
    }
}
});

