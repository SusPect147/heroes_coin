// Глобальные переменные
const coinsPerPoint = 1;
let totalCoins = 0;
let energy = 100;
let maxEnergy = 100;
let energyRecoveryRate = 5;
let coinsPerClick = 1;
let minigamesPlayed = 0;
let isSubscribedToTelegram = false;

// Обновление отображения счета
function updateScore(newScore) {
    const scoreElements = document.querySelectorAll('.currentScore');
    scoreElements.forEach(element => element.textContent = newScore);
    totalCoins = newScore;
}

// Обновление энергии
function updateEnergyDisplay() {
    const energyDisplay = document.querySelector('#energyDisplay');
    if (energyDisplay) {
        energyDisplay.textContent = `${Math.round(energy)}/${maxEnergy}`;
    }
}

// Улучшения для игр
const upgrades = {
    game1: { image: 'brawl_clicker-master/static/images/safe.png', text: 'Сейф: заменяет мешок на сейф, увеличивая его размер и зону захвата.', price: 500 },
    game2: { image: 'brawl_clicker-master/static/images/paddle2.png', text: 'Увеличенная бита: заменяет стандартную биту на увеличенную (105px).', price: 600 },
    game3: { image: 'brawl_clicker-master/static/images/cannon2.png', text: 'Новая пушка: заменяет стандартную пушку на улучшенную с уроном 25.', price: 700 },
    game4: { image: 'brawl_clicker-master/static/images/fireshot.png', text: 'Маленький мяч: уменьшает размер мяча, облегчая уклонение от препятствий.', price: 400 }
};

// Состояние улучшений
let isSafeActive = false;
let isPaddle2Active = false;
let isCannon2Active = false;
let isSmallBallActive = false;

// Обработчик улучшений
function setupUpgrades() {
    const upgradeIcons = document.querySelectorAll('.upgrade-icon');
    const modal = document.getElementById('upgradeModal');
    const modalImage = document.getElementById('modalImage');
    const modalText = document.getElementById('modalText');
    const buyButton = document.getElementById('buyButton');

    if (!modal || !modalImage || !modalText || !buyButton) return;

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

    buyButton.addEventListener('click', () => {
        const game = buyButton.getAttribute('data-game');
        if (game === 'game1' && isSafeActive) {
            isSafeActive = false;
            alert('Сейф убран, мешок возвращён!');
        } else if (game === 'game2' && isPaddle2Active) {
            isPaddle2Active = false;
            alert('Увеличенная бита убрана, стандартная бита возвращена!');
        } else if (game === 'game3' && isCannon2Active) {
            isCannon2Active = false;
            alert('Улучшенная пушка убрана, стандартная пушка возвращена!');
        } else if (game === 'game4' && isSmallBallActive) {
            isSmallBallActive = false;
            alert('Маленький мяч убран, стандартный мяч возвращён!');
        } else {
            const price = upgrades[game].price;
            if (totalCoins >= price) {
                totalCoins -= price;
                updateScore(totalCoins);
                alert(`Улучшение для ${game} куплено!`);
                if (game === 'game1') isSafeActive = true;
                else if (game === 'game2') isPaddle2Active = true;
                else if (game === 'game3') isCannon2Active = true;
                else if (game === 'game4') isSmallBallActive = true;
            } else {
                alert('Недостаточно монет для покупки улучшения!');
            }
        }
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) modal.style.display = 'none';
    });
}

// Игра 1: Лови монеты
function setupGame1() {
    const banner = document.getElementById('startBanner');
    const banner2 = document.getElementById('startBanner2');
    const banner3 = document.getElementById('startBanner3');
    const banner4 = document.getElementById('startBanner4');
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
        console.error("Missing DOM elements for Game 1");
        return;
    }

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
    moveBag(e.touches[0].clientX); // Исправлено с moveBag茅 на moveBag
});

    gameContainer.addEventListener('touchend', () => {
        isDraggingBag = false;
    });

    function moveBag(clientX) {
        const rect = gameContainer.getBoundingClientRect();
        bagPosition = clientX - rect.left - bag.offsetWidth / 2;
        bagPosition = Math.max(0, Math.min(bagPosition, gameContainer.offsetWidth - bag.offsetWidth));
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

        bag.classList.toggle('safe', isSafeActive);
        bag.classList.toggle('bag', !isSafeActive);
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
  (coinRect.bottom >= bagRect.top &&
                coinRect.top <= bagActiveBottom &&
                coinRect.right >= bagActiveLeft &&
                coinRect.left <= bagActiveRight
            ) {
                coin.remove();
                coins.splice(index, 1);
                score++;
                totalCoins += coinsPerPoint;
                updateScore(totalCoins);
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
        minigamesPlayed++;
    }
}

