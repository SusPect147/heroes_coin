document.addEventListener('DOMContentLoaded', () => {
    const settingsIcon = document.getElementById('settings-icon');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const musicToggle = document.getElementById('musicToggle');
    const soundToggle = document.getElementById('soundToggle');

    // Музыка для главного меню (play, market, shop, quests/wheel)
    let isMusicEnabled = localStorage.getItem('isMusicEnabled') !== 'false'; // По умолчанию музыка включена
    const mainMenuMusic = new Audio('brawl_clicker-master/static/audio/Clown.mp3');
    mainMenuMusic.loop = true;
    mainMenuMusic.volume = 0.5;

    // Музыка для мини-игр (top)
    const miniGameMusic = new Audio('brawl_clicker-master/static/audio/Jingle-Bells.mp3');
    miniGameMusic.loop = true;
    miniGameMusic.volume = 0.5;

    // Звук переключения разделов
    let isSoundEnabled = localStorage.getItem('isSoundEnabled') !== 'false'; // По умолчанию звук включён
    const navigationSound = new Audio('brawl_clicker-master/static/audio/Navigation.mp3');
    navigationSound.volume = 0.5;

    // Текущая страница
    let currentPage = 'play'; // Начальная страница
    let lastMusicType = 'main'; // Отслеживаем, какая музыка играла ('main' или 'mini')

    // Функция для переключения музыки
    function toggleMusic() {
        isMusicEnabled = !isMusicEnabled;
        localStorage.setItem('isMusicEnabled', isMusicEnabled);
        if (isMusicEnabled) {
            if (currentPage === 'top') {
                mainMenuMusic.pause();
                miniGameMusic.currentTime = 0;
                miniGameMusic.play().catch(error => {
                    console.log("Автовоспроизведение музыки заблокировано: ", error);
                });
                lastMusicType = 'mini';
            } else {
                miniGameMusic.pause();
                mainMenuMusic.play().catch(error => {
                    console.log("Автовоспроизведение музыки заблокировано: ", error);
                });
                lastMusicType = 'main';
            }
            musicToggle.checked = true;
        } else {
            mainMenuMusic.pause();
            miniGameMusic.pause();
            musicToggle.checked = false;
        }
    }

    // Функция для переключения звука
    function toggleSound() {
        isSoundEnabled = !isSoundEnabled;
        localStorage.setItem('isSoundEnabled', isSoundEnabled);
        soundToggle.checked = isSoundEnabled;
    }

    // Инициализация состояния переключателей
    if (musicToggle) {
        musicToggle.checked = isMusicEnabled;
        musicToggle.addEventListener('change', toggleMusic);

        // Запускаем музыку при загрузке, если она включена
        if (isMusicEnabled) {
            mainMenuMusic.play().catch(error => {
                console.log("Автовоспроизведение музыки заблокировано: ", error);
            });
            lastMusicType = 'main';
        }
    } else {
        console.error("Переключатель музыки (musicToggle) не найден.");
    }

    if (soundToggle) {
        soundToggle.checked = isSoundEnabled;
        soundToggle.addEventListener('change', toggleSound);
    } else {
        console.error("Переключатель звука (soundToggle) не найден.");
    }

    // Открытие модального окна
    settingsIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        settingsModal.classList.add('active');
    });

    // Закрытие модального окна
    closeSettings.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });

    // Закрытие при клике вне окна
    document.addEventListener('click', (event) => {
        if (!settingsModal.contains(event.target) && !settingsIcon.contains(event.target)) {
            settingsModal.classList.remove('active');
        }
    });

    // Логика переключения страниц, музыки и звука
    const navButtons = document.querySelectorAll('.nav-button');
    const pages = document.querySelectorAll('.page');

    navButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const pageId = button.getAttribute('data-page');

            // Воспроизводим звук переключения разделов, только если звук включён
            if (isSoundEnabled) {
                navigationSound.currentTime = 0;
                navigationSound.play().catch(error => {
                    console.log("Воспроизведение звука переключения заблокировано: ", error);
                });
            }

            // Обновляем текущую страницу
            const previousPage = currentPage;
            currentPage = pageId;

            // Переключаем музыку, только если нужно сменить тип музыки
            if (isMusicEnabled) {
                const mainPages = ['play', 'market', 'shop', 'quests'];
                const isMainPage = mainPages.includes(currentPage);
                const wasMainPage = mainPages.includes(previousPage);

                if (isMainPage && !wasMainPage) {
                    miniGameMusic.pause();
                    miniGameMusic.currentTime = 0;
                    mainMenuMusic.play().catch(error => {
                        console.log("Автовоспроизведение музыки заблокировано: ", error);
                    });
                    lastMusicType = 'main';
                } else if (!isMainPage && wasMainPage) {
                    mainMenuMusic.pause();
                    miniGameMusic.currentTime = 0;
                    miniGameMusic.play().catch(error => {
                        console.log("Автовоспроизведение музыки заблокировано: ", error);
                    });
                    lastMusicType = 'mini';
                }
            }

            // Скрываем все страницы
            pages.forEach(page => {
                page.style.display = 'none';
            });

            // Показываем выбранную страницу
            const activePage = document.getElementById(pageId);
            if (activePage) {
                activePage.style.display = 'block';
            }

            // Обновляем активный класс для кнопок навигации
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
});

        // Particle system
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Particle class
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

        // Particle array
        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();

