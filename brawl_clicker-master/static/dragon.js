document.addEventListener('DOMContentLoaded', () => {
    // Существующие элементы и переменные (оставляем как есть)
    const currentScoreElement = document.querySelector('.currentScore');
    let totalCoins = parseInt(localStorage.getItem('totalCoins')) || 0;
    currentScoreElement.textContent = totalCoins;

    // Переменная для монет за очко в мини-играх
    window.coinsPerPoint = parseInt(localStorage.getItem('coinsPerPoint')) || 1;
    let coinsPerPointLevel = parseInt(localStorage.getItem('coinsPerPointLevel')) || 1;

    // Функция обновления монет
    function updateScore(newScore) {
        totalCoins = newScore;
        const scoreElements = document.querySelectorAll('.currentScore');
        scoreElements.forEach((element) => element.innerText = totalCoins);
        localStorage.setItem('totalCoins', totalCoins);
    }

    // Логика магазина улучшений
    const upgradeItems = {
        autoclick: { button: '.item_up1', overlay: '.overlay_1', container: '.container_up_buy_1', priceElement: '.coin_up1', buyButton: '.upgrade-button_1', closeButton: '.close-button_1', basePrice: 2000, levelElement: '.item-details_1' },
        click: { button: '.item_up2', overlay: '.overlay', container: '.container_up_buy_2', priceElement: '.coin_up', buyButton: '.upgrade-button_2', closeButton: '.close-button_2', basePrice: 1000, levelElement: '.item-details' },
        energy: { button: '.item_up3', overlay: '.overlay_3', container: '.container_up_buy_3', priceElement: '.coin_up3', buyButton: '.upgrade-button_3', closeButton: '.close-button_3', basePrice: 2000, levelElement: '.item-details_3' },
        recharge: { button: '.item_up4', overlay: '.overlay_4', container: '.container_up_buy_4', priceElement: '.coin_up4', buyButton: '.upgrade-button_4', closeButton: '.close-button_4', basePrice: 2000, levelElement: '.item-details_4' },
        coinsPerPoint: { button: '.item_up5', overlay: '.overlay_5', container: '.container_up_buy_5', priceElement: '.coin_up5', buyButton: '.upgrade-button_5', closeButton: '.close-button_5', basePrice: 1500, levelElement: '.item-details_5' }
    };

    // Инициализация уровней
    Object.keys(upgradeItems).forEach(key => {
        const level = parseInt(localStorage.getItem(`${key}Level`)) || 1;
        const item = upgradeItems[key];
        const levelElement = document.querySelector(item.levelElement);
        if (key === 'autoclick') {
            levelElement.textContent = `${item.basePrice} / 1h • Level ${level}`;
        } else {
            levelElement.textContent = `${level} • Level ${level}`;
        }
        const priceElement = document.querySelector(item.priceElement);
        priceElement.textContent = item.basePrice * level;
    });

    // Обработчики для открытия окон
    Object.keys(upgradeItems).forEach(key => {
        const item = upgradeItems[key];
        const button = document.querySelector(item.button);
        const overlay = document.querySelector(item.overlay);
        const container = document.querySelector(item.container);
        const closeButton = document.querySelector(item.closeButton);

        button.addEventListener('click', () => {
            overlay.style.display = 'block';
            container.style.display = 'block';
        });

        closeButton.addEventListener('click', () => {
            overlay.style.display = 'none';
            container.style.display = 'none';
        });
    });

    // Покупка улучшений
    function buyUpgrade(key) {
        const item = upgradeItems[key];
        const level = parseInt(localStorage.getItem(`${key}Level`)) || 1;
        const price = item.basePrice * level;
        if (totalCoins >= price) {
            totalCoins -= price;
            updateScore(totalCoins);

            const newLevel = level + 1;
            localStorage.setItem(`${key}Level`, newLevel);
            const priceElement = document.querySelector(item.priceElement);
            priceElement.textContent = item.basePrice * newLevel;
            const levelElement = document.querySelector(item.levelElement);
            if (key === 'autoclick') {
                levelElement.textContent = `${item.basePrice * newLevel} / 1h • Level ${newLevel}`;
            } else {
                levelElement.textContent = `${newLevel} • Level ${newLevel}`;
            }

            // Применение улучшений
            if (key === 'autoclick') {
                // Логика автокликера (уже есть в твоем коде)
            } else if (key === 'click') {
                window.updateCoinsPerClick(newLevel);
            } else if (key === 'energy') {
                window.maxEnergy = 100 + (newLevel - 1) * 50;
                localStorage.setItem('maxEnergy', window.maxEnergy);
            } else if (key === 'recharge') {
                window.updateEnergyRecoveryRate(newLevel * 3);
            } else if (key === 'coinsPerPoint') {
                window.coinsPerPoint = newLevel;
                localStorage.setItem('coinsPerPoint', newLevel);
                localStorage.setItem('coinsPerPointLevel', newLevel);
            }
        } else {
            alert('Недостаточно монет!');
        }
    }

    // Привязка кнопок покупки
    document.querySelector('.upgrade-button_1').addEventListener('click', () => buyUpgrade('autoclick'));
    document.querySelector('.upgrade-button_2').addEventListener('click', () => buyUpgrade('click'));
    document.querySelector('.upgrade-button_3').addEventListener('click', () => buyUpgrade('energy'));
    document.querySelector('.upgrade-button_4').addEventListener('click', () => buyUpgrade('recharge'));
    document.querySelector('.upgrade-button_5').addEventListener('click', () => buyUpgrade('coinsPerPoint'));

    // Существующий код кликера и мини-игр остается без изменений
});