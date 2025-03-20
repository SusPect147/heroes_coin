 // Показ/скрытие рулетки
        const openWheelBtn = document.getElementById('open-wheel');
        const closeWheelBtn = document.getElementById('close-btn');
        const wheelContainer = document.getElementById('wheel-container');

        openWheelBtn.addEventListener('click', () => {
            wheelContainer.style.display = 'flex';
        });

        closeWheelBtn.addEventListener('click', () => {
            wheelContainer.style.display = 'none';
        });

        // Логика рулетки
        const spinButton = document.getElementById('spin-btn');
        const wheel = document.getElementById('wheel');
        const result = document.getElementById('result');

        const prizes = [
            "Приз: 100 монет",
            "Приз: 200 монет",
            "Приз: 500 монет",
            "Приз: Бесплатный сундук",
            "Приз: Скидка 10%",
            "Приз: Секретный подарок"
        ];

        let isSpinning = false;
        let currentRotation = 0;

        spinButton.addEventListener('click', () => {
            if (isSpinning) return;
            isSpinning = true;

            const randomStop = Math.floor(Math.random() * 360);
            const fullRotations = 5;
            const targetRotation = fullRotations * 360 + randomStop;

            wheel.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
            wheel.style.transform = `rotate(${currentRotation + targetRotation}deg)`;

            const sectorAngle = 360 / prizes.length;
            const winningIndex = Math.floor((randomStop / sectorAngle) % prizes.length);

            setTimeout(() => {
                result.textContent = prizes[winningIndex];
                isSpinning = false;
                currentRotation += targetRotation;
            }, 5000);
        });

        const prizesContainer = document.getElementById('prizes-container');


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