// Игра 2: Аэрохоккей
function setupGame2() {
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
    const banner = document.getElementById('startBanner');
    const banner2 = document.getElementById('startBanner2');
    const banner3 = document.getElementById('startBanner3');
    const banner4 = document.getElementById('startBanner4');

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
    let animationFrameId = null;
    let puckResetTimeout = null;

    if (!gameContainer2 || !paddle || !computerPaddle || !puck || !playerScoreElement || !computerScoreElement || !levelElement || !gameOverScreen2 || !exitButton2) {
        console.error("Missing DOM elements for Game 2");
        return;
    }

    exitButton2.style.display = 'none';

    const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting && gameActive2) {
            endGame2();
        }
    }, { threshold: 0 });
    observer.observe(gameContainer2);

    banner2.addEventListener('click', () => {
        banner.classList.add('hidden');
        banner2.classList.add('hidden');
        banner3.classList.add('hidden');
        banner4.classList.add('hidden');
        gameContainer2.classList.remove('hidden');
        startGame2();
    });

    function stopGame2() {
        if (gameActive2) {
            endGame2();
            gameContainer2.classList.add('hidden');
        }
    }

    banner.addEventListener('click', stopGame2);
    banner3.addEventListener('click', stopGame2);
    banner4.addEventListener('click', stopGame2);

    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-section], a[href="#Main"], #mainNav, .nav-link');
        if (target && gameActive2 && !target.matches('[data-section="Minigames"], #banner2')) {
            stopGame2();
        }
    });

    const handleMouseMove = (e) => {
        if (!gameActive2) return;
        const rect = gameContainer2.getBoundingClientRect();
        paddleX = e.clientX - rect.left - paddle.offsetWidth / 2;
        paddleX = Math.max(0, Math.min(paddleX, gameContainer2.offsetWidth - paddle.offsetWidth));
        paddle.style.transform = `translateX(${paddleX}px)`;
    };

    const handleTouchMove = (e) => {
        if (!gameActive2) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = gameContainer2.getBoundingClientRect();
        paddleX = touch.clientX - rect.left - paddle.offsetWidth / 2;
        paddleX = Math.max(0, Math.min(paddleX, gameContainer2.offsetWidth - paddle.offsetWidth));
        paddle.style.transform = `translateX(${paddleX}px)`;
    };

    gameContainer2.addEventListener('mousemove', handleMouseMove);
    gameContainer2.addEventListener('touchstart', handleTouchMove);
    gameContainer2.addEventListener('touchmove', handleTouchMove);

    exitButton2.addEventListener('click', (e) => {
        e.stopPropagation();
        endGame2();
        gameContainer2.classList.add('hidden');
        banner.classList.remove('hidden');
        banner2.classList.remove('hidden');
        banner3.classList.remove('hidden');
        banner4.classList.remove('hidden');
        gameOverScreen2.classList.add('hidden');
        gameOverScreen2.style.display = 'none';
        exitButton2.style.display = 'none';
    });

    function startGame2() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (puckResetTimeout) clearTimeout(puckResetTimeout);

        gameActive2 = true;
        playerScore = 0;
        computerScore = 0;
        level = 1;
        playerScoreElement.textContent = playerScore;
        computerScoreElement.textContent = computerScore;
        levelElement.textContent = level;
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

        gameOverScreen2.classList.add('hidden');
        gameOverScreen2.style.display = 'none';
        exitButton2.style.display = 'none';
        lastTime = performance.now();

        paddle.classList.toggle('paddle2', isPaddle2Active);
        paddle.classList.toggle('paddle', !isPaddle2Active);

        puck.style.transform = `translate(${puckX}px, ${puckY}px)`;
        puck.classList.remove('blinking');
        paddle.style.transform = `translateX(${paddleX}px)`;
        computerPaddle.style.transform = `translateX(${computerPaddleX}px)`;

        gameLoop2();
    }

    function gameLoop2(timestamp) {
        if (!gameActive2 || window.getComputedStyle(gameContainer2).display === 'none') {
            endGame2();
            return;
        }

        const currentTime = timestamp || performance.now();
        const deltaTime = (currentTime - lastTime) / 16.67;
        lastTime = currentTime;

        timeSinceLastGoal++;
        if (timeSinceLastGoal % 300 === 0) {
            speedMultiplier = Math.min(speedMultiplier + 0.015, 1.5);
        }

        puckX += puckSpeedX * (1 + level * 0.05) * speedMultiplier * deltaTime;
        puckY += puckSpeedY * (1 + level * 0.05) * speedMultiplier * deltaTime;
        puck.style.transform = `translate(${puckX}px, ${puckY}px)`;

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
            if (gameActive2 && window.getComputedStyle(gameContainer2).display !== 'none') {
                playerScore++;
                level = Math.min(level + 1, 10);
                totalCoins += coinsPerPoint;
                updateScore(totalCoins);
                playerScoreElement.textContent = playerScore;
                levelElement.textContent = level;
            }
            resetPuck();
            timeSinceLastGoal = 0;
            speedMultiplier = 1;
        } else if (puckY >= gameContainer2.offsetHeight - puck.offsetHeight) {
            if (gameActive2 && window.getComputedStyle(gameContainer2).display !== 'none') {
                computerScore++;
                computerScoreElement.textContent = computerScore;
            }
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

        computerPaddleX = Math.max(0, Math.min(computerPaddleX, gameContainer2.offsetWidth - computerPaddle.offsetWidth));
        computerPaddle.style.transform = `translateX(${computerPaddleX}px)`;

        if (computerScore >= 3) {
            endGame2();
        }

        animationFrameId = requestAnimationFrame(gameLoop2);
    }

    function resetPuck() {
        puckX = gameContainer2.offsetWidth / 2 - 15;
        puckY = gameContainer2.offsetHeight / 2 - 30;
        puckSpeedX = 0;
        puckSpeedY = 0;
        lastPaddleHit = null;
        puck.style.transform = `translate(${puckX}px, ${puckY}px)`;
        puck.classList.add('blinking');

        if (puckResetTimeout) clearTimeout(puckResetTimeout);
        puckResetTimeout = setTimeout(() => {
            if (!gameActive2 || window.getComputedStyle(gameContainer2).display === 'none') return;
            puckSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1) * (1 + level * 0.05);
            puckSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1) * (1 + level * 0.05);
            puck.classList.remove('blinking');
        }, 500);
    }

    function endGame2() {
        gameActive2 = false;
        puckSpeedX = 0;
        puckSpeedY = 0;
        timeSinceLastGoal = 0;
        speedMultiplier = 1;
        playerScore = 0;
        computerScore = 0;
        level = 1;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        if (puckResetTimeout) {
            clearTimeout(puckResetTimeout);
            puckResetTimeout = null;
        }
        puck.classList.remove('blinking');
        finalPlayerScore.textContent = playerScore;
        finalComputerScore.textContent = computerScore;
        finalLevel.textContent = level;

        gameOverScreen2.classList.remove('hidden');
        gameOverScreen2.style.display = 'block';
        exitButton2.style.display = 'block';
        minigamesPlayed++;
    }
}

