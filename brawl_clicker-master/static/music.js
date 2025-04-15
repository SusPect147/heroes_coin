// Отдельный обработчик для музыки
document.addEventListener('DOMContentLoaded', () => {
    // Переменная для управления музыкой
    let isMusicEnabled = localStorage.getItem('isMusicEnabled') !== 'false'; // По умолчанию музыка включена

    // Создаём объект Audio для музыки
    const mainMenuMusic = new Audio('brawl_clicker-master/static/audio/Clown.mp3');
    mainMenuMusic.loop = true; // Зацикливаем музыку
    mainMenuMusic.volume = 0.5; // Устанавливаем громкость (0.0 - 1.0)

    // Получаем кнопку для управления музыкой
    const musicToggleButton = document.getElementById('musicToggleButton');

    // Функция для переключения музыки
    function toggleMusic() {
        isMusicEnabled = !isMusicEnabled;
        localStorage.setItem('isMusicEnabled', isMusicEnabled);
        if (isMusicEnabled) {
            mainMenuMusic.play().catch(error => {
                console.log("Автовоспроизведение музыки заблокировано: ", error);
            });
            musicToggleButton.textContent = 'Выключить музыку';
        } else {
            mainMenuMusic.pause();
            musicToggleButton.textContent = 'Включить музыку';
        }
    }

    // Функция для попытки воспроизведения музыки
    function tryPlayMusic() {
        if (isMusicEnabled) {
            mainMenuMusic.play().catch(error => {
                console.log("Автовоспроизведение музыки заблокировано: ", error);
            });
        }
    }

    // Инициализация состояния кнопки и музыки
    if (musicToggleButton) {
        musicToggleButton.textContent = isMusicEnabled ? 'Выключить музыку' : 'Включить музыку';
        musicToggleButton.addEventListener('click', toggleMusic);

        // Пытаемся запустить музыку при загрузке страницы
        tryPlayMusic();
    } else {
        console.error("Кнопка управления музыкой (musicToggleButton) не найдена.");
    }

    // Добавляем обработчик для первого взаимодействия пользователя
    let hasInteracted = false;
    document.addEventListener('click', () => {
        if (!hasInteracted && isMusicEnabled) {
            hasInteracted = true;
            mainMenuMusic.play().catch(error => {
                console.log("Автовоспроизведение музыки заблокировано даже после взаимодействия: ", error);
            });
        }
    }, { once: true }); // Событие сработает только один раз
});