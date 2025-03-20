const dragonImageSrc = "brawl_clicker-master/static/images/dragon.png";
let currentScore = 0;
const currentScoreElement = document.querySelector(".currentScore");
let dragonInterval;
let activeDragon = null;

// Функция проверки, установлен ли фон Китая
function isChinaBackground() {
    return localStorage.getItem("backgroundImage") === "brawl_clicker-master/static/images/china.png";
}

// Функция для появления дракона
function spawnDragon() {
    if (!isChinaBackground() || activeDragon) return; // Проверяем фон и существование дракона

    const dragon = document.createElement("img");
    dragon.src = dragonImageSrc;
    dragon.style.position = "fixed"; // Фиксированное положение
    dragon.style.width = "120px";
    dragon.style.height = "120px";
    dragon.style.top = Math.random() * (window.innerHeight - 140) + "px"; // Случайное положение
    dragon.style.left = Math.random() * (window.innerWidth - 140) + "px";
    dragon.style.cursor = "pointer";
    dragon.style.zIndex = "9999"; // Поверх всех элементов

    document.body.appendChild(dragon);
    activeDragon = dragon;

    // Клик по дракону — добавляем 100 очков и убираем его
    dragon.addEventListener("click", () => {
        currentScore += 100;
        currentScoreElement.textContent = currentScore;
        removeDragon();
    });

    // Если не кликнули, дракон исчезнет через 5 секунд
    setTimeout(removeDragon, 5000);
}

// Функция удаления дракона
function removeDragon() {
    if (activeDragon) {
        activeDragon.remove();
        activeDragon = null;
    }
}

// Запуск или остановка появления дракона при изменении фона
function checkBackgroundAndSpawn() {
    if (isChinaBackground()) {
        if (!dragonInterval) {
            dragonInterval = setInterval(spawnDragon, 10000); // Дракон появляется каждые 10 секунд
        }
    } else {
        clearInterval(dragonInterval);
        dragonInterval = null;
        removeDragon();
    }
}

// Следим за изменением localStorage (фон меняется в `setLeagueBackground`)
window.addEventListener("storage", checkBackgroundAndSpawn);

// Проверяем фон при загрузке страницы
checkBackgroundAndSpawn();