// Игра 3: Битва с боссами
function setupGame3() {
    const gameContainer3 = document.getElementById('gameContainer3');
    const scoreElement3 = document.getElementById('scoreValue3');
    const bossHealthElement = document.getElementById('bossHealthValue');
    const gameOverScreen3 = document.getElementById('gameOver3');
    const finalScoreElement3 = document.getElementById('finalScore3');
    const gameOverMessage3 = document.getElementById('gameOverMessage3');
    const exitButton3 = document.getElementById('exitButton3');
    const boss = document.getElementById('boss');
    const cannon = document.getElementById('cannon');
    const cannon2 = document.getElementById('cannon2');
    const banner = document.getElementById('startBanner');
    const banner2 = document.getElementById('startBanner2');
    const banner3 = document.getElementById('startBanner3');
    const banner4 = document.getElementById('startBanner4');

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
    let autoShootInterval = null;
    let bossDirectionChangeInterval = null;
    let bossBulletTimeout = null;
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
    let currentCannon = cannon;
    let animationFrameId = null;

    function isPointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
        const d = (by - cy) * (ax - cx) + (cy - ay) * (bx - cx);
        const alpha = ((by - cy) * (px - cx) + (cy - py) * (bx - cx)) / d;
        const beta = ((cy - ay) * (px - cx) + (py - ay) * (cx - bx)) / d;
        const gamma = SMOOTHING - alpha - beta;
        return alpha >= 0 && beta >= 0 && gamma >= 0;
    }

    if (!gameContainer3 || !scoreElement3 || !bossHealthElement || !gameOverScreen3 || !finalScoreElement3 || !gameOverMessage3 || !exitButton3 || !boss || !cannon || !cannon2) {
        console.error("Missing DOM elements for Game 3");
        return;
    }

    gameOverScreen3.classList.add('hidden');
    cannon2.style.display = 'none';
    exitButton3.style.display = 'none';

    const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting && gameActive3) {
            stopGame3();
        }
    }, { threshold: 0 });
    observer.observe(gameContainer3);

    function stopGame3() {
        if (gameActive3) {
            endGame3(false);
            gameContainer3.classList.add('hidden');
            banner.classList.remove('hidden');
            banner2.classList.remove('hidden');
            banner3.classList.remove('hidden');
            banner4.classList.remove('hidden');
        }
    }

    banner3.addEventListener('click', () => {
        banner.classList.add('hidden');
        banner2.classList.add('hidden');
        banner3.classList.add('hidden');
        banner4.classList.add('hidden');
        gameContainer3.classList.remove('hidden');
        startGame3();
    });

    banner.addEventListener('click', stopGame3);
    banner2.addEventListener('click', stopGame3);
    banner4.addEventListener('click', stopGame3);

    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-section], a[href="#Main"], #mainNav, .nav-link');
        if (target && gameActive3 && !target.matches('[data-section="Minigames"], #banner3')) {
            stopGame3();
        }
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
        cannonPosition = Math.max(0, Math.min(cannonPosition, gameContainer3.offsetWidth - currentCannon.offsetWidth));
        currentCannon.style.left = `${cannonPosition}px`;
    }

    function startGame3() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (autoShootInterval) clearInterval(autoShootInterval);
        if (bossDirectionChangeInterval) clearInterval(bossDirectionChangeInterval);
        if (bossBulletTimeout) clearTimeout(bossBulletTimeout);

        gameActive3 = true;
        score3 = 0;
        bossHealth = 100;
        currentBoss = 1;
        cannonPosition = window.innerWidth / 2 - 50;
        bossPosition = window.innerWidth / 2 - 75;
        bossDirection = 1;
        bossSpeed = 2;
        playerBullets = [];
        bossBullets = [];
        clones.forEach(clone => clone.element.remove());
        clones = [];
        canShoot = true;
        boss4Pause = false;
        boss4PauseTimer = 0;
        boss4Speed = 2;
        boss4BulletTimer = 0;
        boss5TeleportTimer = 0;
        boss5Angle = 0;
        boss6WaveTimer = 0;
        boss6SineOffset = 0;
        boss6FastBulletTimer = 0;
        boss7CloneTimer = 300;
        boss7BulletSpeed = 1.5;

        scoreElement3.textContent = score3;
        bossHealthElement.textContent = bossHealth;
        gameOverScreen3.classList.add('hidden');
        exitButton3.style.display = 'none';

        currentCannon = isCannon2Active ? cannon2 : cannon;
        cannon.style.display = isCannon2Active ? 'none' : 'block';
        cannon2.style.display = isCannon2Active ? 'block' : 'none';
        currentCannon.style.left = `${cannonPosition}px`;

        boss.style.left = `${bossPosition}px`;
        boss.style.top = '50px';
        gameContainer3.style.backgroundImage = `url('brawl_clicker-master/static/images/plat.png')`;
        boss.classList.remove('boss2', 'boss3', 'boss4', 'boss5', 'boss6', 'boss7', 'hit');
        boss.classList.add('boss1');

        spawnBossBullets();
        gameLoop3();

        autoShootInterval = setInterval(() => {
            if (gameActive3 && canShoot && window.getComputedStyle(gameContainer3).display !== 'none') {
                shootPlayerBullet();
                canShoot = false;
                setTimeout(() => (canShoot = true), 300);
            }
        }, 300);
    }

    function shootPlayerBullet() {
        const bullet = document.createElement('div');
        bullet.classList.add(currentCannon === cannon ? 'player-bullet' : 'player-bullet2');
        bullet.style.left = `${cannonPosition + currentCannon.offsetWidth / 2 - 14}px`;
        bullet.style.bottom = `${currentCannon.offsetHeight + 50}px`;
        gameContainer3.appendChild(bullet);
        playerBullets.push(bullet);
    }

    function spawnBossBullets() {
        if (!gameActive3 || window.getComputedStyle(gameContainer3).display === 'none') return;

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

        if (bossBulletTimeout) clearTimeout(bossBulletTimeout);
        bossBulletTimeout = setTimeout(spawnBossBullets,
            currentBoss === 1 ? 1500 :
            currentBoss === 2 ? 1800 :
            currentBoss === 3 ? 1300 :
            currentBoss === 4 ? 1500 :
            currentBoss === 5 ? 2000 :
            currentBoss === 6 ? 1500 :
            4000);
    }

    function gameLoop3() {
        if (!gameActive3 || window.getComputedStyle(gameContainer3).display === 'none') {
            stopGame3();
            return;
        }

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
            bossPosition = Math.max(0, Math.min(bossPosition, gameContainer3.offsetWidth - boss.offsetWidth));
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
            bossPosition = Math.max(0, Math.min(bossPosition, gameContainer3.offsetWidth - boss.offsetWidth));
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
                const damage = bullet.classList.contains('player-bullet2') ? 25 : 15;
                bossHealth -= damage;
                score3 += 1;
                if (gameActive3 && window.getComputedStyle(gameContainer3).display !== 'none') {
                    totalCoins += coinsPerPoint;
                    updateScore(totalCoins);
                }
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
                        gameContainer3.style.backgroundImage = `url('brawl_clicker-master/static/images/dark.png')`;
                        boss.classList.remove('boss1');
                        boss.classList.add('boss2');
                    } else if (currentBoss === 2) {
                        bossBullets.forEach(bullet => bullet.remove());
                        bossBullets = [];
                        currentBoss = 3;
                        bossHealth = 200;
                        bossHealthElement.textContent = bossHealth;
                        gameContainer3.style.backgroundImage = `url('brawl_clicker-master/static/images/ice.png')`;
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
                        gameContainer3.style.backgroundImage = `url('brawl_clicker-master/static/images/rude.png')`;
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
                        gameContainer3.style.backgroundImage = `url('brawl_clicker-master/static/images/poison.png')`;
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
                        gameContainer3.style.backgroundImage = `url('brawl_clicker-master/static/images/pirate.png')`;
                        boss.classList.remove('boss5');
                        boss.classList.add('boss6');
                        boss6WaveTimer = 0;
                        boss6FastBulletTimer = 0;
                        boss6SineOffset = 0;
                    } else if (currentBoss === 6) {
                        bossBullets.forEach(bullet => bullet.remove());
                        bossBullets = [];
                        currentBoss = 7;
                        bossHealth = 400;
                        bossSpeed = 3;
                        bossHealthElement.textContent = bossHealth;
                        gameContainer3.style.backgroundImage = `url('brawl_clicker-master/static/images/ad.png')`;
                        boss.classList.remove('boss6');
                        boss.classList.add('boss7');
                        boss7CloneTimer = 300;
                        boss7BulletSpeed = 1.5;
                    } else if (currentBoss === 7) {
                        endGame3(true);
                    }
                }
            }

            if (bulletTop > gameContainer3.offsetHeight) {
                bullet.remove();
                playerBullets.splice(index, 1);
            }
        });

        bossBullets.forEach((bullet, index) => {
            let bulletTop = parseFloat(bullet.style.top) || 0;
            let bulletLeft = parseFloat(bullet.style.left) || 0;

            if (bullet.classList.contains('boss1-bullet') || bullet.classList.contains('boss4-bullet')) {
                bulletTop += 3;
                bullet.style.top = `${bulletTop}px`;
            } else if (bullet.classList.contains('boss2-bullet')) {
                const angle = parseFloat(bullet.dataset.angle) || 0;
                const rad = angle * Math.PI / 180;
                bulletTop += 3 * Math.cos(rad);
                bulletLeft += 3 * Math.sin(rad);
                bullet.style.top = `${bulletTop}px`;
                bullet.style.left = `${bulletLeft}px`;
            } else if (bullet.classList.contains('boss3-bullet')) {
                bulletTop += parseFloat(bullet.dataset.dy) || 2;
                bulletLeft += parseFloat(bullet.dataset.dx) || 0;
                bullet.style.top = `${bulletTop}px`;
                bullet.style.left = `${bulletLeft}px`;
            } else if (bullet.classList.contains('boss5-beam')) {
                const angle = parseFloat(bullet.dataset.angle) || 0;
                const speed = parseFloat(bullet.dataset.speed) || 2.5;
                const rad = angle * Math.PI / 180;
                bulletTop += speed * Math.cos(rad);
                bulletLeft += speed * Math.sin(rad);
                bullet.style.top = `${bulletTop}px`;
                bullet.style.left = `${bulletLeft}px`;
            } else if (bullet.classList.contains('boss6-bullet')) {
                const angle = parseFloat(bullet.dataset.angle) || 0;
                const rad = angle * Math.PI / 180;
                bulletTop += 2 * Math.cos(rad);
                bulletLeft += 2 * Math.sin(rad);
                bullet.style.top = `${bulletTop}px`;
                bullet.style.left = `${bulletLeft}px`;
            } else if (bullet.classList.contains('boss6-fast-bullet')) {
                const angle = parseFloat(bullet.dataset.angle) || 0;
                const rad = angle * Math.PI / 180;
                bulletTop += 4 * Math.cos(rad);
                bulletLeft += 4 * Math.sin(rad);
                bullet.style.top = `${bulletTop}px`;
                bullet.style.left = `${bulletLeft}px`;
            } else if (bullet.classList.contains('boss6-wave')) {
                let radius = parseFloat(bullet.dataset.radius) || 0;
                radius += 2;
                bullet.style.width = `${radius}px`;
                bullet.style.height = `${radius}px`;
                bullet.style.left = `${bulletLeft - radius / 2}px`;
                bullet.style.top = `${bulletTop - radius / 2}px`;
                bullet.dataset.radius = radius;
            } else if (bullet.classList.contains('boss7-bullet') || bullet.classList.contains('boss7-clone-bullet')) {
                bulletTop += parseFloat(bullet.dataset.dy) || 0.8;
                bulletLeft += parseFloat(bullet.dataset.dx) || 0;
                bullet.style.top = `${bulletTop}px`;
                bullet.style.left = `${bulletLeft}px`;
            }

            const bulletRect = bullet.getBoundingClientRect();
            const cannonRect = currentCannon.getBoundingClientRect();

            if (
                bulletRect.bottom >= cannonRect.top &&
                bulletRect.top <= cannonRect.bottom &&
                bulletRect.right >= cannonRect.left &&
                bulletRect.left <= cannonRect.right
            ) {
                bullet.remove();
                bossBullets.splice(index, 1);
                endGame3(false);
            }

            if (
                bulletTop > gameContainer3.offsetHeight ||
                bulletLeft < 0 ||
                bulletLeft > gameContainer3.offsetWidth ||
                (bullet.classList.contains('boss6-wave') && parseFloat(bullet.dataset.radius) > 300)
            ) {
                bullet.remove();
                bossBullets.splice(index, 1);
            }
        });

        clones.forEach((clone, index) => {
            const bulletRect = playerBullets.map(bullet => bullet.getBoundingClientRect());
            const cloneRect = clone.element.getBoundingClientRect();

            bulletRect.forEach((bullet, bulletIndex) => {
                if (
                    bullet.bottom >= cloneRect.top &&
                    bullet.top <= cloneRect.bottom &&
                    bullet.right >= cloneRect.left &&
                    bullet.left <= cloneRect.right
                ) {
                    const damage = playerBullets[bulletIndex].classList.contains('player-bullet2') ? 25 : 15;
                    clone.hp -= damage;
                    playerBullets[bulletIndex].remove();
                    playerBullets.splice(bulletIndex, 1);
                    if (clone.hp <= 0) {
                        clone.element.remove();
                        clones.splice(index, 1);
                    }
                }
            });
        });

        animationFrameId = requestAnimationFrame(gameLoop3);
    }

    function endGame3(victory) {
        gameActive3 = false;
        playerBullets.forEach(bullet => bullet.remove());
        bossBullets.forEach(bullet => bullet.remove());
        clones.forEach(clone => clone.element.remove());
        playerBullets = [];
        bossBullets = [];
        clones = [];
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (autoShootInterval) clearInterval(autoShootInterval);
        if (bossDirectionChangeInterval) clearInterval(bossDirectionChangeInterval);
        if (bossBulletTimeout) clearTimeout(bossBulletTimeout);

        gameOverMessage3.textContent = victory ? 'Победа!' : 'Поражение!';
        finalScoreElement3.textContent = score3;
        gameOverScreen3.classList.remove('hidden');
        exitButton3.style.display = 'block';
        minigamesPlayed++;

        exitButton3.addEventListener('click', () => {
            gameContainer3.classList.add('hidden');
            banner.classList.remove('hidden');
            banner2.classList.remove('hidden');
            banner3.classList.remove('hidden');
            banner4.classList.remove('hidden');
            gameOverScreen3.classList.add('hidden');
            exitButton3.style.display = 'none';
        }, { once: true });
    }
}

