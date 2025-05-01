document.addEventListener('DOMContentLoaded', () => {
  const clickButton = document.getElementById('clickButton');
  const currentScoreElement = document.querySelector('.currentScore');
  const progressBar = document.querySelector('#progressBar');
  const progressLabel = document.querySelector('#progressLabel');
  const energyDisplay = document.querySelector('#energyDisplay');
  const coinContainer = document.querySelector('#coinContainer');

  let progress = 0;
  const maxProgress = 100;
  let leagueLevel = 0;
  let clicksPerLevel = 10;

  window.energy = parseInt(localStorage.getItem('currentEnergy'), 10) || 500;
  window.maxEnergy = parseInt(localStorage.getItem('maxEnergy'), 10) || 500;
  const energyCost = 10;
  window.energyRecoveryRate = parseInt(localStorage.getItem('energyRecoveryRate'), 10) || 5;
  window.coinsPerClick = 1;

  const savedCoinsPerClick = localStorage.getItem('coinsPerClick');
  if (savedCoinsPerClick) window.coinsPerClick = parseInt(savedCoinsPerClick, 10);

  const savedLeagueLevel = localStorage.getItem('leagueLevel');
  if (savedLeagueLevel !== null) {
    leagueLevel = parseInt(savedLeagueLevel, 10);
    setLeagueBackground(leagueLevel);
  }

  const savedEnergy = localStorage.getItem('currentEnergy');
  if (savedEnergy !== null) {
    window.energy = parseInt(savedEnergy, 10);
    energyDisplay.textContent = `${Math.round(window.energy)}/${window.maxEnergy}`;
  }

  const savedProgress = localStorage.getItem('currentProgress');
  if (savedProgress !== null) {
    progress = parseFloat(savedProgress);
    progressBar.style.width = `${progress}%`;
  }

  // Восстановление персонажа и градиента при загрузке
  const savedCharacterImg = localStorage.getItem('selectedCharacterImg');
  if (savedCharacterImg) clickButton.src = savedCharacterImg;

  const savedGradient = localStorage.getItem('backgroundGradient');
  if (savedGradient) {
    document.body.style.backgroundImage = savedGradient;
  } else {
    document.body.style.backgroundImage = 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2), transparent 70%)';
  }

  window.updateClickButtonImage = (imgSrc) => {
    const cleanSrc = imgSrc.includes('brawl_clicker-master/static/images/') ? imgSrc : `brawl_clicker-master/static/images/${imgSrc}`;
    clickButton.src = cleanSrc;
    localStorage.setItem('selectedCharacterImg', cleanSrc);
  };

  window.updateCoinsPerClick = (newCoinsPerClick) => {
    window.coinsPerClick = newCoinsPerClick;
    localStorage.setItem('coinsPerClick', newCoinsPerClick);
    const coinsPerClickDisplay = document.getElementById('coinsPerClickDisplay');
    if (coinsPerClickDisplay) coinsPerClickDisplay.textContent = `Монет за клик: ${window.coinsPerClick}`;
  };

  window.updateEnergyRecoveryRate = (newRate) => {
    window.energyRecoveryRate = newRate;
    localStorage.setItem('energyRecoveryRate', newRate);
    const energyRecoveryRateDisplay = document.getElementById('energyRecoveryRateDisplay');
    if (energyRecoveryRateDisplay) energyRecoveryRateDisplay.textContent = `Скорость восстановления энергии: ${newRate}`;
  };

  function recoverEnergy() {
    window.energy = Math.min(window.energy + window.energyRecoveryRate / 10, window.maxEnergy);
    energyDisplay.textContent = `${Math.round(window.energy)}/${window.maxEnergy}`;
  }

  setInterval(recoverEnergy, 50);

  function handleTap(event) {
    if (window.energy >= energyCost) {
      let score = parseInt(currentScoreElement.innerText) || 0;
      score += window.coinsPerClick;
      updateScore(score);

      const progressIncrement = (maxProgress / clicksPerLevel) * window.coinsPerClick;
      progress = Math.min(progress + progressIncrement, maxProgress);
      progressBar.style.width = `${progress}%`;
      localStorage.setItem('currentProgress', progress);

      window.energy = Math.max(window.energy - energyCost, 0);
      energyDisplay.textContent = `${Math.round(window.energy)}/${window.maxEnergy}`;

      const selectedCharacter = localStorage.getItem('selectedCharacter');
      spawnEffect(selectedCharacter, event);

      if (progress === maxProgress) {
        updateLeague();
        progress = 0;
        progressBar.style.width = '0%';
        localStorage.setItem('currentProgress', 0);
      }
    }
  }

  // Обработчики событий для анимации
  if (clickButton) {
    clickButton.addEventListener('mousedown', (event) => {
      clickButton.classList.add('active');
      handleTap(event);
    });

    clickButton.addEventListener('mouseup', () => {
      clickButton.classList.remove('active');
    });

    clickButton.addEventListener('touchstart', (event) => {
      event.preventDefault();
      clickButton.classList.add('active');
      const touches = event.touches;
      for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const rect = clickButton.getBoundingClientRect();
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          const tapEvent = { clientX: touch.clientX, clientY: touch.clientY };
          handleTap(tapEvent);
        }
      }
    });

    clickButton.addEventListener('touchend', () => {
      clickButton.classList.remove('active');
    });
  } else {
    console.error("Element with ID 'clickButton' not found.");
  }

  function updateScore(newScore) {
    const scoreElements = document.querySelectorAll('.currentScore');
    scoreElements.forEach((element) => element.innerText = newScore);
    localStorage.setItem('currentScore', newScore);
  }

  function updateLeague() {
    leagueLevel++;
    localStorage.setItem('leagueLevel', leagueLevel);
    setLeagueBackground(leagueLevel);
  }

  function setLeagueBackground(level) {
    const body = document.body;
    let characterSrc = '';
    let newGradient = '';

    switch (level) {
      case 1:
        progressLabel.innerText = 'Ледяной мир';
        clicksPerLevel = 5;
        characterSrc = 'https://em-content.zobj.net/source/telegram/386/automobile_1f697.webp';
        newGradient = 'radial-gradient(circle at 50% 50%, rgba(255, 99, 71, 0.2), transparent 70%)';
        break;
      case 2:
        progressLabel.innerText = 'Адский мир';
        clicksPerLevel = 6;
        characterSrc = 'https://em-content.zobj.net/source/telegram/386/locomotive_1f682.webp';
        newGradient = 'radial-gradient(circle at 50% 50%, rgba(255, 165, 0, 0.2), transparent 70%)';
        break;
      case 3:
        progressLabel.innerText = 'Китай';
        clicksPerLevel = 7;
        characterSrc = 'https://em-content.zobj.net/source/telegram/386/airplane_2708-fe0f.webp';
        newGradient = 'radial-gradient(circle at 50% 50%, rgba(135, 206, 235, 0.2), rgba(255, 255, 255, 0.1), transparent 70%)';
        break;
      case 4:
        progressLabel.innerText = 'Водный мир';
        clicksPerLevel = 8;
        characterSrc = 'https://em-content.zobj.net/source/telegram/386/rocket_1f680.webp';
        newGradient = 'radial-gradient(circle at 50% 50%, rgba(255, 140, 0, 0.2), rgba(30, 144, 255, 0.2), transparent 70%)';
        break;
      case 5:
        progressLabel.innerText = 'Мистика';
        clicksPerLevel = 8;
        characterSrc = 'https://em-content.zobj.net/source/telegram/386/moai_1f5ff.webp';
        newGradient = 'radial-gradient(circle at 50% 50%, rgba(128, 128, 128, 0.2), transparent 70%)';
        break;
      case 6:
        progressLabel.innerText = 'Кубический мир';
        clicksPerLevel = 10;
        characterSrc = 'https://em-content.zobj.net/source/telegram/386/alien_1f47d.webp';
        newGradient = 'radial-gradient(circle at 50% 50%, rgba(50, 205, 50, 0.2), transparent 70%)';
        break;
      case 7:
        progressLabel.innerText = 'Тьма';
        clicksPerLevel = 11;
        characterSrc = 'https://em-content.zobj.net/source/telegram/386/robot_1f916.webp';
        newGradient = 'radial-gradient(circle at 50% 50%, rgba(70, 130, 180, 0.2), rgba(169, 169, 169, 0.2), transparent 70%)';
        break;
      case 8:
        progressLabel.innerText = 'Космос';
        clicksPerLevel = 12;
        characterSrc = 'https://em-content.zobj.net/source/telegram/386/automobile_1f697.webp';
        newGradient = 'radial-gradient(circle at 50% 50%, rgba(255, 99, 71, 0.2), transparent 70%)';
        break;
      case 9:
        progressLabel.innerText = 'Темнота';
        clicksPerLevel = 13;
        characterSrc = 'https://em-content.zobj.net/source/telegram/386/locomotive_1f682.webp';
        newGradient = 'radial-gradient(circle at 50% 50%, rgba(255, 165, 0, 0.2), transparent 70%)';
        break;
      case 10:
        progressLabel.innerText = 'НЛО';
        clicksPerLevel = 14;
        characterSrc = 'https://em-content.zobj.net/source/telegram/386/airplane_2708-fe0f.webp';
        newGradient = 'radial-gradient(circle at 50% 50%, rgba(135, 206, 235, 0.2), rgba(255, 255, 255, 0.1), transparent 70%)';
        break;
      default:
        progressLabel.innerText = 'Деревня';
        leagueLevel = 0;
        clicksPerLevel = 5;
        characterSrc = 'https://em-content.zobj.net/source/telegram/386/video-game_1f3ae.webp';
        newGradient = 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2), transparent 70%)';
    }

    // Установка только градиента
    body.style.backgroundImage = newGradient;
    body.style.backgroundSize = 'cover';
    body.style.backgroundAttachment = 'fixed';
    body.style.backgroundPosition = 'center';

    // Установка персонажа
    clickButton.src = characterSrc;

    // Сохранение персонажа и градиента
    localStorage.setItem('selectedCharacterImg', characterSrc);
    localStorage.setItem('backgroundGradient', newGradient);
  }

  function spawnEffect(selectedCharacter, event) {
    const effects = {
      "1": spawnCoinDrop,
      "2": createGhostEffect,
      "3": createLeafEffect,
      "4": createStoneEffect,
      "5": createFireEffect,
      "6": createWaterEffect,
      "7": createGodEffect,
      "8": createMagicEffect,
      "9": createHeartEffect,
      "10": createAnanasEffect,
      "11": createFrogEffect,
      "12": createRedEffect,
      "13": createDarkEffect,
      "14": createFishEffect,
      "15": createMinionEffect
    };
    if (effects[selectedCharacter]) effects[selectedCharacter](event);
  }

  function spawnCoinDrop(event) {
    const coin = document.createElement('div');
    coin.classList.add('coin_drop');
    coin.style.left = `${event.clientX - 20}px`;
    coin.style.top = `${event.clientY - 20}px`;
    coinContainer.appendChild(coin);
    coin.addEventListener('animationend', () => coin.remove());
  }
});

// Оставшиеся функции эффектов остаются без изменений
function createGhostEffect(event) {
  const ghost = document.createElement('div');
  ghost.classList.add('ghost-effect');
  const x = event.clientX;
  const y = event.clientY;
  ghost.style.left = `${x - 25}px`;
  ghost.style.top = `${y - 25}px`;
  document.body.appendChild(ghost);
  setTimeout(() => {
    ghost.remove();
  }, 1000);
}

function createLeafEffect(event) {
  const leaf = document.createElement('div');
  leaf.classList.add('leaf-effect');
  const x = event.clientX;
  const y = event.clientY;
  leaf.style.left = `${x - 25}px`;
  leaf.style.top = `${y - 25}px`;
  document.body.appendChild(leaf);
  setTimeout(() => {
    leaf.remove();
  }, 1000);
}

function createStoneEffect(event) {
  const stone = document.createElement('div');
  stone.classList.add('stone-effect');
  const x = event.clientX;
  const y = event.clientY;
  stone.style.left = `${x - 25}px`;
  stone.style.top = `${y - 25}px`;
  document.body.appendChild(stone);
  setTimeout(() => {
    stone.remove();
  }, 1000);
}

function createFireEffect(event) {
  const fire = document.createElement('div');
  fire.classList.add('fire-effect');
  const x = event.clientX;
  const y = event.clientY;
  fire.style.left = `${x - 25}px`;
  fire.style.top = `${y - 25}px`;
  document.body.appendChild(fire);
  setTimeout(() => {
    fire.remove();
  }, 1000);
}

function createWaterEffect(event) {
  const water = document.createElement('div');
  water.classList.add('water-effect');
  const x = event.clientX;
  const y = event.clientY;
  water.style.left = `${x - 25}px`;
  water.style.top = `${y - 25}px`;
  water.style.backgroundImage = 'url("brawl_clicker-master/static/images/water.png")';
  document.body.appendChild(water);
  setTimeout(() => {
    water.remove();
  }, 1000);
}

function createGodEffect(event) {
  const god = document.createElement('div');
  god.classList.add('god-effect');
  const x = event.clientX;
  const y = event.clientY;
  god.style.left = `${x - 25}px`;
  god.style.top = `${y - 25}px`;
  document.body.appendChild(god);
  setTimeout(() => {
    god.remove();
  }, 1000);
}

function createMagicEffect(event) {
  const magic = document.createElement('div');
  magic.classList.add('magic-effect');
  const x = event.clientX;
  const y = event.clientY;
  magic.style.left = `${x - 25}px`;
  magic.style.top = `${y - 25}px`;
  document.body.appendChild(magic);
  setTimeout(() => {
    magic.remove();
  }, 1000);
}

function createHeartEffect(event) {
  const heart = document.createElement('div');
  heart.classList.add('heart-effect');
  const x = event.clientX;
  const y = event.clientY;
  heart.style.left = `${x - 25}px`;
  heart.style.top = `${y - 25}px`;
  document.body.appendChild(heart);
  setTimeout(() => {
    heart.remove();
  }, 1000);
}

function createAnanasEffect(event) {
  const ananas = document.createElement('div');
  ananas.classList.add('ananas-effect');
  const x = event.clientX;
  const y = event.clientY;
  ananas.style.left = `${x - 25}px`;
  ananas.style.top = `${y - 25}px`;
  document.body.appendChild(ananas);
  setTimeout(() => {
    ananas.remove();
  }, 1000);
}

function createFrogEffect(event) {
  const frog = document.createElement('div');
  frog.classList.add('frog-effect');
  const x = event.clientX;
  const y = event.clientY;
  frog.style.left = `${x - 25}px`;
  frog.style.top = `${y - 25}px`;
  document.body.appendChild(frog);
  setTimeout(() => {
    frog.remove();
  }, 1000);
}

function createRedEffect(event) {
  const red = document.createElement('div');
  red.classList.add('red-effect');
  const x = event.clientX;
  const y = event.clientY;
  red.style.left = `${x - 25}px`;
  red.style.top = `${y - 25}px`;
  document.body.appendChild(red);
  setTimeout(() => {
    red.remove();
  }, 1000);
}

function createDarkEffect(event) {
  const dark = document.createElement('div');
  dark.classList.add('dark-effect');
  const x = event.clientX;
  const y = event.clientY;
  dark.style.left = `${x - 25}px`;
  dark.style.top = `${y - 25}px`;
  document.body.appendChild(dark);
  setTimeout(() => {
    dark.remove();
  }, 1000);
}

function createFishEffect(event) {
  const fish = document.createElement('div');
  fish.classList.add('fish-effect');
  const x = event.clientX;
  const y = event.clientY;
  fish.style.left = `${x - 25}px`;
  fish.style.top = `${y - 25}px`;
  document.body.appendChild(fish);
  setTimeout(() => {
    fish.remove();
  }, 1000);
}

function createMinionEffect(event) {
  const minion = document.createElement('div');
  minion.classList.add('minion-effect');
  const x = event.clientX;
  const y = event.clientY;
  minion.style.left = `${x - 25}px`;
  minion.style.top = `${y - 25}px`;
  document.body.appendChild(minion);
  setTimeout(() => {
    minion.remove();
  }, 1000);
}

const tg = window.Telegram.WebApp;
window.Telegram.WebApp.expand();
tg.ready();

const user = Telegram.WebApp.initDataUnsafe.user;
if (user) {
  console.log(`Привет, ${user.first_name} ${user.last_name || ''}! ID: ${user.id}`);
} else {
  console.log('Данные пользователя недоступны.');
}
