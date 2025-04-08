document.addEventListener('DOMContentLoaded', () => {
  const itemUp2 = document.querySelector('.item_up2');
  const containerUpBuy2 = document.querySelector('.container_up_buy_2');
  const overlay = document.querySelector('.overlay');
  const closeButton2 = document.querySelector('.close-button_2');
  const upgradeButton = document.querySelector('.upgrade-button_2');
  const upgradeMessage = document.createElement('div'); // Сообщение
  const itemDetails = document.querySelector('.item_up2 .item-details'); // Поле для обновления
  const coinElement = document.querySelector('.coin_up'); // Элемент для отображения цены улучшения
  const currentScoreElements = document.querySelectorAll('.currentScore'); // Все элементы для отображения текущего баланса монет

  // Создание и добавление сообщения на страницу
  upgradeMessage.classList.add('upgrade-message');
  upgradeMessage.style.display = 'none';
  document.body.appendChild(upgradeMessage);

  // Начальные значения
  let coinsPerClick = parseInt(localStorage.getItem('coinsPerClick')) || 1;
  let level = parseInt(localStorage.getItem('level')) || 1;
  const maxLevel = 10;
  const upgradePrices = [1000, 5000, 20000, 100000, 400000, 1000000, 3000000, 7000000, 18000000];

  // Экспортируем глобальные переменные и функции
  window.coinsPerClick = coinsPerClick;

  // Обновление coinsPerClick
  window.updateCoinsPerClick = (newCoinsPerClick) => {
    window.coinsPerClick = newCoinsPerClick;
    localStorage.setItem('coinsPerClick', newCoinsPerClick);

    // Обновляем интерфейс
    updateLevelDetails();  // Обновляем отображение уровня
  };

  // Функция обновления счета
  window.updateScore = (newScore) => {
    currentScoreElements.forEach((element) => {
      element.innerText = newScore;
    });
    localStorage.setItem('currentScore', newScore);  // Сохраняем в localStorage
  };

  // Функция обновления уровня и монет за клик
  function updateLevelDetails() {
    itemDetails.textContent = `${window.coinsPerClick} • Уровень ${level}`;  // Обновляем значение coinsPerClick в UI
    if (level < maxLevel) {
      coinElement.textContent = upgradePrices[level - 1];
    } else {
      coinElement.textContent = "Максимум";
    }

    // Обновление значения монет за клик на экране
    const coinsPerClickDisplay = document.getElementById('coinsPerClickDisplay');
    if (coinsPerClickDisplay) {
      coinsPerClickDisplay.textContent = `Монет за клик: ${window.coinsPerClick}`;
    }
  }

  // Первоначальное обновление UI
  updateLevelDetails();

  // Обработчик нажатия кнопки "Улучшить"
  upgradeButton.addEventListener('click', () => {
    const currentPrice = upgradePrices[level - 1];
    const currentScore = parseInt(localStorage.getItem('currentScore')) || 0;

    // Если уровень не максимальный
    if (level < maxLevel) {
      if (currentScore >= currentPrice) {
        level++;  // Увеличиваем уровень
        coinsPerClick = level;  // Увеличиваем монеты за клик до уровня
        window.updateCoinsPerClick(coinsPerClick);  // Сразу обновляем значение в глобальной переменной

        // Сохраняем данные
        localStorage.setItem('level', level);
        window.updateScore(currentScore - currentPrice);  // Обновляем счет

        // Обновляем интерфейс
        updateLevelDetails();

        upgradeMessage.innerText = `Монеты за клик увеличены до ${window.coinsPerClick}!`;
        upgradeMessage.style.display = 'block';

        setTimeout(() => {
          upgradeMessage.style.display = 'none';
        }, 1500);

        // Закрытие окна улучшений
        containerUpBuy2.style.display = 'none';
        overlay.style.display = 'none';
      } else {
        upgradeMessage.innerText = 'У вас недостаточно средств для улучшения!';
        upgradeMessage.style.display = 'block';

        setTimeout(() => {
          upgradeMessage.style.display = 'none';
        }, 1500);
      }
    } else {
      upgradeMessage.innerText = 'Вы достигли максимального уровня!';
      upgradeMessage.style.display = 'block';

      setTimeout(() => {
        upgradeMessage.style.display = 'none';
      }, 1500);
    }
  });

  // Открытие окна улучшений (при клике на itemUp2)
  itemUp2.addEventListener('click', () => {
    containerUpBuy2.style.display = 'block';
    overlay.style.display = 'block';
  });

  // Закрытие окна улучшений
  closeButton2.addEventListener('click', () => {
    containerUpBuy2.style.display = 'none';
    overlay.style.display = 'none';
  });

  // Закрытие окна при клике на overlay
  overlay.addEventListener('click', () => {
    containerUpBuy2.style.display = 'none';
    overlay.style.display = 'none';
  });
});


localStorage.setItem('level', 1);
localStorage.setItem('coinsPerClick', 1);