function setupShop() {
    const characters = document.querySelectorAll('.character');
    const preview = document.getElementById('preview');
    const previewImg = preview ? preview.querySelector('img') : null;
    const selectButton = document.getElementById('select-button');
    const clickButton = document.getElementById('clickButton');
    const shopBox = document.querySelector('.shop_box');
    const overlayBox1 = document.querySelector('.overlay_box1');
    const containerBox1 = document.querySelector('.container_box_1');
    const containerBox11 = document.querySelector('.container_box_11');
    const closeButtonBox1 = document.querySelector('.close-button_box1');
    const closeRewardButton = document.querySelector('.close-reward-button');
    const upgradeButtonBox1 = document.querySelector('.upgrade-button_box1');
    const rewardImage = document.getElementById('rewardImage');

    // Проверка наличия всех необходимых элементов
    if (!characters.length || !preview || !previewImg || !selectButton || !clickButton || !shopBox || !overlayBox1 || !containerBox1 || !containerBox11 || !closeButtonBox1 || !closeRewardButton || !upgradeButtonBox1 || !rewardImage) {
        console.error("Missing DOM elements for shop");
        return;
    }

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
        { id: "15", img: "brawl_clicker-master/static/images/minion.png", name: "Character 15" }
    ];

    function unlockCharacter(characterId) {
        const character = document.querySelector(`.character[data-id="${characterId}"]`);
        if (character) {
            character.classList.remove('locked');
            character.removeAttribute('data-locked');
        }
    }

    let currentPreviewCharacter = null;
    let selectedCharacter = null;

    // Открытие магазина
    shopBox.addEventListener('click', () => {
        overlayBox1.style.display = 'block';
        containerBox1.style.display = 'block';
    });

    // Закрытие магазина
    closeButtonBox1.addEventListener('click', () => {
        overlayBox1.style.display = 'none';
        containerBox1.style.display = 'none';
    });

    overlayBox1.addEventListener('click', () => {
        overlayBox1.style.display = 'none';
        containerBox1.style.display = 'none';
    });

    // Открытие сундука
    upgradeButtonBox1.addEventListener('click', () => {
        containerBox1.style.display = 'none';
        const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
        containerBox11.style.display = 'block';
        rewardImage.src = randomHero.img;
        rewardImage.alt = 'Выпавший герой';
        unlockCharacter(randomHero.id);
    });

    // Закрытие окна с наградой
    closeRewardButton.addEventListener('click', () => {
        overlayBox1.style.display = 'none';
        containerBox11.style.display = 'none';
    });

    // Выбор персонажа
    characters.forEach(character => {
        character.addEventListener('click', () => {
            const imgSrc = character.getAttribute('data-img');
            if (!imgSrc) {
                console.warn("Character is missing 'data-img' attribute:", character);
                return;
            }

            previewImg.src = imgSrc;

            if (currentPreviewCharacter) {
                currentPreviewCharacter.classList.remove('selected-preview');
            }

            character.classList.add('selected-preview');
            currentPreviewCharacter = character;
        });
    });

    // Подтверждение выбора персонажа
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
        if (selectedCharacter) {
            selectedCharacter.classList.remove('selected');
        }

        currentPreviewCharacter.classList.add('selected');
        selectedCharacter = currentPreviewCharacter;
        clickButton.src = imgSrc;

        // Сброс preview
        currentPreviewCharacter.classList.remove('selected-preview');
        currentPreviewCharacter = null;
        previewImg.src = ''; // Очистка предпросмотра
    });
}
// Основная игра (кликер)
function setupClicker() {
    const clickButton = document.getElementById('clickButton');
    const currentScoreElement = document.querySelector('.currentScore');
    const progressBar = document.querySelector('#progressBar');
    const progressLabel = document.querySelector('#progressLabel');
    const energyDisplay = document.querySelector('#energyDisplay');
    const coinContainer = document.querySelector('#coinContainer');
    const conditionsModal = document.getElementById('conditionsModal');
    const closeModal = document.getElementById('closeModal');

    let progress = 0;
    const maxProgress = 100;
    let leagueLevel = 0;
    let clicksPerLevel = 10;
    const energyCost = 10;

    function updateConditionsDisplay() {
        const coins = parseInt(currentScoreElement.innerText) || 0;
        document.getElementById('coinsCondition').innerHTML = `Набрать 1000 монет: <span>${coins}/1000</span>`;
        document.getElementById('minigamesCondition').innerHTML = `Сыграть в мини-игры 5 раз: <span>${minigamesPlayed}/5</span>`;
        document.getElementById('telegramCondition').innerHTML = `Подписаться на Telegram: ${isSubscribedToTelegram ? 'Выполнено' : '<button id="subscribeButton">Подписаться</button>'}`;
        if (!isSubscribedToTelegram) {
            document.getElementById('subscribeButton').addEventListener('click', () => {
                window.open('https://t.me/heroes_coin', '_blank');
                isSubscribedToTelegram = true;
                updateConditionsDisplay();
            });
        }
    }

    function showConditionsModal() {
        updateConditionsDisplay();
        conditionsModal.style.display = 'flex';
    }

    closeModal.addEventListener('click', () => {
        conditionsModal.style.display = 'none';
    });

    function recoverEnergy() {
        energy = Math.min(energy + energyRecoveryRate / 10, maxEnergy);
        energyDisplay.textContent = `${Math.round(energy)}/${maxEnergy}`;
    }

    setInterval(recoverEnergy, 50);

function handleTap(event) {
    const currentScoreElement = document.querySelector('.currentScore');
    const progressBar = document.querySelector('#progressBar');
    const energyDisplay = document.querySelector('#energyDisplay');

    if (!currentScoreElement || !progressBar || !energyDisplay) {
        console.error("Missing DOM elements in handleTap");
        return;
    }

    const energyCost = 10;
    const maxProgress = 100;
    const clicksPerLevel = 10; // Должно соответствовать значению из setupClicker

    if (energy >= energyCost) {
        let score = parseInt(currentScoreElement.innerText) || 0;
        score += coinsPerClick;
        updateScore(score);

        const progressIncrement = (maxProgress / clicksPerLevel) * coinsPerClick;
        progress = Math.min(progress + progressIncrement, maxProgress);
        progressBar.style.width = `${progress}%`;

        energy = Math.max(energy - energyCost, 0);
        energyDisplay.textContent = `${Math.round(energy)}/${maxEnergy}`;

        const selectedCharacter = document.querySelector('.character.selected')?.getAttribute('data-id') || "1"; // Эффект по умолчанию
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
        }
    }

    function updateLeague() {
        leagueLevel++;
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
                backgroundImage = 'brawl_clicker-master/static/images/poison.png';
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
        } else if (backgroundImage === 'brawl_clicker-master/static/images/poison.png') {
            body.style.backgroundPosition = 'center calc(50% - 9vh)';
        } else if (backgroundImage === 'brawl_clicker-master/static/images/dark_2.png') {
            body.style.backgroundPosition = 'center calc(50% - 10vh)';
        } else if (backgroundImage === 'brawl_clicker-master/static/images/plat.png') {
            body.style.backgroundPosition = 'center calc(50% - 7vh)';
        } else if (backgroundImage === 'brawl_clicker-master/static/images/dark.png') {
            body.style.backgroundPosition = 'center calc(50% - 10vh)';
        } else {
            body.style.backgroundPosition = 'center';
        }
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

    // Используем эффект по умолчанию, если персонаж не выбран или не существует
    const effectFn = effects[selectedCharacter] || spawnCoinDrop;
    effectFn(event);
}

    function spawnCoinDrop(event) {
        const coin = document.createElement('div');
        coin.classList.add('coin_drop');
        coin.style.left = `${event.clientX - 20}px`;
        coin.style.top = `${event.clientY - 20}px`;
        coinContainer.appendChild(coin);
        coin.addEventListener('animationend', () => coin.remove());
    }

    function createGhostEffect(event) {
        const ghost = document.createElement('div');
        ghost.classList.add('ghost-effect');
        ghost.style.left = `${event.clientX - 25}px`;
        ghost.style.top = `${event.clientY - 25}px`;
        document.body.appendChild(ghost);
        setTimeout(() => ghost.remove(), 1000);
    }

    function createLeafEffect(event) {
        const leaf = document.createElement('div');
        leaf.classList.add('leaf-effect');
        leaf.style.left = `${event.clientX - 25}px`;
        leaf.style.top = `${event.clientY - 25}px`;
        document.body.appendChild(leaf);
        setTimeout(() => leaf.remove(), 1000);
    }

    function createStoneEffect(event) {
        const stone = document.createElement('div');
        stone.classList.add('stone-effect');
        stone.style.left = `${event.clientX - 25}px`;
        stone.style.top = `${event.clientY - 25}px`;
        document.body.appendChild(stone);
        setTimeout(() => stone.remove(), 1000);
    }

    function createFireEffect(event) {
        const fire = document.createElement('div');
        fire.classList.add('fire-effect');
        fire.style.left = `${event.clientX - 25}px`;
        fire.style.top = `${event.clientY - 25}px`;
        document.body.appendChild(fire);
        setTimeout(() => fire.remove(), 1000);
    }

