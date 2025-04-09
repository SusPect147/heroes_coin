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
                totalCoins += window.coinsPerPoint;
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

    // Игра 2: Аэрохоккей против компьютера
    const gameContainer2 = document.getElementById('gameContainer2');
    const playerPaddle = document.getElementById('playerPaddle');
    const computerPaddle = document.getElementById('computerPaddle');
    const puck = document.getElementById('puck');
    const playerScoreElement = document.getElementById('playerScore');
    const computerScoreElement = document.getElementById('computerScore');
    const gameOverScreen2 = document.getElementById('gameOver2');
    const finalScoreElement2 = document.getElementById('finalScore2');
    const exitButton2 = document.getElementById('exitButton2');

    let gameActive2 = false;
    let playerScore2 = 0;
    let computerScore2 = 0;
    let puckPosition = { x: 0, y: 0 };
    let puckVelocity = { x: 0, y: 0 };
    let playerPaddlePosition = { x: 0 };
    let computerPaddlePosition = { x: 0 };
    let isDraggingPaddle = false;

    // Проверка на существование элементов
    if (!gameContainer2 || !playerPaddle || !computerPaddle || !puck || !playerScoreElement || !computerScoreElement || !gameOverScreen2 || !finalScoreElement2 || !exitButton2) {
        console.error("One or more DOM elements for Game 2 are missing. Please check your HTML.");
        return;
    }

    gameOverScreen2.classList.add('hidden');

    banner2.addEventListener('click', () => {
        banner.classList.add('hidden');
        banner2.classList.add('hidden');
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

    // Управление мышью
    gameContainer2.addEventListener('mousedown', (e) => {
        if (!gameActive2) return;
        isDraggingPaddle = true;
        movePlayerPaddle(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
        if (!gameActive2 || !isDraggingPaddle) return;
        movePlayerPaddle(e.clientX);
    });

    document.addEventListener('mouseup', () => {
        isDraggingPaddle = false;
    });

    // Управление сенсорным экраном
    gameContainer2.addEventListener('touchstart', (e) => {
        if (!gameActive2) return;
        e.preventDefault();
        isDraggingPaddle = true;
        movePlayerPaddle(e.touches[0].clientX);
    });

    gameContainer2.addEventListener('touchmove', (e) => {
        if (!gameActive2 || !isDraggingPaddle) return;
        e.preventDefault();
        movePlayerPaddle(e.touches[0].clientX);
    });

    gameContainer2.addEventListener('touchend', () => {
        isDraggingPaddle = false;
    });

    function movePlayerPaddle(clientX) {
        const rect = gameContainer2.getBoundingClientRect();
        playerPaddlePosition.x = clientX - rect.left - playerPaddle.offsetWidth / 2;
        if (playerPaddlePosition.x < 0) playerPaddlePosition.x = 0;
        if (playerPaddlePosition.x > gameContainer2.offsetWidth - playerPaddle.offsetWidth) {
            playerPaddlePosition.x = gameContainer2.offsetWidth - playerPaddle.offsetWidth;
        }
        playerPaddle.style.left = `${playerPaddlePosition.x}px`;
    }

    function startGame2() {
        gameActive2 = true;
        playerScore2 = 0;
        computerScore2 = 0;
        playerScoreElement.textContent = playerScore2;
        computerScoreElement.textContent = computerScore2;
        gameOverScreen2.classList.add('hidden');

        // Начальная позиция шайбы
        puckPosition = {
            x: gameContainer2.offsetWidth / 2 - puck.offsetWidth / 2,
            y: gameContainer2.offsetHeight / 2 - puck.offsetHeight / 2
        };
        puckVelocity = {
            x: (Math.random() > 0.5 ? 1 : -1) * 3,
            y: (Math.random() > 0.5 ? 1 : -1) * 3
        };
        puck.style.left = `${puckPosition.x}px`;
        puck.style.top = `${puckPosition.y}px`;

        // Начальная позиция бит
        playerPaddlePosition.x = gameContainer2.offsetWidth / 2 - playerPaddle.offsetWidth / 2;
        computerPaddlePosition.x = gameContainer2.offsetWidth / 2 - computerPaddle.offsetWidth / 2;
        playerPaddle.style.left = `${playerPaddlePosition.x}px`;
        computerPaddle.style.left = `${computerPaddlePosition.x}px`;

        gameLoop2();
    }

    function gameLoop2() {
        if (!gameActive2) return;

        // Движение шайбы
        puckPosition.x += puckVelocity.x;
        puckPosition.y += puckVelocity.y;

        // Столкновение с боковыми стенками
        if (puckPosition.x <= 0 || puckPosition.x >= gameContainer2.offsetWidth - puck.offsetWidth) {
            puckVelocity.x *= -1;
            puckPosition.x = puckPosition.x <= 0 ? 0 : gameContainer2.offsetWidth - puck.offsetWidth;
        }

        // Проверка на гол
        if (puckPosition.y <= 0) {
            // Гол игрока (шайба зашла за верхнюю границу)
            playerScore2++;
            totalCoins += window.coinsPerPoint; // Начисляем монеты за гол
            currentScoreElement.textContent = totalCoins;
            localStorage.setItem('totalCoins', totalCoins);
            playerScoreElement.textContent = playerScore2;
            resetPuck();
        } else if (puckPosition.y >= gameContainer2.offsetHeight - puck.offsetHeight) {
            // Гол компьютера (шайба зашла за нижнюю границу)
            computerScore2++;
            computerScoreElement.textContent = computerScore2;
            resetPuck();
        }

        // Проверка на конец игры
        if (playerScore2 >= 5 || computerScore2 >= 5) {
            endGame2();
            return;
        }

        // Столкновение с битой игрока
        const puckRect = puck.getBoundingClientRect();
        const playerPaddleRect = playerPaddle.getBoundingClientRect();
        if (
            puckRect.bottom >= playerPaddleRect.top &&
            puckRect.top <= playerPaddleRect.bottom &&
            puckRect.right >= playerPaddleRect.left &&
            puckRect.left <= playerPaddleRect.right
        ) {
            puckVelocity.y = -Math.abs(puckVelocity.y);
            puckVelocity.x += (puckPosition.x - (playerPaddlePosition.x + playerPaddle.offsetWidth / 2)) * 0.1;
        }

        // Столкновение с битой компьютера
        const computerPaddleRect = computerPaddle.getBoundingClientRect();
        if (
            puckRect.bottom >= computerPaddleRect.top &&
            puckRect.top <= computerPaddleRect.bottom &&
            puckRect.right >= computerPaddleRect.left &&
            puckRect.left <= computerPaddleRect.right
        ) {
            puckVelocity.y = Math.abs(puckVelocity.y);
            puckVelocity.x += (puckPosition.x - (computerPaddlePosition.x + computerPaddle.offsetWidth / 2)) * 0.1;
        }

        // Движение биты компьютера (ИИ)
        const targetX = puckPosition.x - computerPaddle.offsetWidth / 2;
        computerPaddlePosition.x += (targetX - computerPaddlePosition.x) * 0.05; // Плавное движение
        if (computerPaddlePosition.x < 0) computerPaddlePosition.x = 0;
        if (computerPaddlePosition.x > gameContainer2.offsetWidth - computerPaddle.offsetWidth) {
            computerPaddlePosition.x = gameContainer2.offsetWidth - computerPaddle.offsetWidth;
        }
        computerPaddle.style.left = `${computerPaddlePosition.x}px`;

        // Обновление позиции шайбы
        puck.style.left = `${puckPosition.x}px`;
        puck.style.top = `${puckPosition.y}px`;

        requestAnimationFrame(gameLoop2);
    }

    function resetPuck() {
        puckPosition = {
            x: gameContainer2.offsetWidth / 2 - puck.offsetWidth / 2,
            y: gameContainer2.offsetHeight / 2 - puck.offsetHeight / 2
        };
        puckVelocity = {
            x: (Math.random() > 0.5 ? 1 : -1) * 3,
            y: (Math.random() > 0.5 ? 1 : -1) * 3
        };
        puck.style.left = `${puckPosition.x}px`;
        puck.style.top = `${puckPosition.y}px`;
    }

    function endGame2() {
        gameActive2 = false;
        finalScoreElement2.textContent = `${playerScore2} : ${computerScore2}`;
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