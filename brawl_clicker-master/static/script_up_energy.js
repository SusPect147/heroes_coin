document.addEventListener('DOMContentLoaded', () => {
  const itemUp3 = document.querySelector('.item_up3');
  const containerUpBuy3 = document.querySelector('.container_up_buy_3');
  const overlay3 = document.querySelector('.overlay_3');
  const closeButton3 = document.querySelector('.close-button_3');
  const upgradeButton3 = document.querySelector('.upgrade-button_3');
  const upgradeMessage3 = document.createElement('div'); // Сообщение
  const itemDetails3 = document.querySelector('.item_up3 .item-details_3');
  const coinElement3 = document.querySelector('.coin_up3');
  const currentScoreElements3 = document.querySelectorAll('.currentScore');

  // Добавляем сообщение на страницу
  upgradeMessage3.classList.add('upgrade-message');
  upgradeMessage3.style.display = 'none';
  document.body.appendChild(upgradeMessage3);

  // Массив цен для каждого уровня улучшения энергии (теперь 5 уровней)
  const upgradePricesEnergy = [2000, 5000, 15000, 30000, 60000]; // Цены на улучшения для 5 уровней
  let energyLevel = parseInt(localStorage.getItem('energyLevel'), 10) || 1; // Уровень энергии
  const maxEnergyLevel = upgradePricesEnergy.length; // Максимальный уровень (5 уровней)

  // Инициализация глобальных переменных для энергии
  window.energy = parseInt(localStorage.getItem('currentEnergy'), 10) || 100; // Начальная энергия = 100
  window.maxEnergy = parseInt(localStorage.getItem('maxEnergy'), 10) || 100;

  // Функция обновления отображения уровня энергии и стоимости
  function updateEnergyDetails() {
    console.log(`Текущая энергия: ${window.energy}, Максимальная энергия: ${window.maxEnergy}`);

    if (itemDetails3) {
      itemDetails3.textContent = `${window.maxEnergy} • Уровень ${energyLevel}`;
    }

    if (coinElement3) {
      coinElement3.textContent = energyLevel < maxEnergyLevel ? upgradePricesEnergy[energyLevel - 1] : "Максимум";
    }
  }

  // Функция обновления счета
  function updateScore(newScore) {
    currentScoreElements3.forEach((element) => {
      element.innerText = newScore;
    });
    localStorage.setItem('currentScore', newScore); // Сохраняем баланс монет в localStorage
  }

  // Восстановление энергии до максимума
  function restoreEnergy() {
    window.energy = window.maxEnergy;  // Устанавливаем текущую энергию равной максимальной
    localStorage.setItem('currentEnergy', window.energy); // Сохраняем текущую энергию
    updateEnergyDetails(); // Обновляем интерфейс
  }

  // Инициализация интерфейса
  updateEnergyDetails();

  // Обработка нажатия кнопки улучшения энергии
  upgradeButton3.addEventListener('click', () => {
    const currentScore = parseInt(localStorage.getItem('currentScore')) || 0;
    const currentPriceEnergy = upgradePricesEnergy[energyLevel - 1];

    // Если достаточно монет и не достигнут максимальный уровень
    if (currentScore >= currentPriceEnergy && energyLevel < maxEnergyLevel) {
      // Обновляем счет
      updateScore(currentScore - currentPriceEnergy);

      // Показ сообщения об успешном улучшении
      upgradeMessage3.textContent = `Максимальная энергия увеличена до ${window.maxEnergy + 50}!`;
      upgradeMessage3.style.display = 'block';

      setTimeout(() => {
        upgradeMessage3.style.display = 'none';
      }, 1500);

      // Закрытие окна улучшения
      containerUpBuy3.style.display = 'none';
      overlay3.style.display = 'none';

      // Увеличиваем уровень энергии
      energyLevel++;
      localStorage.setItem('energyLevel', energyLevel);

      // Увеличиваем максимальную энергию в зависимости от уровня
      window.maxEnergy += 50; // Прибавляем 20 к максимальной энергии за каждый уровень
      localStorage.setItem('maxEnergy', window.maxEnergy);

      // Восстанавливаем энергию до максимума сразу
      restoreEnergy();

      // Обновляем интерфейс с новыми значениями
      updateEnergyDetails();
    } else if (energyLevel >= maxEnergyLevel) {
      // Если максимальный уровень достигнут
      upgradeMessage3.textContent = 'Вы достигли максимального уровня!';
      upgradeMessage3.style.display = 'block';

      setTimeout(() => {
        upgradeMessage3.style.display = 'none';
      }, 1500);
    } else {
      // Если недостаточно монет
      upgradeMessage3.textContent = 'У вас недостаточно средств для улучшения!';
      upgradeMessage3.style.display = 'block';

      setTimeout(() => {
        upgradeMessage3.style.display = 'none';
      }, 1500);
    }
  });

  // Открытие окна улучшения
  itemUp3.addEventListener('click', () => {
    containerUpBuy3.style.display = 'block';
    overlay3.style.display = 'block';
  });

  // Закрытие окна улучшения
  closeButton3.addEventListener('click', () => {
    containerUpBuy3.style.display = 'none';
    overlay3.style.display = 'none';
  });

  // Закрытие окна при клике на затемнение
  overlay3.addEventListener('click', () => {
    containerUpBuy3.style.display = 'none';
    overlay3.style.display = 'none';
  });

  // Обновляем интерфейс в случае изменений
  updateEnergyDetails();
});

// Сброс энергии до 0
localStorage.setItem('currentEnergy', 0); // Сброс текущей энергии
localStorage.setItem('maxEnergy', 100); // Установка начальной максимальной энергии (например, 100)
localStorage.setItem('energyLevel', 1); // Установка начального уровня энергии
