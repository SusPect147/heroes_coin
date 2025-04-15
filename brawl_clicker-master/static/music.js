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

    // Инициализация состояния кнопки и музыки
    if (musicToggleButton) {
        musicToggleButton.textContent = isMusicEnabled ? 'Выключить музыку' : 'Включить музыку';
        musicToggleButton.addEventListener('click', toggleMusic);

        // Запускаем музыку при загрузке, если она включена
        if (isMusicEnabled) {
            mainMenuMusic.play().catch(error => {
                console.log("Автовоспроизведение музыки заблокировано: ", error);
            });
        }
    } else {
        console.error("Кнопка управления музыкой (musicToggleButton) не найдена.");
    }
});