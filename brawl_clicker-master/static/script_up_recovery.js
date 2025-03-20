document.addEventListener('DOMContentLoaded', () => {
  // Элементы интерфейса
  const itemUp4 = document.querySelector('.item_up4');
  const containerUpBuy4 = document.querySelector('.container_up_buy_4');
  const overlay4 = document.querySelector('.overlay_4');
  const closeButton4 = document.querySelector('.close-button_4');
  const upgradeButton4 = document.querySelector('.upgrade-button_4');
  const upgradeMessage4 = document.createElement('div'); // Сообщение
  const itemDetails4 = document.querySelector('.item_up4 .item-details_4'); // Поле для обновления уровня
  const coinElement4 = document.querySelector('.coin_up4'); // Элемент для отображения цены улучшения
  const currentScoreElements = document.querySelectorAll('.currentScore'); // Все элементы для отображения текущего баланса монет

  // Добавление сообщения в DOM
  upgradeMessage4.classList.add('upgrade-message'); // Добавляем класс для стилизации
  document.body.appendChild(upgradeMessage4); // Добавляем в body

  // Начальные значения
  let recoveryLevel = parseInt(localStorage.getItem('recoveryLevel'), 10) || 1;
  const maxRecoveryLevel = 5;
  const baseRecoveryRate = 3;
  const recoveryRateIncrement = 5;
  const upgradePrices = [1000, 5000, 20000, 100000]; // Стоимость улучшения на каждом уровне

  // Рассчитываем текущую скорость восстановления энергии
  window.energyRecoveryRate = baseRecoveryRate + (recoveryLevel - 1) * recoveryRateIncrement;

  // Обновление интерфейса (скорость восстановления и уровень)
  function updateEnergyRecoveryDisplay() {
    const energyRecoveryRateDisplay = document.getElementById('energyRecoveryRateDisplay');
    if (energyRecoveryRateDisplay) {
      energyRecoveryRateDisplay.textContent = `Уровень восстановления энергии: ${recoveryLevel}, Скорость: ${window.energyRecoveryRate}`;
    }

    // Обновляем текстовое поле itemDetails4 (если есть)
    if (itemDetails4) {
      itemDetails4.textContent = `${window.energyRecoveryRate} • Уровень ${recoveryLevel}`;
    }
  }

  // Обновление монет
  function updatePlayerCoinsDisplay() {
    currentScoreElements.forEach((element) => {
      const playerCoins = parseInt(localStorage.getItem('currentScore'), 10) || 0;
      element.innerText = playerCoins;
    });
  }

  // Рассчитываем стоимость улучшения
  function calculateUpgradeCost(level) {
    return upgradePrices[level - 1];
  }

  // Обновление отображения стоимости улучшения
  function updateUpgradeCostDisplay() {
    const cost = recoveryLevel < maxRecoveryLevel ? calculateUpgradeCost(recoveryLevel) : 'Максимум'; // Если максимальный уровень, отображаем "Максимум"
    if (coinElement4) {
      coinElement4.textContent = cost;
    }
  }

  // Первоначальная настройка
  updateEnergyRecoveryDisplay();
  updatePlayerCoinsDisplay();
  updateUpgradeCostDisplay();

  // Обработчик нажатия кнопки "Улучшить"
  upgradeButton4.addEventListener('click', () => {
    const currentScore = parseInt(localStorage.getItem('currentScore'), 10) || 0;
    const currentPrice = calculateUpgradeCost(recoveryLevel);

    // Проверяем, достаточно ли монет
    if (recoveryLevel < maxRecoveryLevel) {
      if (currentScore >= currentPrice) {
        // Увеличиваем уровень восстановления
        recoveryLevel++;
        window.energyRecoveryRate = baseRecoveryRate + (recoveryLevel - 1) * recoveryRateIncrement;

        // Списываем монеты
        const newScore = currentScore - currentPrice;
        localStorage.setItem('currentScore', newScore);
        localStorage.setItem('recoveryLevel', recoveryLevel);
        localStorage.setItem('energyRecoveryRate', window.energyRecoveryRate);

        // Обновляем интерфейс
        updateEnergyRecoveryDisplay();
        updatePlayerCoinsDisplay();
        updateUpgradeCostDisplay();

        // Сообщение об успехе
        upgradeMessage4.innerText = `Уровень восстановления улучшен! Скорость восстановления: ${window.energyRecoveryRate}.`;
        upgradeMessage4.style.display = 'block';
        setTimeout(() => {
          upgradeMessage4.style.display = 'none';
        }, 1500);

        // Закрытие окна улучшений
        containerUpBuy4.style.display = 'none';
        overlay4.style.display = 'none';
      } else {
        // Если монет недостаточно
        upgradeMessage4.innerText = 'У вас недостаточно монет для улучшения!';
        upgradeMessage4.style.display = 'block';
        setTimeout(() => {
          upgradeMessage4.style.display = 'none';
        }, 1500);
      }
    } else {
      // Если достигнут максимальный уровень
      upgradeMessage4.innerText = 'Вы достигли максимального уровня восстановления энергии!';
      upgradeMessage4.style.display = 'block';
      setTimeout(() => {
        upgradeMessage4.style.display = 'none';
      }, 1500);
    }
  });

  // Открытие окна улучшений
  itemUp4.addEventListener('click', () => {
    containerUpBuy4.style.display = 'block';
    overlay4.style.display = 'block';
    updateUpgradeCostDisplay();
  });

  // Закрытие окна улучшений
  closeButton4.addEventListener('click', () => {
    containerUpBuy4.style.display = 'none';
    overlay4.style.display = 'none';
  });

  // Закрытие окна при клике на overlay
  overlay4.addEventListener('click', () => {
    containerUpBuy4.style.display = 'none';
    overlay4.style.display = 'none';
  });
});

// Сброс прогресса восстановления энергии
localStorage.setItem('recoveryLevel', 1); // Сброс уровня восстановления
localStorage.setItem('energyRecoveryRate', baseRecoveryRate); // Сброс скорости восстановления до начальной
// Обновление интерфейса
recoveryLevel = 1;
window.energyRecoveryRate = baseRecoveryRate;
updateEnergyRecoveryDisplay(); // Обновляем отображение уровня и скорости восстановления
