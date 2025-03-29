document.addEventListener('DOMContentLoaded', () => {
    // Игра 1: Лови монеты
    const banner = document.getElementById('startBanner');
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

    banner.addEventListener('click', () => {
        banner.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        startGame();
    });

    gameContainer.addEventListener('mousemove', (e) => {
        const rect = gameContainer.getBoundingClientRect();
        bagPosition = e.clientX - rect.left - bag.offsetWidth / 2;
        if (bagPosition < 0) bagPosition = 0;
        if (bagPosition > gameContainer.offsetWidth - bag.offsetWidth) {
            bagPosition = gameContainer.offsetWidth - bag.offsetWidth;
        }
        bag.style.left = `${bagPosition}px`;
    });

    exitButton.addEventListener('click', () => {
        endGame();
        gameContainer.classList.add('hidden');
        banner.classList.remove('hidden');
    });

    function startGame() {
        gameActive = true;
        score = 0;
        scoreElement.textContent = score;
        coinSpeed = 2;
        coins = [];
        gameOverScreen.classList.add('hidden');
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
        coin.classList.add('coin');
        coin.style.left = `${Math.random() * (gameContainer.offsetWidth - 20)}px`;
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
            if (
                coinRect.bottom >= bagRect.top &&
                coinRect.top <= bagRect.bottom &&
                coinRect.right >= bagRect.left &&
                coinRect.left <= bagRect.right
            ) {
                coin.remove();
                coins.splice(index, 1);
                score++;
                scoreElement.textContent = score;
                coinSpeed += 0.1;
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
    }

    function restartGame() {
        startGame();
    }

    // Игра 2: Лопай шарики
    const banner2 = document.getElementById('startBanner2');
    const gameContainer2 = document.getElementById('gameContainer2');
    const scoreElement2 = document.getElementById('scoreValue2');
    const missedElement = document.getElementById('missedValue2');
    const gameOverScreen2 = document.getElementById('gameOver2');
    const finalScoreElement2 = document.getElementById('finalScore2');

    let score2 = 0;
    let missed = 0;
    let gameActive2 = false;
    let balloons = [];
    const maxMissed = 10;
    let spawnInterval2;

    banner2.addEventListener('click', () => {
        banner2.classList.add('hidden');
        gameContainer2.classList.remove('hidden');
        startGame2();
    });

    function startGame2() {
        gameActive2 = true;
        score2 = 0;
        missed = 0;
        scoreElement2.textContent = score2;
        missedElement.textContent = missed;
        balloons = [];
        gameOverScreen2.classList.add('hidden');
        spawnBalloons();
    }

    function spawnBalloons() {
        if (!gameActive2) return;
        spawnBalloon();
        const interval = 2000 - Math.min(score2 * 100, 1800);
        spawnInterval2 = setTimeout(spawnBalloons, interval);
    }

    function spawnBalloon() {
        if (!gameActive2) return;
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffcc00'];
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.left = `${Math.random() * (gameContainer2.offsetWidth - 50)}px`;
        balloon.style.top = `${Math.random() * (gameContainer2.offsetHeight - 50)}px`;
        gameContainer2.appendChild(balloon);
        balloons.push(balloon);

        setTimeout(() => {
            if (balloon.parentElement && gameActive2) {
                balloon.remove();
                balloons = balloons.filter(b => b !== balloon);
                missed++;
                missedElement.textContent = missed;
                if (missed >= maxMissed) endGame2();
            }
        }, 3000 - Math.min(score2 * 100, 2500));

        balloon.addEventListener('click', () => {
            balloon.remove();
            balloons = balloons.filter(b => b !== balloon);
            score2++;
            scoreElement2.textContent = score2;
        });
    }

    function endGame2() {
        gameActive2 = false;
        clearTimeout(spawnInterval2);
        balloons.forEach(balloon => balloon.remove());
        balloons = [];
        finalScoreElement2.textContent = score2;
        gameOverScreen2.classList.remove('hidden');
    }

    function restartGame2() {
        startGame2();
    }
});