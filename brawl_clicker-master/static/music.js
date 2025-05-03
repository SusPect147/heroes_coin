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
    const buyButton = document.querySelector('.buy_button');
    const caseCost = 100;

    buyButton.addEventListener('click', () => {
        let score = parseInt(localStorage.getItem('currentScore')) || 0;

        if (score < caseCost) {
            alert('Недостаточно монет для покупки кейса!');
            return;
        }

        score -= caseCost;
        localStorage.setItem('currentScore', score);
        alert('Эпический кейс куплен! Проверьте ваш инвентарь.');

        // Здесь можно добавить логику для добавления кейса в инвентарь
    });
});