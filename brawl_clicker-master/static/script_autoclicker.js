document.addEventListener('DOMContentLoaded', () => {
  const itemUp1 = document.querySelector('.item_up1');
  const containerUpBuy1 = document.querySelector('.container_up_buy_1');
  const overlay1 = document.querySelector('.overlay_1');
  const closeButton1 = document.querySelector('.close-button_1');
  const upgradeButton1 = document.querySelector('.upgrade-button_1');
  const upgradeMessage1 = document.createElement('div'); // Сообщение
  const coinElement1 = document.querySelector('.coin_up1');
  const currentScoreElements1 = document.querySelectorAll('.currentScore');

  let currentScore = parseInt(localStorage.getItem('currentScore')) || 5000; // Баланс монет
  let autoClickerLevel = 1;
  const upgradePricesAutoClicker = [2000, 5000, 15000, 30000, 60000]; // Цены на улучшения
  const maxAutoClickerLevel = upgradePricesAutoClicker.length; // Максимальный уровень автокликера (5 уровней)
  let autoClickInterval = 5000; // Интервал автоклика в миллисекундах
  let autoClickerEnabled = false; // Автокликер изначально выключен

  // Добавляем сообщение на страницу
  upgradeMessage1.classList.add('upgrade-message');
  upgradeMessage1.style.display = 'none';
  document.body.appendChild(upgradeMessage1);

  // Функция обновления счета
  function updateScore(newScore) {
    currentScore = newScore;
    currentScoreElements1.forEach((element) => {
      element.innerText = currentScore;
    });
    localStorage.setItem('currentScore', currentScore); // Сохраняем баланс монет в localStorage
  }

  // Обновление информации об улучшении
  function updateAutoClickerDetails() {
    const upgradeCost = upgradePricesAutoClicker[autoClickerLevel - 1];

    if (coinElement1) {
      if (autoClickerLevel < maxAutoClickerLevel) {
        coinElement1.textContent = upgradeCost; // Если не максимальный уровень, показываем стоимость
      } else {
        coinElement1.textContent = "Максимум"; // Если максимальный уровень, пишем "Максимум"
      }
    }
    const coinsPerClick = autoClickerLevel * 10; // Количество монет за клик на текущем уровне
    const clicksPerHour = (3600 / (autoClickInterval / 1000)); // Количество кликов в час
    const coinsPerHour = coinsPerClick * clicksPerHour; // Количество монет в час

    // Обновляем информацию в интерфейсе
    const itemDetails1 = document.querySelector('.item_up1 .item-details_1');
    itemDetails1.textContent = `${coinsPerHour.toFixed(0)} монет в час • Уровень ${autoClickerLevel}`;
  }

  // Функция автокликера
  function startAutoClicker() {
    if (!autoClickerEnabled) {
      autoClickerEnabled = true; // Активируем автокликер
      setInterval(() => {
        if (autoClickerEnabled) {
          currentScore += autoClickerLevel * 10; // Прибавляем монеты за автоклики
          updateScore(currentScore);
        }
      }, autoClickInterval);
    }
  }

  // Покупка улучшения автокликера
  upgradeButton1.addEventListener('click', () => {
    const upgradeCost = upgradePricesAutoClicker[autoClickerLevel - 1];

    if (currentScore >= upgradeCost && autoClickerLevel < maxAutoClickerLevel) {
      currentScore -= upgradeCost;
      autoClickerLevel++;
      autoClickInterval = Math.max(1000, autoClickInterval - 500); // Уменьшаем интервал автокликов
      updateScore(currentScore);
      updateAutoClickerDetails();

      if (!autoClickerEnabled) {
        startAutoClicker(); // Запускаем автокликер при первой покупке
      }

      upgradeMessage1.textContent = 'Автокликер улучшен!';
      upgradeMessage1.style.display = 'block';

      setTimeout(() => {
        upgradeMessage1.style.display = 'none';
      }, 1500);

      // Закрываем окно улучшения
      containerUpBuy1.style.display = 'none';
      overlay1.style.display = 'none';
    } else if (autoClickerLevel >= maxAutoClickerLevel) {
      upgradeMessage1.textContent = 'Вы достигли максимального уровня автокликера!';
      upgradeMessage1.style.display = 'block';

      setTimeout(() => {
        upgradeMessage1.style.display = 'none';
      }, 1500);
    } else {
      upgradeMessage1.textContent = 'У вас недостаточно средств для улучшения!';
      upgradeMessage1.style.display = 'block';

      setTimeout(() => {
        upgradeMessage1.style.display = 'none';
      }, 1500);
    }
  });

  // Открытие окна улучшения
  itemUp1.addEventListener('click', () => {
    containerUpBuy1.style.display = 'block';
    overlay1.style.display = 'block';
  });

  // Закрытие окна улучшения
  closeButton1.addEventListener('click', () => {
    containerUpBuy1.style.display = 'none';
    overlay1.style.display = 'none';
  });

  // Закрытие окна при клике на затемнение
  overlay1.addEventListener('click', () => {
    containerUpBuy1.style.display = 'none';
    overlay1.style.display = 'none';
  });

  // Инициализация интерфейса
  updateScore(currentScore);
  updateAutoClickerDetails();
});
