document.addEventListener('DOMContentLoaded', () => {
    // ==== НАСТРОЙКИ МУЗЫКИ И ЗВУКА ====
    const settingsIcon = document.getElementById('settings-icon');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const musicToggle = document.getElementById('musicToggle');
    const soundToggle = document.getElementById('soundToggle');

    let isMusicEnabled = localStorage.getItem('isMusicEnabled') !== 'false';
    let isSoundEnabled = localStorage.getItem('isSoundEnabled') !== 'false';

    const mainMenuMusic = new Audio('brawl_clicker-master/static/audio/Clown.mp3');
    mainMenuMusic.loop = true;
    mainMenuMusic.volume = 0.5;

    const miniGameMusic = new Audio('brawl_clicker-master/static/audio/Jingle-Bells.mp3');
    miniGameMusic.loop = true;
    miniGameMusic.volume = 0.5;

    const navigationSound = new Audio('brawl_clicker-master/static/audio/Navigation.mp3');
    navigationSound.volume = 0.5;

    let currentPage = 'play';
    let lastMusicType = 'main';

    function toggleMusic() {
        isMusicEnabled = !isMusicEnabled;
        localStorage.setItem('isMusicEnabled', isMusicEnabled);
        if (isMusicEnabled) {
            if (currentPage === 'top') {
                mainMenuMusic.pause();
                miniGameMusic.currentTime = 0;
                miniGameMusic.play();
                lastMusicType = 'mini';
            } else {
                miniGameMusic.pause();
                mainMenuMusic.play();
                lastMusicType = 'main';
            }
        } else {
            mainMenuMusic.pause();
            miniGameMusic.pause();
        }
        musicToggle.checked = isMusicEnabled;
    }

    function toggleSound() {
        isSoundEnabled = !isSoundEnabled;
        localStorage.setItem('isSoundEnabled', isSoundEnabled);
        soundToggle.checked = isSoundEnabled;
    }

    if (musicToggle) {
        musicToggle.checked = isMusicEnabled;
        musicToggle.addEventListener('change', toggleMusic);
        if (isMusicEnabled) mainMenuMusic.play();
    }
    if (soundToggle) {
        soundToggle.checked = isSoundEnabled;
        soundToggle.addEventListener('change', toggleSound);
    }

    settingsIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsModal.classList.add('active');
    });
    closeSettings.addEventListener('click', () => settingsModal.classList.remove('active'));
    document.addEventListener('click', (e) => {
        if (!settingsModal.contains(e.target) && !settingsIcon.contains(e.target)) {
            settingsModal.classList.remove('active');
        }
    });

    // ==== НАВИГАЦИЯ ====
    const navButtons = document.querySelectorAll('.nav-button');
    const pages = document.querySelectorAll('.page');

    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = button.getAttribute('data-page');
            const previousPage = currentPage;
            currentPage = pageId;

            if (isSoundEnabled) {
                navigationSound.currentTime = 0;
                navigationSound.play();
            }

            const mainPages = ['play', 'market', 'shop', 'quests'];
            const isMainPage = mainPages.includes(currentPage);
            const wasMainPage = mainPages.includes(previousPage);

            if (isMusicEnabled) {
                if (isMainPage && !wasMainPage) {
                    miniGameMusic.pause();
                    mainMenuMusic.play();
                    lastMusicType = 'main';
                } else if (!isMainPage && wasMainPage) {
                    mainMenuMusic.pause();
                    miniGameMusic.play();
                    lastMusicType = 'mini';
                }
            }

            pages.forEach(page => page.style.display = 'none');
            const activePage = document.getElementById(pageId);
            if (activePage) activePage.style.display = 'block';

            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // ==== ЧАСТИЦЫ И ЭФФЕКТЫ ====
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = `rgba(150, 150, 150, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const particles = [];
    for (let i = 0; i < 50; i++) particles.push(new Particle());

    const effects = [];
    function spawnEffect(x, y) {
        effects.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            radius: 8
        });
    }
    setInterval(() => spawnEffect(canvas.width / 2, canvas.height / 2), 1000);

    canvas.addEventListener('click', (e) => {
        spawnEffect(e.clientX, e.clientY);
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        effects.forEach((effect, index) => {
            effect.x += effect.vx;
            effect.y += effect.vy;
            effect.radius *= 0.95;
            if (effect.radius < 0.5) {
                effects.splice(index, 1);
            } else {
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fill();
            }
        });

        requestAnimationFrame(animate);
    }
    animate();

    // ==== МАГАЗИН ====
    const buyStarsButton = document.querySelector('.buy_stars');
    const buyCoinsButton = document.querySelector('.buy_coins');
    const buyConfirmButton = document.querySelector('.buy_confirm');
    let selectedCurrency = 'coins';

    function setActiveButton(activeButton, currency) {
        [buyCoinsButton, buyStarsButton].forEach(button => button.classList.remove('active'));
        activeButton.classList.add('active');
        selectedCurrency = currency;
    }

    if (buyCoinsButton && buyStarsButton && buyConfirmButton) {
        setActiveButton(buyCoinsButton, 'coins');

        buyStarsButton.addEventListener('click', () => setActiveButton(buyStarsButton, 'stars'));
        buyCoinsButton.addEventListener('click', () => setActiveButton(buyCoinsButton, 'coins'));

        buyConfirmButton.addEventListener('click', () => {
            if (selectedCurrency === 'coins') {
                let score = parseInt(localStorage.getItem('currentScore')) || 0;
                if (score < 10000) {
                    alert('Недостаточно монет!');
                    return;
                }
                score -= 10000;
                localStorage.setItem('currentScore', score);
                alert('Магический шар куплен за монеты!');
            } else {
                let stars = parseInt(localStorage.getItem('currentStars')) || 0;
                if (stars < 100) {
                    alert('Недостаточно звёзд!');
                    return;
                }
                stars -= 100;
                localStorage.setItem('currentStars', stars);
                alert('Магический шар куплен за звёзды!');
            }
        });
    }

    // ==== ГЕРОИ ====
    const skins = [
        { level: 0, name: 'Деревня', src: 'https://em-content.zobj.net/source/telegram/386/lion_1f981.webp' },
        { level: 1, name: 'Ледяной мир', src: 'https://em-content.zobj.net/source/telegram/386/automobile_1f697.webp' },
        { level: 2, name: 'Адский мир', src: 'https://em-content.zobj.net/source/telegram/386/locomotive_1f682.webp' },
        { level: 3, name: 'Китай', src: 'https://em-content.zobj.net/source/telegram/386/airplane_2708-fe0f.webp' },
        { level: 4, name: 'Водный мир', src: 'https://em-content.zobj.net/source/telegram/386/rocket_1f680.webp' },
        { level: 5, name: 'Мистика', src: 'https://em-content.zobj.net/source/telegram/386/moai_1f5ff.webp' }
    ];
    const heroesGrid = document.getElementById('heroes_grid');
    if (heroesGrid) {
        skins.forEach(skin => {
            const card = document.createElement('div');
            card.className = 'hero_card';
            const img = document.createElement('img');
            img.src = skin.src;
            img.alt = skin.name;
            const title = document.createElement('h3');
            title.innerText = skin.name;
            card.appendChild(img);
            card.appendChild(title);
            heroesGrid.appendChild(card);
        });
    }

    // ==== ПОДАРКИ И ИНВАЙТЫ ====
    const gifts = document.querySelectorAll('.gift');
    const inviteButton = document.querySelector('.invite_button');

    function spawnClickEffect(event) {
        const effect = document.createElement('img');
        effect.src = 'https://em-content.zobj.net/source/telegram/386/collision_1f4a5.webp';
        effect.className = 'click-effect';
        effect.style.left = `${event.clientX}px`;
        effect.style.top = `${event.clientY}px`;
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }

    gifts.forEach(gift => {
        gift.addEventListener('click', (event) => {
            const friendsNeeded = parseInt(gift.getAttribute('data-friends'));
            alert(`Пригласите ${friendsNeeded} друга(ов) для получения подарка!`);
            spawnClickEffect(event);
        });
    });

    if (inviteButton) {
        inviteButton.addEventListener('click', (event) => {
            let userId = localStorage.getItem('userId');
            if (!userId) {
                userId = 'user_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('userId', userId);
            }
            const referralLink = `https://yourgame.com/invite?ref=${userId}`;
            navigator.clipboard.writeText(referralLink).then(() => {
                alert('Реферальная ссылка скопирована!');
                spawnClickEffect(event);
            }).catch(err => {
                alert('Ошибка копирования: ' + err);
            });
        });
    }

    // Пример списка подарков
    const giftsList = [
        { name: "Gift 1", imgSrc: "brawl_clicker-master/static/images/May1.json" },
        { name: "Gift 2", imgSrc: "brawl_clicker-master/static/images/May1.json" },
        { name: "Gift 3", imgSrc: "brawl_clicker-master/static/images/May1.json" },
        { name: "Gift 4", imgSrc: "brawl_clicker-master/static/images/May1.json" }
    ];

    // Функция для создания элементов с подарками
    function addGiftsToTicker() {
        const giftList = document.getElementById('giftList');

        giftsList.forEach(gift => {
            const giftItem = document.createElement('div');
            giftItem.classList.add('gift-item');
            giftItem.innerHTML = `<img src="${gift.imgSrc}" alt="${gift.name}" class="gift-image">`;
            giftList.appendChild(giftItem);
        });
    }

    // Добавление элементов на страницу
    addGiftsToTicker();
});
