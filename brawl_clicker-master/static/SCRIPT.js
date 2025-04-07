const gameState = {
    totalCoins: 0,
    coinsPerClick: 1,
    energy: 100,
    maxEnergy: 100,
    energyRecoveryRate: 5,
    minigamesPlayed: 0,
    leagueLevel: 0,
    progress: 0,
    autoClickerLevel: 1,
    recoveryLevel: 1,
    energyLevel: 1,
    clicksPerLevel: 5,
    isSubscribedToTelegram: false
};

document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('startBanner');
    const banner2 = document.getElementById('startBanner2');
    const banner3 = document.getElementById('startBanner3');
    const currentScoreElement = document.querySelector('.currentScore');
    const gameContainer = document.getElementById('gameContainer');
    const bag = document.getElementById('bag');
    const scoreElement = document.getElementById('scoreValue');
    const gameOverScreen = document.getElementById('gameOver');
    const finalScoreElement = document.getElementById('finalScore');
    const exitButton = document.getElementById('exitButton');

    if (!gameContainer || !bag || !scoreElement || !gameOverScreen || !finalScoreElement || !exitButton || !currentScoreElement) {
        console.error("One or more DOM elements for Game 1 are missing.");
        return;
    }

    let score = 0;
    let gameActive = false;
    let bagPosition = window.innerWidth / 2 - 50;
    let coins = [];
    let coinSpeed = 2;
    let spawnInterval;
    let isDraggingBag = false;

    exitButton.style.display = 'none';
    currentScoreElement.textContent = gameState.totalCoins;

    banner.addEventListener('click', () => {
        banner.classList.add('hidden');
        banner2.classList.add('hidden');
        banner3.classList.add('hidden');
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
        clearTimeout(spawnInterval);
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
                gameState.totalCoins += gameState.coinsPerClick;
                currentScoreElement.textContent = gameState.totalCoins;
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
        gameState.minigamesPlayed++;
    }

    const gameContainer2 = document.getElementById('gameContainer2');
    const scoreElement2 = document.getElementById('scoreValue2');
    const missedElement = document.getElementById('missedValue2');
    const gameOverScreen2 = document.getElementById('gameOver2');
    const finalScoreElement2 = document.getElementById('finalScore2');
    const exitButton2 = document.getElementById('exitButton2');

    if (!gameContainer2 || !scoreElement2 || !missedElement || !gameOverScreen2 || !finalScoreElement2 || !exitButton2) {
        console.error("One or more DOM elements for Game 2 are missing.");
        return;
    }

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
        const circleCount = Math.min(2 + Math.floor(score2 / 15), 5);
        for (let i = 0; i < circleCount; i++) {
            spawnCircle();
        }
        clearTimeout(spawnInterval2);
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
        const navBarHeight = 40;
        const bottomMargin = 20;
        circle.style.width = `${circleSize}px`;
        circle.style.height = `${circleSize}px`;
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
            gameState.totalCoins += gameState.coinsPerClick;
            currentScoreElement.textContent = gameState.totalCoins;
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
        gameState.minigamesPlayed++;
    }

    const gameContainer3 = document.getElementById('gameContainer3');
    const scoreElement3 = document.getElementById('scoreValue3');
    const bossHealthElement = document.getElementById('bossHealthValue');
    const gameOverScreen3 = document.getElementById('gameOver3');
    const finalScoreElement3 = document.getElementById('finalScore3');
    const gameOverMessage3 = document.getElementById('gameOverMessage3');
    const exitButton3 = document.getElementById('exitButton3');
    const boss = document.getElementById('boss');
    const cannon = document.getElementById('cannon');

    if (!gameContainer3 || !scoreElement3 || !bossHealthElement || !gameOverScreen3 || !finalScoreElement3 || !gameOverMessage3 || !exitButton3 || !boss || !cannon) {
        console.error("One or more DOM elements for Game 3 are missing.");
        return;
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
        clearInterval(autoShootInterval);
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
                score3++;
                gameState.totalCoins += gameState.coinsPerClick;
                currentScoreElement.textContent = gameState.totalCoins;
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
                        clearInterval(bossDirectionChangeInterval);
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
                        gameState.totalCoins += 5;
                        currentScoreElement.textContent = gameState.totalCoins;
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
            gameState.totalCoins += 50;
            currentScoreElement.textContent = gameState.totalCoins;
        }
        gameState.minigamesPlayed++;
    }

    exitButton3.addEventListener('click', () => {
        gameContainer3.classList.add('hidden');
        banner.classList.remove('hidden');
        banner2.classList.remove('hidden');
        banner3.classList.remove('hidden');
    });

    const clickButton = document.getElementById('clickButton');
    const progressBar = document.querySelector('#progressBar');
    const progressLabel = document.querySelector('#progressLabel');
    const energyDisplay = document.querySelector('#energyDisplay');
    const coinContainer = document.querySelector('#coinContainer');
    const conditionsModal = document.getElementById('conditionsModal');
    const closeModal = document.getElementById('closeModal');
    const subscribeButton = document.getElementById('subscribeButton');

    if (!clickButton || !progressBar || !progressLabel || !energyDisplay || !coinContainer || !conditionsModal || !closeModal) {
        console.error("One or more DOM elements for main game are missing.");
        return;
    }

    const maxProgress = 100;
    const energyCost = 10;

    function updateScore(newScore) {
        gameState.totalCoins = newScore;
        document.querySelectorAll('.currentScore').forEach(element => element.textContent = newScore);
    }

    function updateConditionsDisplay() {
        document.getElementById('coinsCondition').innerHTML = `Набрать 1000 монет:<span>${gameState.totalCoins}/1000</span>`;
        document.getElementById('minigamesCondition').innerHTML = `Сыграть в мини-игры 5 раз:<span>${gameState.minigamesPlayed}/5</span>`;
        document.getElementById('telegramCondition').innerHTML = `Подписаться на Telegram:${
            gameState.isSubscribedToTelegram ? 'Выполнено' : '<button id="subscribeButton">Подписаться</button>'
        }`;
        if (!gameState.isSubscribedToTelegram && document.getElementById('subscribeButton')) {
            document.getElementById('subscribeButton').addEventListener('click', subscribeToTelegram);
        }
    }

    function subscribeToTelegram() {
        window.open('https://t.me/heroes_coin', '_blank');
        gameState.isSubscribedToTelegram = true;
        updateConditionsDisplay();
    }

    function showConditionsModal() {
        updateConditionsDisplay();
        conditionsModal.style.display = 'flex';
    }

    closeModal.addEventListener('click', () => {
        conditionsModal.style.display = 'none';
    });

    window.updateClickButtonImage = (imgSrc) => {
        const cleanSrc = imgSrc.includes('brawl_clicker-master/static/images/') ? imgSrc : `brawl_clicker-master/static/images/${imgSrc}`;
        clickButton.src = cleanSrc;
    };

    window.updateCoinsPerClick = (newCoinsPerClick) => {
        gameState.coinsPerClick = newCoinsPerClick;
        const coinsPerClickDisplay = document.getElementById('coinsPerClickDisplay');
        if (coinsPerClickDisplay) coinsPerClickDisplay.textContent = `Монет за клик:${gameState.coinsPerClick}`;
    };

    window.updateEnergyRecoveryRate = (newRate) => {
        gameState.energyRecoveryRate = newRate;
        const energyRecoveryRateDisplay = document.getElementById('energyRecoveryRateDisplay');
        if (energyRecoveryRateDisplay) energyRecoveryRateDisplay.textContent = `Скорость восстановления энергии:${newRate}`;
    };

    function recoverEnergy() {
        gameState.energy = Math.min(gameState.energy + gameState.energyRecoveryRate, gameState.maxEnergy);
        energyDisplay.textContent = `${Math.round(gameState.energy)}/${gameState.maxEnergy}`;
    }

    setInterval(recoverEnergy, 1000);

    function handleTap(event) {
        if (gameState.energy >= energyCost) {
            let score = gameState.totalCoins;
            score += gameState.coinsPerClick;
            updateScore(score);
            const progressIncrement = (maxProgress / gameState.clicksPerLevel) * gameState.coinsPerClick;
            gameState.progress = Math.min(gameState.progress + progressIncrement, maxProgress);
            progressBar.style.width = `${gameState.progress}%`;
            gameState.energy = Math.max(gameState.energy - energyCost, 0);
            energyDisplay.textContent = `${Math.round(gameState.energy)}/${gameState.maxEnergy}`;
            const selectedCharacter = "1"; // По умолчанию первый персонаж
            spawnEffect(selectedCharacter, event);
            if (gameState.progress === maxProgress) {
                checkAndUpdateLeague();
            }
        }
    }

    function checkAndUpdateLeague() {
        const coins = gameState.totalCoins;
        const conditionsMet = coins >= 1000 && gameState.minigamesPlayed >= 5 && gameState.isSubscribedToTelegram;
        if (gameState.leagueLevel === 0 && !conditionsMet) {
            showConditionsModal();
        } else {
            updateLeague();
            gameState.progress = 0;
            progressBar.style.width = '0%';
        }
    }

    window.incrementMinigamesPlayed = () => {
        gameState.minigamesPlayed++;
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

    function updateLeague() {
        gameState.leagueLevel++;
        setLeagueBackground(gameState.leagueLevel);
    }

    function setLeagueBackground(level) {
        const body = document.body;
        let backgroundImage = '';
        switch (level) {
            case 1:
                progressLabel.innerText = 'Ледяной мир';
                gameState.clicksPerLevel = 5;
                backgroundImage = 'brawl_clicker-master/static/images/ice.png';
                break;
            case 2:
                progressLabel.innerText = 'Адский мир';
                gameState.clicksPerLevel = 6;
                backgroundImage = 'brawl_clicker-master/static/images/ad.png';
                break;
            case 3:
                progressLabel.innerText = 'Китай';
                gameState.clicksPerLevel = 7;
                backgroundImage = 'brawl_clicker-master/static/images/china.png';
                break;
            case 4:
                progressLabel.innerText = 'Водный мир';
                gameState.clicksPerLevel = 8;
                backgroundImage = 'brawl_clicker-master/static/images/water_world.png';
                break;
            case 5:
                progressLabel.innerText = 'Мистика';
                gameState.clicksPerLevel = 8;
                backgroundImage = 'brawl_clicker-master/static/images/mystical.png';
                break;
            case 6:
                progressLabel.innerText = 'Кубический мир';
                gameState.clicksPerLevel = 10;
                backgroundImage = 'brawl_clicker-master/static/images/minecraft.png';
                break;
            case 7:
                progressLabel.innerText = 'Тьма';
                gameState.clicksPerLevel = 11;
                backgroundImage = 'brawl_clicker-master/static/images/dark.png';
                break;
            case 8:
                progressLabel.innerText = 'Космос';
                gameState.clicksPerLevel = 12;
                backgroundImage = 'brawl_clicker-master/static/images/cosmos.png';
                break;
            case 9:
                progressLabel.innerText = 'Темнота';
                gameState.clicksPerLevel = 13;
                backgroundImage = 'brawl_clicker-master/static/images/dark_2.png';
                break;
            case 10:
                progressLabel.innerText = 'НЛО';
                gameState.clicksPerLevel = 14;
                backgroundImage = 'brawl_clicker-master/static/images/plat.png';
                break;
            default:
                progressLabel.innerText = 'Деревня';
                gameState.leagueLevel = 0;
                gameState.clicksPerLevel = 5;
                backgroundImage = 'brawl_clicker-master/static/images/hogwarts.png';
        }
        body.style.backgroundImage = `url("${backgroundImage}")`;
        body.style.backgroundSize = 'cover';
        body.style.backgroundAttachment = 'fixed';
        progressLabel.style.backgroundImage = `url("${backgroundImage}")`;
        progressLabel.style.backgroundSize = 'cover';
        progressLabel.style.backgroundPosition = 'center';
        if (backgroundImage === 'brawl_clicker-master/static/images/hogwarts.png' || backgroundImage === 'brawl_clicker-master/static/images/ice.png') {
            body.style.backgroundPosition = 'center calc(50%-12vh)';
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

    function createGhostEffect(event) {
        const ghost = document.createElement('div');
        ghost.classList.add('ghost-effect');
        const x = event.clientX;
        const y = event.clientY;
        ghost.style.left = `${x - 25}px`;
        ghost.style.top = `${y - 25}px`;
        document.body.appendChild(ghost);
        setTimeout(() => ghost.remove(), 1000);
    }

    function createLeafEffect(event) {
        const leaf = document.createElement('div');
        leaf.classList.add('leaf-effect');
        const x = event.clientX;
        const y = event.clientY;
        leaf.style.left = `${x - 25}px`;
        leaf.style.top = `${y - 25}px`;
        document.body.appendChild(leaf);
        setTimeout(() => leaf.remove(), 1000);
    }

    function createStoneEffect(event) {
        const stone = document.createElement('div');
        stone.classList.add('stone-effect');
        const x = event.clientX;
        const y = event.clientY;
        stone.style.left = `${x - 25}px`;
        stone.style.top = `${y - 25}px`;
        document.body.appendChild(stone);
        setTimeout(() => stone.remove(), 1000);
    }

    function createFireEffect(event) {
        const fire = document.createElement('div');
        fire.classList.add('fire-effect');
        const x = event.clientX;
        const y = event.clientY;
        fire.style.left = `${x - 25}px`;
        fire.style.top = `${y - 25}px`;
        document.body.appendChild(fire);
        setTimeout(() => fire.remove(), 1000);
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
        setTimeout(() => water.remove(), 1000);
    }

    function createGodEffect(event) {
        const god = document.createElement('div');
        god.classList.add('god-effect');
        const x = event.clientX;
        const y = event.clientY;
        god.style.left = `${x - 25}px`;
        god.style.top = `${y - 25}px`;
        document.body.appendChild(god);
        setTimeout(() => god.remove(), 1000);
    }

    function createMagicEffect(event) {
        const magic = document.createElement('div');
        magic.classList.add('magic-effect');
        const x = event.clientX;
        const y = event.clientY;
        magic.style.left = `${x - 25}px`;
        magic.style.top = `${y - 25}px`;
        document.body.appendChild(magic);
        setTimeout(() => magic.remove(), 1000);
    }

    function createHeartEffect(event) {
        const heart = document.createElement('div');
        heart.classList.add('heart-effect');
        const x = event.clientX;
        const y = event.clientY;
        heart.style.left = `${x - 25}px`;
        heart.style.top = `${y - 25}px`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }

    function createAnanasEffect(event) {
        const ananas = document.createElement('div');
        ananas.classList.add('ananas-effect');
        const x = event.clientX;
        const y = event.clientY;
        ananas.style.left = `${x - 25}px`;
        ananas.style.top = `${y - 25}px`;
        document.body.appendChild(ananas);
        setTimeout(() => ananas.remove(), 1000);
    }

    function createFrogEffect(event) {
        const frog = document.createElement('div');
        frog.classList.add('frog-effect');
        const x = event.clientX;
        const y = event.clientY;
        frog.style.left = `${x - 25}px`;
        frog.style.top = `${y - 25}px`;
        document.body.appendChild(frog);
        setTimeout(() => frog.remove(), 1000);
    }

    function createRedEffect(event) {
        const red = document.createElement('div');
        red.classList.add('red-effect');
        const x = event.clientX;
        const y = event.clientY;
        red.style.left = `${x - 25}px`;
        red.style.top = `${y - 25}px`;
        document.body.appendChild(red);
        setTimeout(() => red.remove(), 1000);
    }

    function createDarkEffect(event) {
        const dark = document.createElement('div');
        dark.classList.add('dark-effect');
        const x = event.clientX;
        const y = event.clientY;
        dark.style.left = `${x - 25}px`;
        dark.style.top = `${y - 25}px`;
        document.body.appendChild(dark);
        setTimeout(() => dark.remove(), 1000);
    }

    function createFishEffect(event) {
        const fish = document.createElement('div');
        fish.classList.add('fish-effect');
        const x = event.clientX;
        const y = event.clientY;
        fish.style.left = `${x - 25}px`;
        fish.style.top = `${y - 25}px`;
        document.body.appendChild(fish);
        setTimeout(() => fish.remove(), 1000);
    }

    function createMinionEffect(event) {
        const minion = document.createElement('div');
        minion.classList.add('minion-effect');
        const x = event.clientX;
        const y = event.clientY;
        minion.style.left = `${x - 25}px`;
        minion.style.top = `${y - 25}px`;
        document.body.appendChild(minion);
        setTimeout(() => minion.remove(), 1000);
    }

    const upgradeItems = {
        autoclick: { button: '.item_up1', overlay: '.overlay_1', container: '.container_up_buy_1', priceElement: '.coin_up1', buyButton: '.upgrade-button_1', closeButton: '.close-button_1', basePrice: 2000, levelElement: '.item-details_1' },
        click: { button: '.item_up2', overlay: '.overlay', container: '.container_up_buy_2', priceElement: '.coin_up', buyButton: '.upgrade-button_2', closeButton: '.close-button_2', basePrice: 1000, levelElement: '.item-details' },
        energy: { button: '.item_up3', overlay: '.overlay_3', container: '.container_up_buy_3', priceElement: '.coin_up3', buyButton: '.upgrade-button_3', closeButton: '.close-button_3', basePrice: 2000, levelElement: '.item-details_3' },
        recharge: { button: '.item_up4', overlay: '.overlay_4', container: '.container_up_buy_4', priceElement: '.coin_up4', buyButton: '.upgrade-button_4', closeButton: '.close-button_4', basePrice: 2000, levelElement: '.item-details_4' },
        coinsPerPoint: { button: '.item_up5', overlay: '.overlay_5', container: '.container_up_buy_5', priceElement: '.coin_up5', buyButton: '.upgrade-button_5', closeButton: '.close-button_5', basePrice: 1500, levelElement: '.item-details_5' }
    };

    Object.keys(upgradeItems).forEach(key => {
        const item = upgradeItems[key];
        const level = key === 'autoclick' ? gameState.autoClickerLevel : key === 'energy' ? gameState.energyLevel : key === 'recharge' ? gameState.recoveryLevel : 1;
        const levelElement = document.querySelector(item.levelElement);
        const priceElement = document.querySelector(item.priceElement);
        if (levelElement && priceElement) {
            if (key === 'autoclick') {
                levelElement.textContent = `${item.basePrice}/1h • Level ${level}`;
            } else {
                levelElement.textContent = `${level} • Level ${level}`;
            }
            priceElement.textContent = item.basePrice * level;
        }
    });

    Object.keys(upgradeItems).forEach(key => {
        const item = upgradeItems[key];
        const button = document.querySelector(item.button);
        const overlay = document.querySelector(item.overlay);
        const container = document.querySelector(item.container);
        const closeButton = document.querySelector(item.closeButton);
        if (button && overlay && container && closeButton) {
            button.addEventListener('click', () => {
                overlay.style.display = 'block';
                container.style.display = 'block';
            });
            closeButton.addEventListener('click', () => {
                overlay.style.display = 'none';
                container.style.display = 'none';
            });
        }
    });

    function buyUpgrade(key) {
        const item = upgradeItems[key];
        const level = key === 'autoclick' ? gameState.autoClickerLevel : key === 'energy' ? gameState.energyLevel : key === 'recharge' ? gameState.recoveryLevel : 1;
        const price = item.basePrice * level;
        if (gameState.totalCoins >= price) {
            gameState.totalCoins -= price;
            updateScore(gameState.totalCoins);
            const newLevel = level + 1;
            const priceElement = document.querySelector(item.priceElement);
            const levelElement = document.querySelector(item.levelElement);
            if (priceElement && levelElement) {
                priceElement.textContent = item.basePrice * newLevel;
                if (key === 'autoclick') {
                    levelElement.textContent = `${item.basePrice * newLevel}/1h • Level ${newLevel}`;
                    gameState.autoClickerLevel = newLevel;
                } else {
                    levelElement.textContent = `${newLevel} • Level ${newLevel}`;
                }
            }
            if (key === 'click') {
                window.updateCoinsPerClick(newLevel);
            } else if (key === 'energy') {
                gameState.maxEnergy = 100 + (newLevel - 1) * 50;
                gameState.energyLevel = newLevel;
            } else if (key === 'recharge') {
                window.updateEnergyRecoveryRate(newLevel * 3);
                gameState.recoveryLevel = newLevel;
            } else if (key === 'coinsPerPoint') {
                gameState.coinsPerClick = newLevel;
            }
        } else {
            alert('Недостаточно монет!');
        }
    }

    document.querySelector('.upgrade-button_1').addEventListener('click', () => buyUpgrade('autoclick'));
    document.querySelector('.upgrade-button_2').addEventListener('click', () => buyUpgrade('click'));
    document.querySelector('.upgrade-button_3').addEventListener('click', () => buyUpgrade('energy'));
    document.querySelector('.upgrade-button_4').addEventListener('click', () => buyUpgrade('recharge'));
    document.querySelector('.upgrade-button_5').addEventListener('click', () => buyUpgrade('coinsPerPoint'));

    const itemUp1 = document.querySelector('.item_up1');
    const containerUpBuy1 = document.querySelector('.container_up_buy_1');
    const overlay1 = document.querySelector('.overlay_1');
    const closeButton1 = document.querySelector('.close-button_1');
    const upgradeButton1 = document.querySelector('.upgrade-button_1');
    const upgradeMessage1 = document.createElement('div');
    const coinElement1 = document.querySelector('.coin_up1');
    let autoClickInterval = 5000;
    let autoClickerEnabled = false;

    upgradeMessage1.classList.add('upgrade-message');
    upgradeMessage1.style.display = 'none';
    document.body.appendChild(upgradeMessage1);

    const upgradePricesAutoClicker = [2000, 5000, 15000, 30000, 60000];
    const maxAutoClickerLevel = upgradePricesAutoClicker.length;

    function updateAutoClickerDetails() {
        const upgradeCost = upgradePricesAutoClicker[gameState.autoClickerLevel - 1];
        if (coinElement1) {
            coinElement1.textContent = gameState.autoClickerLevel < maxAutoClickerLevel ? upgradeCost : "Максимум";
        }
        const coinsPerClick = gameState.autoClickerLevel * 10;
        const clicksPerHour = (3600 / (autoClickInterval / 1000));
        const coinsPerHour = coinsPerClick * clicksPerHour;
        const itemDetails1 = document.querySelector('.item_up1 .item-details_1');
        if (itemDetails1) itemDetails1.textContent = `${coinsPerHour.toFixed(0)} монет в час • Уровень ${gameState.autoClickerLevel}`;
    }

    let autoClickerInterval;
    function startAutoClicker() {
        if (!autoClickerEnabled) {
            autoClickerEnabled = true;
            clearInterval(autoClickerInterval);
            autoClickerInterval = setInterval(() => {
                if (autoClickerEnabled) {
                    gameState.totalCoins += gameState.autoClickerLevel * 10;
                    updateScore(gameState.totalCoins);
                }
            }, autoClickInterval);
        }
    }

    if (upgradeButton1) {
        upgradeButton1.addEventListener('click', () => {
            const upgradeCost = upgradePricesAutoClicker[gameState.autoClickerLevel - 1];
            if (gameState.totalCoins >= upgradeCost && gameState.autoClickerLevel < maxAutoClickerLevel) {
                gameState.totalCoins -= upgradeCost;
                gameState.autoClickerLevel++;
                autoClickInterval = Math.max(1000, autoClickInterval - 500);
                updateScore(gameState.totalCoins);
                updateAutoClickerDetails();
                if (!autoClickerEnabled) startAutoClicker();
                upgradeMessage1.textContent = 'Автокликер улучшен!';
                upgradeMessage1.style.display = 'block';
                setTimeout(() => upgradeMessage1.style.display = 'none', 1500);
                containerUpBuy1.style.display = 'none';
                overlay1.style.display = 'none';
            } else if (gameState.autoClickerLevel >= maxAutoClickerLevel) {
                upgradeMessage1.textContent = 'Вы достигли максимального уровня автокликера!';
                upgradeMessage1.style.display = 'block';
                setTimeout(() => upgradeMessage1.style.display = 'none', 1500);
            } else {
                upgradeMessage1.textContent = 'У вас недостаточно средств для улучшения!';
                upgradeMessage1.style.display = 'block';
                setTimeout(() => upgradeMessage1.style.display = 'none', 1500);
            }
        });
    }

    if (itemUp1 && containerUpBuy1 && overlay1 && closeButton1) {
        itemUp1.addEventListener('click', () => {
            containerUpBuy1.style.display = 'block';
            overlay1.style.display = 'block';
        });
        closeButton1.addEventListener('click', () => {
            containerUpBuy1.style.display = 'none';
            overlay1.style.display = 'none';
        });
        overlay1.addEventListener('click', () => {
            containerUpBuy1.style.display = 'none';
            overlay1.style.display = 'none';
        });
    }

    updateAutoClickerDetails();

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

    function lockSpecificCharacters() {
        const charactersToLock = [];
        charactersToLock.forEach(hero => {
            const character = document.querySelector(`.character[data-id="${hero.id}"]`);
            if (character) {
                character.classList.add('locked');
                character.setAttribute('data-locked', 'true');
            }
        });
    }

    function unlockCharacter(characterId) {
        const character = document.querySelector(`.character[data-id="${characterId}"]`);
        if (character) {
            character.classList.remove('locked');
            character.removeAttribute('data-locked');
        }
    }

    lockSpecificCharacters();

    if (shopBox && overlayBox1 && containerBox1) {
        shopBox.addEventListener('click', () => {
            overlayBox1.style.display = 'block';
            containerBox1.style.display = 'block';
        });
    }

    if (closeButtonBox1 && overlayBox1 && containerBox1) {
        closeButtonBox1.addEventListener('click', () => {
            overlayBox1.style.display = 'none';
            containerBox1.style.display = 'none';
        });
        overlayBox1.addEventListener('click', () => {
            overlayBox1.style.display = 'none';
            containerBox1.style.display = 'none';
        });
    }

    if (upgradeButtonBox1 && containerBox1 && containerBox11 && rewardImage) {
        upgradeButtonBox1.addEventListener('click', () => {
            containerBox1.style.display = 'none';
            const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
            containerBox11.style.display = 'block';
            rewardImage.src = randomHero.img;
            rewardImage.alt = 'Выпавший герой';
            unlockCharacter(randomHero.id);
        });
    }

    if (closeRewardButton && overlayBox1 && containerBox11) {
        closeRewardButton.addEventListener('click', () => {
            overlayBox1.style.display = 'none';
            containerBox11.style.display = 'none';
        });
    }

    let currentPreviewCharacter = null;
    let selectedCharacter = null;

    characters.forEach(character => {
        character.addEventListener('click', () => {
            const imgSrc = character.getAttribute('data-img');
            const description = character.getAttribute('data-description');
            if (previewImg && characterDescription) {
                previewImg.src = imgSrc;
                characterDescription.textContent = description;
            }
            if (currentPreviewCharacter) {
                currentPreviewCharacter.classList.remove('selected-preview');
            }
            character.classList.add('selected-preview');
            currentPreviewCharacter = character;
        });
    });

    if (selectButton) {
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
            currentPreviewCharacter.classList.remove('selected-preview');
            currentPreviewCharacter.classList.add('selected');
            selectedCharacter = currentPreviewCharacter;
            window.updateClickButtonImage(imgSrc);
        });
    }

    const menuButtons = document.querySelectorAll(".nav-button");
    const pages = document.querySelectorAll(".page");

    function hideAllPages() {
        pages.forEach(page => page.style.display = "none");
    }

    function deactivateAllButtons() {
        menuButtons.forEach(button => button.classList.remove("active"));
    }

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.getAttribute('data-page');
            const page = document.getElementById(pageId);
            if (page) {
                hideAllPages();
                deactivateAllButtons();
                page.style.display = 'block';
                button.classList.add('active');
            }
        });
    });

    const defaultPageButton = document.querySelector('.nav-button[data-page="home"]');
    if (defaultPageButton) {
        defaultPageButton.click();
    }

    const level = 1;
    const coinsPerClickDisplay = document.getElementById('coinsPerClickDisplay');
    const energyRecoveryRateDisplay = document.getElementById('energyRecoveryRateDisplay');
    if (coinsPerClickDisplay) coinsPerClickDisplay.textContent = `Монет за клик: ${gameState.coinsPerClick}`;
    if (energyRecoveryRateDisplay) energyRecoveryRateDisplay.textContent = `Скорость восстановления энергии: ${gameState.energyRecoveryRate}`;
    progressBar.style.width = `${gameState.progress}%`;
    energyDisplay.textContent = `${Math.round(gameState.energy)}/${gameState.maxEnergy}`;

    window.updateMaxEnergy = (newMaxEnergy) => {
        gameState.maxEnergy = newMaxEnergy;
        energyDisplay.textContent = `${Math.round(gameState.energy)}/${gameState.maxEnergy}`;
    };

    setLeagueBackground(gameState.leagueLevel);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const addedNodes = mutation.addedNodes;
                addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains('coin_drop')) {
                        node.addEventListener('animationend', () => node.remove());
                    }
                });
            }
        });
    });
    observer.observe(coinContainer, { childList: true, subtree: true });
    // Функция для переключения содержимого в магазине
function loadContent(section) {
    // Находим все разделы магазина
    const contents = document.querySelectorAll('#shop .content-section');
    
    // Скрываем все разделы
    contents.forEach(content => {
        content.style.display = 'none';
    });

    // Показываем выбранный раздел
    const targetContent = document.getElementById(section);
    if (targetContent) {
        targetContent.style.display = 'block';
    } else {
        console.error(`Section with id "${section}" not found`);
    }

    // Обновляем активный пункт меню (опционально)
    const menuItems = document.querySelectorAll('.shop_menu-item a');
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick') === `loadContent('${section}')`) {
            item.classList.add('active');
        }
    });
}

// Устанавливаем начальный раздел магазина при его открытии
document.querySelector('.nav-button[data-page="shop"]').addEventListener('click', () => {
    loadContent('special'); // По умолчанию показываем раздел "special"
});

// Устанавливаем начальный раздел при загрузке страницы, если магазин открыт по умолчанию
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('shop').style.display === 'block') {
        loadContent('special');
    }
});
});
