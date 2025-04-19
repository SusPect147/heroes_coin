document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('rouletteCanvas');
        const ctx = canvas.getContext('2d');
        const spinButton = document.getElementById('spinButton');

        const sectors = [
            { name: 'Монеты (50 000)', image: 'brawl_clicker-master/static/images/coin.png' },
            { name: 'Leon (бонус)', image: 'brawl_clicker-master/static/images/angel.png' },
            { name: 'Улучшение', image: 'brawl_clicker-master/static/images/fireshot.png' },
            { name: 'Монеты (100 000)', image: 'brawl_clicker-master/static/images/coin.png' },
            { name: 'Скин', image: 'brawl_clicker-master/static/images/groot.png' },
            { name: 'Монеты (25 000)', image: 'brawl_clicker-master/static/images/coin.png' }
        ];

        const sectorAngle = (2 * Math.PI) / sectors.length;
        let currentAngle = 0;
        let isSpinning = false;

        // Загрузка изображений
        const images = {};
        let loadedImages = 0;

        sectors.forEach((sector, index) => {
            const img = new Image();
            img.src = sector.image;
            img.onload = () => {
                images[index] = img;
                loadedImages++;
                if (loadedImages === sectors.length) {
                    drawRoulette();
                }
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${sector.image}`);
                loadedImages++;
                if (loadedImages === sectors.length) {
                    drawRoulette();
                }
            };
        });

        function drawRoulette() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(currentAngle);

            sectors.forEach((sector, index) => {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, canvas.width / 2, index * sectorAngle, (index + 1) * sectorAngle);
                ctx.fillStyle = index % 2 === 0 ? '#ff4500' : '#ffd700';
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Отрисовка изображения
                ctx.save();
                ctx.rotate(index * sectorAngle + sectorAngle / 2);
                ctx.translate(canvas.width / 3, 0);
                ctx.rotate(Math.PI / 2);
                if (images[index]) {
                    ctx.drawImage(images[index], -30, -30, 60, 60);
                }
                ctx.restore();
            });

            ctx.restore();

            // Отрисовка стрелки
            ctx.beginPath();
            ctx.moveTo(canvas.width - 20, canvas.height / 2 - 15);
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.lineTo(canvas.width - 20, canvas.height / 2 + 15);
            ctx.fillStyle = '#fff';
            ctx.fill();
        }

        function spinRoulette() {
            if (isSpinning) return;
            isSpinning = true;
            spinButton.disabled = true;

            const spinTime = 5000; // 5 секунд
            const startTime = performance.now();
            const randomSector = Math.floor(Math.random() * sectors.length);
            const targetAngle = randomSector * sectorAngle + Math.PI * 4; // 2 полных оборота + случайный сектор

            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / spinTime, 1);
                const easeOut = 1 - (1 - progress) ** 3; // Ease-out анимация
                currentAngle = easeOut * targetAngle;

                drawRoulette();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    isSpinning = false;
                    spinButton.disabled = false;

                    // Вычисление выбранного сектора
                    const normalizedAngle = (currentAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
                    const selectedSectorIndex = Math.floor((2 * Math.PI - normalizedAngle) / sectorAngle) % sectors.length;
                    const selectedSector = sectors[selectedSectorIndex];

                    // Вывод результата
                    Telegram.WebApp.showAlert(`Вы выиграли: ${selectedSector.name}!`);
                }
            }

            requestAnimationFrame(animate);
        }

        spinButton.addEventListener('click', spinRoulette);
    });

// Функция сброса кликов до 1
function resetClicks() {
  coinsPerClick = 1; // Сбрасываем количество монет за клик
  localStorage.setItem('coinsPerClick', coinsPerClick); // Обновляем значение в localStorage
}

// Вызываем сброс
resetClicks();



// Функция сброса уровня до 1
// Сброс уровня до 1 и монет за клик для теста
localStorage.setItem('level', 1);
localStorage.setItem('coinsPerClick', 1);



// Монеты
localStorage.setItem('currentScore', 100000000);


 // Сбросить к начальному состоянию
  energyRecoveryRate = 5;
  recoveryLevel = 1;
  itemDetails4.textContent = `${energyRecoveryRate} • Уровень ${recoveryLevel}`;
});



// Сброс скорости восстановления энергии до начального значения
energyRecoveryRate = 5; // Сбрасываем на начальное значение
localStorage.setItem('energyRecoveryRate', energyRecoveryRate); // Сохраняем в localStorage
console.log(`Скорость восстановления энергии сброшена до начального значения: ${energyRecoveryRate}`);


// Сброс скорости восстановления энергии до начального значения
energyRecoveryRate = 5; // Сбрасываем на начальное значение
localStorage.setItem('energyRecoveryRate', energyRecoveryRate); // Сохраняем в localStorage
console.log(`Скорость восстановления энергии сброшена до начального значения: ${energyRecoveryRate}`);



// Сброс прогресса
localStorage.setItem('currentProgress', 0);
progressBar.style.width = '0%';
console.log('Прогресс сброшен до 0 для тестирования.');


// Сброс прогресса восстановления энергии
localStorage.setItem('recoveryLevel', 1); // Сброс уровня восстановления
localStorage.setItem('energyRecoveryRate', baseRecoveryRate); // Сброс скорости восстановления до начальной
// Обновление интерфейса
recoveryLevel = 1;
window.energyRecoveryRate = baseRecoveryRate;
updateEnergyRecoveryDisplay(); // Обновляем отображение уровня и скорости восстановления



// Сброс энергии до 0
localStorage.setItem('currentEnergy', 0); // Сброс текущей энергии
localStorage.setItem('maxEnergy', 100); // Установка начальной максимальной энергии (например, 100)
localStorage.setItem('energyLevel', 1); // Установка начального уровня энергии