document.addEventListener('DOMContentLoaded', () => {
    const buyStarsButton = document.querySelector('.buy_stars');
    const buyCoinsButton = document.querySelector('.buy_coins');
    const buyConfirmButton = document.querySelector('.buy_confirm');
    const coinCost = 10000; // Стоимость в монетах
    const starCost = 100;   // Стоимость в звёздах
    let selectedCurrency = 'coins'; // По умолчанию выбраны монеты

    // Функция для переключения активной кнопки
    function setActiveButton(activeButton, currency) {
        [buyCoinsButton, buyStarsButton].forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
        selectedCurrency = currency;
    }

    // Устанавливаем кнопку монет активной по умолчанию
    setActiveButton(buyCoinsButton, 'coins');

    // Обработчик для выбора звёзд
    buyStarsButton.addEventListener('click', () => {
        setActiveButton(buyStarsButton, 'stars');
    });

    // Обработчик для выбора монет
    buyCoinsButton.addEventListener('click', () => {
        setActiveButton(buyCoinsButton, 'coins');
    });

    // Обработчик для кнопки Купить
    buyConfirmButton.addEventListener('click', () => {
        if (selectedCurrency === 'coins') {
            let score = parseInt(localStorage.getItem('currentScore')) || 0;
            if (score < coinCost) {
                alert('Недостаточно монет для покупки магического шара!');
                return;
            }
            score -= coinCost;
            localStorage.setItem('currentScore', score);
            alert('Магический шар куплен за монеты! Проверьте ваш инвентарь.');
        } else {
            let stars = parseInt(localStorage.getItem('currentStars')) || 0;
            if (stars < starCost) {
                alert('Недостаточно звёзд для покупки магического шара!');
                return;
            }
            stars -= starCost;
            localStorage.setItem('currentStars', stars);
            alert('Магический шар куплен за звёзды! Проверьте ваш инвентарь.');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Массив скинов на основе switch
    const skins = [
        { level: 0, name: 'Деревня', src: 'https://em-content.zobj.net/source/telegram/386/lion_1f981.webp', gradient: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2), transparent 70%)' },
        { level: 1, name: 'Ледяной мир', src: 'https://em-content.zobj.net/source/telegram/386/automobile_1f697.webp', gradient: 'radial-gradient(circle at 50% 50%, rgba(255, 99, 71, 0.2), transparent 70%)' },
        { level: 2, name: 'Адский мир', src: 'https://em-content.zobj.net/source/telegram/386/locomotive_1f682.webp', gradient: 'radial-gradient(circle at 50% 50%, rgba(255, 165, 0, 0.2), transparent 70%)' },
        { level: 3, name: 'Китай', src: 'https://em-content.zobj.net/source/telegram/386/airplane_2708-fe0f.webp', gradient: 'radial-gradient(circle at 50% 50%, rgba(135, 206, 235, 0.2), rgba(255, 255, 255, 0.1), transparent 70%)' },
        { level: 4, name: 'Водный мир', src: 'https://em-content.zobj.net/source/telegram/386/rocket_1f680.webp', gradient: 'radial-gradient(circle at 50% 50%, rgba(255, 140, 0, 0.2), rgba(30, 144, 255, 0.2), transparent 70%)' },
        { level: 5, name: 'Мистика', src: 'https://em-content.zobj.net/source/telegram/386/moai_1f5ff.webp', gradient: 'radial-gradient(circle at 50% 50%, rgba(128, 128, 128, 0.2), transparent 70%)' },
        { level: 6, name: 'Кубический мир', src: 'https://em-content.zobj.net/source/telegram/386/alien_1f47d.webp', gradient: 'radial-gradient(circle at 50% 50%, rgba(50, 205, 50, 0.2), transparent 70%)' },
        { level: 7, name: 'Тьма', src: 'https://em-content.zobj.net/source/telegram/386/robot_1f916.webp', gradient: 'radial-gradient(circle at 50% 50%, rgba(70, 130, 180, 0.2), rgba(169, 169, 169, 0.2), transparent 70%)' },
        { level: 8, name: 'Космос', src: 'https://em-content.zobj.net/source/telegram/386/hamster_1f439.webp', gradient: 'radial-gradient(circle at 50% 50%, rgba(255, 99, 71, 0.2), transparent 70%)' },
        { level: 9, name: 'Темнота', src: 'https://em-content.zobj.net/source/telegram/386/frog_1f438.webp', gradient: 'radial-gradient(circle at 50% 50%, rgba(255, 165, 0, 0.2), transparent 70%)' },
        { level: 10, name: 'НЛО', src: 'https://em-content.zobj.net/source/telegram/386/airplane_2708-fe0f.webp', gradient: 'radial-gradient(circle at 50% 50%, rgba(135, 206, 235, 0.2), rgba(255, 255, 255, 0.1), transparent 70%)' }
    ];

    // Получаем контейнер сетки
    const heroesGrid = document.getElementById('heroes_grid');

    // Создаём карточки для каждого скина
    skins.forEach(skin => {
        const card = document.createElement('div');
        card.classList.add('hero_card');
        card.style.background = skin.gradient;

        const img = document.createElement('img');
        img.src = skin.src;
        img.alt = skin.name;

        const title = document.createElement('h3');
        title.innerText = skin.name;

        card.appendChild(img);
        card.appendChild(title);
        heroesGrid.appendChild(card);
    });
});



document.addEventListener('DOMContentLoaded', () => {
    const gifts = document.querySelectorAll('.gift');
    const inviteButton = document.querySelector('.invite_button');

    // Логика для подарков
    gifts.forEach(gift => {
        gift.addEventListener('click', () => {
            const friendsNeeded = parseInt(gift.getAttribute('data-friends'));
            alert(`Пригласите ${friendsNeeded} друга(ов), чтобы забрать награду!`);
        });
    });

    // Логика для кнопки приглашения
    inviteButton.addEventListener('click', () => {
        // Получаем или генерируем userId
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9); // Генерация случайного ID
            localStorage.setItem('userId', userId);
        }

        // Реферальная ссылка
        const referralLink = `https://yourgame.com/invite?ref=${userId}`;

        // Копирование ссылки в буфер обмена
        navigator.clipboard.writeText(referralLink).then(() => {
            alert('Реферальная ссылка скопирована: ' + referralLink);
        }).catch(err => {
            alert('Ошибка копирования: ' + err);
        });
    });
});