function createWaterEffect(event) {
    const water = document.createElement('div');
    water.classList.add('water-effect');
    water.style.left = `${event.clientX - 25}px`;
    water.style.top = `${event.clientY - 25}px`;
    document.body.appendChild(water);
    setTimeout(() => water.remove(), 1000);
}

function createGodEffect(event) {
    const god = document.createElement('div');
    god.classList.add('god-effect');
    god.style.left = `${event.clientX - 25}px`;
    god.style.top = `${event.clientY - 25}px`;
    document.body.appendChild(god);
    setTimeout(() => god.remove(), 1000);
}

function createMagicEffect(event) {
    const magic = document.createElement('div');
    magic.classList.add('magic-effect');
    magic.style.left = `${event.clientX - 25}px`;
    magic.style.top = `${event.clientY - 25}px`;
    document.body.appendChild(magic);
    setTimeout(() => magic.remove(), 1000);
}

function createHeartEffect(event) {
    const heart = document.createElement('div');
    heart.classList.add('heart-effect');
    heart.style.left = `${event.clientX - 25}px`;
    heart.style.top = `${event.clientY - 25}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
}

function createAnanasEffect(event) {
    const ananas = document.createElement('div');
    ananas.classList.add('ananas-effect');
    ananas.style.left = `${event.clientX - 25}px`;
    ananas.style.top = `${event.clientY - 25}px`;
    document.body.appendChild(ananas);
    setTimeout(() => ananas.remove(), 1000);
}

function createFrogEffect(event) {
    const frog = document.createElement('div');
    frog.classList.add('frog-effect');
    frog.style.left = `${event.clientX - 25}px`;
    frog.style.top = `${event.clientY - 25}px`;
    document.body.appendChild(frog);
    setTimeout(() => frog.remove(), 1000);
}

function createRedEffect(event) {
    const red = document.createElement('div');
    red.classList.add('red-effect');
    red.style.left = `${event.clientX - 25}px`;
    red.style.top = `${event.clientY - 25}px`;
    document.body.appendChild(red);
    setTimeout(() => red.remove(), 1000);
}

function createDarkEffect(event) {
    const dark = document.createElement('div');
    dark.classList.add('dark-effect');
    dark.style.left = `${event.clientX - 25}px`;
    dark.style.top = `${event.clientY - 25}px`;
    document.body.appendChild(dark);
    setTimeout(() => dark.remove(), 1000);
}

function createFishEffect(event) {
    const fish = document.createElement('div');
    fish.classList.add('fish-effect');
    fish.style.left = `${event.clientX - 25}px`;
    fish.style.top = `${event.clientY - 25}px`;
    document.body.appendChild(fish);
    setTimeout(() => fish.remove(), 1000);
}

function createMinionEffect(event) {
    const minion = document.createElement('div');
    minion.classList.add('minion-effect');
    minion.style.left = `${event.clientX - 25}px`;
    minion.style.top = `${event.clientY - 25}px`;
    document.body.appendChild(minion);
    setTimeout(() => minion.remove(), 1000);
}

// Обработчик кликов и тапов
clickButton.addEventListener('click', handleTap);
clickButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleTap(e);
});

function initializeGame() {
    // Проверка, что DOM полностью загружен
    if (document.readyState === 'complete') {
        setupClicker();
        setupShop();
        setupGame1();
        setupGame2();
        setupGame3();
        setupUpgrades();
        updateScore(totalCoins);
        updateEnergyDisplay();
    } else {
        console.warn("DOM not fully loaded, retrying initialization...");
        setTimeout(initializeGame, 100);
    }
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});
// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeGame);