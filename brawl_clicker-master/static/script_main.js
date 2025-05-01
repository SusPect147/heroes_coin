document.addEventListener('DOMContentLoaded', () => {
  const clickButton = document.getElementById('clickButton');
  const currentScoreElement = document.querySelector('.currentScore');
  const progressBar = document.querySelector('#progressBar');
  const progressLabel = document.querySelector('#progressLabel');
  const energyDisplay = document.querySelector('#energyDisplay');
  const coinContainer = document.querySelector('#coinContainer');

  // Проверка наличия всех необходимых элементов
  if (!clickButton) console.error("Element with ID 'clickButton' not found.");
  if (!currentScoreElement) console.error("Element with class 'currentScore' not found.");
  if (!progressBar) console.error("Element with ID 'progressBar' not found.");
  if (!progressLabel) console.error("Element with ID 'progressLabel' not found.");
  if (!energyDisplay) console.error("Element with ID 'energyDisplay' not found.");
  if (!coinContainer) console.error("Element with ID 'coinContainer' not found.");

  let progress = 0;
  const maxProgress = 100;
  let leagueLevel = 0;
  let clicksPerLevel = 10;

  window.energy = parseInt(localStorage.getItem('currentEnergy'), 10) || 100;
  window.maxEnergy = parseInt(localStorage.getItem('maxEnergy'), 10) || 100;
  const energyCost = 1;
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
    if (energyDisplay) energyDisplay.textContent = `${Math.round(window.energy)}/${window.maxEnergy}`;
  }

  const savedProgress = localStorage.getItem('currentProgress');
  if (savedProgress !== null) {
    progress = parseFloat(savedProgress);
    if (progressBar) progressBar.style.width = `${progress}%`;
  }

  // Восстановление персонажа и градиента при загрузке
  const savedCharacterImg = localStorage.getItem('selectedCharacterImg');
  if (savedCharacterImg && clickButton) clickButton.src = savedCharacterImg;

  const savedGradient = localStorage.getItem('backgroundGradient');
  if (savedGradient) {
    document.body.style.backgroundImage = savedGradient;
  } else {
    document.body.style.backgroundImage = 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2), transparent 70%)';
  }

  window.updateClickButtonImage = (imgSrc) => {
    const cleanSrc = imgSrc.includes('brawl_clicker-master/static/images/') ? imgSrc : `brawl_clicker-master/static/images/${imgSrc}`;
    if (clickButton) clickButton.src = cleanSrc;
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
    if (energyDisplay) energyDisplay.textContent = `${Math.round(window.energy)}/${window.maxEnergy}`;
  }

  setInterval(recoverEnergy, 50);

  function handleTap(event) {
    if (window.energy >= energyCost) {
      let score = parseInt(currentScoreElement?.innerText) || 0;
      score += window.coinsPerClick;
      updateScore(score);

      const progressIncrement = (maxProgress / clicksPerLevel) * window.coinsPerClick;
      progress = Math.min(progress + progressIncrement, maxProgress);
      if (progressBar) progressBar.style.width = `${progress}%`;
      localStorage.setItem('currentProgress', progress);

      window.energy = Math.max(window.energy - energyCost, 0);
      if (energyDisplay) energyDisplay.textContent = `${Math.round(window.energy)}/${window.maxEnergy}`;

      const selectedCharacter = localStorage.getItem('selectedCharacter') || 'default';
      spawnEffect(selectedCharacter, event);

      if (progress === maxProgress) {
        updateLeague();
        progress = 0;
        if (progressBar) progressBar.style.width = '0%';
        localStorage.setItem('currentProgress', 0);
      }
    } else {
      console.warn('Not enough energy to tap.');
    }
  }

  // Обработчики событий для анимации
  if (clickButton) {
    clickButton.addEventListener('mousedown', (event) => {
      console.log('mousedown event triggered');
      clickButton.classList.add('active');
      handleTap(event);
    });

    clickButton.addEventListener('mouseup', () => {
      console.log('mouseup event triggered');
      clickButton.classList.remove('active');
    });

    clickButton.addEventListener('touchstart', (event) => {
      console.log('touchstart event triggered');
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
      console.log('touchend event triggered');
      clickButton.classList.remove('active');
    });
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

    body.style.backgroundImage = newGradient;
    body.style.backgroundSize = 'cover';
    body.style.backgroundAttachment = 'fixed';
    body.style.backgroundPosition = 'center';

    if (clickButton) clickButton.src = characterSrc;

    localStorage.setItem('selectedCharacterImg', characterSrc);
    localStorage.setItem('backgroundGradient', newGradient);
  }

  function spawnEffect(selectedCharacter, event) {
    if (!event.clientX || !event.clientY) {
      console.warn('Event coordinates are missing:', event);
      return;
    }
    console.log('Spawning effect at:', event.clientX, event.clientY);
    const effect = document.createElement('img');
    effect.src = 'https://em-content.zobj.net/source/telegram/386/collision_1f4a5.webp';
    effect.className = 'click-effect';
    effect.setAttribute('draggable', 'false');
    effect.style.left = `${event.clientX}px`;
    effect.style.top = `${event.clientY}px`;
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
  }

  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.expand();
    tg.ready();
    const user = tg.initDataUnsafe?.user;
    if (user) {
      console.log(`Привет, ${user.first_name} ${user.last_name || ''}! ID: ${user.id}`);
    } else {
      console.log('Данные пользователя недоступны.');
    }
  } else {
    console.warn('Telegram WebApp is not available.');
  }
});