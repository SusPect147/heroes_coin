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

  window.energy = parseInt(localStorage.getItem('currentEnergy'), 10) || 100;
  window.maxEnergy = parseInt(localStorage.getItem('maxEnergy'), 10) || 100;
  const energyCost = 10;
  window.energyRecoveryRate = parseInt(localStorage.getItem('energyRecoveryRate'), 10) || 5;
  window.coinsPerClick = 1;

  const savedCoinsPerClick = localStorage.getItem('coinsPerClick');
  if (savedCoinsPerClick) {
    window.coinsPerClick = parseInt(savedCoinsPerClick, 10);
  }

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

  const savedCharacterImg = localStorage.getItem('selectedCharacterImg');
  if (savedCharacterImg) {
    clickButton.src = savedCharacterImg;
  }

  window.updateClickButtonImage = (imgSrc) => {
    const clickButton = document.getElementById('clickButton');
    if (clickButton) {
      clickButton.src = `brawl_clicker-master/static/images/${imgSrc}`;
    }
  };

  window.updateCoinsPerClick = (newCoinsPerClick) => {
    window.coinsPerClick = newCoinsPerClick;
    localStorage.setItem('coinsPerClick', newCoinsPerClick);
    const coinsPerClickDisplay = document.getElementById('coinsPerClickDisplay');
    if (coinsPerClickDisplay) {
      coinsPerClickDisplay.textContent = `Монет за клик: ${window.coinsPerClick}`;
    }
  };

  window.updateEnergyRecoveryRate = (newRate) => {
    window.energyRecoveryRate = newRate;
    localStorage.setItem('energyRecoveryRate', newRate);
    const energyRecoveryRateDisplay = document.getElementById('energyRecoveryRateDisplay');
    if (energyRecoveryRateDisplay) {
      energyRecoveryRateDisplay.textContent = `Скорость восстановления энергии: ${newRate}`;
    }
  };

  function recoverEnergy() {
    const recoveryRate = window.energyRecoveryRate;
    window.energy = Math.min(window.energy + recoveryRate / 10, window.maxEnergy);
    energyDisplay.textContent = `${Math.round(window.energy)}/${window.maxEnergy}`;
  }

  setInterval(recoverEnergy, 50);

  clickButton.onclick = (event) => {
    if (window.energy >= energyCost) {
      try {
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

        if (selectedCharacter === "1") {
          spawnCoinDrop(event);
        } else if (selectedCharacter === "2") {
          createGhostEffect(event);
        } else if (selectedCharacter === "3") {
          createLeafEffect(event);
        } else if (selectedCharacter === "4") {
          createStoneEffect(event);
        } else if (selectedCharacter === "5") {
          createFireEffect(event);
        } else if (selectedCharacter === "6") {
          createWaterEffect(event);
        } else if (selectedCharacter === "7") {
          createGodEffect(event);
        } else if (selectedCharacter === "8") {
          createMagicEffect(event);
        } else if (selectedCharacter === "9") {
          createHeartEffect(event);
        } else if (selectedCharacter === "10") {
          createAnanasEffect(event);
        } else if (selectedCharacter === "11") {
          createFrogEffect(event);
        } else if (selectedCharacter === "12") {
          createRedEffect(event);
        } else if (selectedCharacter === "13") {
          createDarkEffect(event);
        } else if (selectedCharacter === "14") {
          createFishEffect(event);
        } else if (selectedCharacter === "15") {
          createMinionEffect(event);
        }

        if (progress === maxProgress) {
          updateLeague();
          progress = 0;
          progressBar.style.width = '0%';
          localStorage.setItem('currentProgress', 0);
        }
      } catch (error) {
        console.error("Ошибка при обновлении счета:", error);
      }
    }
  };

  function updateScore(newScore) {
    const scoreElements = document.querySelectorAll('.currentScore');
    scoreElements.forEach((element) => {
      element.innerText = newScore;
    });
    localStorage.setItem('currentScore', newScore);
  }

  function updateLeague() {
    leagueLevel++;
    localStorage.setItem('leagueLevel', leagueLevel);
    setLeagueBackground(leagueLevel);
  }

  function setLeagueBackground(level) {
    const body = document.body;
    let backgroundImage = '';

    switch (level) {
      case 1:
        progressLabel.innerText = 'Ледяной мир';
        clicksPerLevel = 5;
        backgroundImage = 'brawl_clicker-master/static/images/ice.png';
        break;
      case 2:
        progressLabel.innerText = 'Адский мир';
        clicksPerLevel = 6;
        backgroundImage = 'brawl_clicker-master/static/images/ad.png';
        break;
      case 3:
        progressLabel.innerText = 'Китай';
        clicksPerLevel = 7;
        backgroundImage = 'brawl_clicker-master/static/images/china.png';
        break;
      case 4:
        progressLabel.innerText = 'Водный мир';
        clicksPerLevel = 8;
        backgroundImage = 'brawl_clicker-master/static/images/water_world.png';
        break;
      case 5:
        progressLabel.innerText = 'Мистика';
        clicksPerLevel = 8;
        backgroundImage = 'brawl_clicker-master/static/images/mystical.png';
        break;
      case 6:
        progressLabel.innerText = 'Кубический мир';
        clicksPerLevel = 10;
        backgroundImage = 'brawl_clicker-master/static/images/minecraft.png';
        break;
      case 7:
        progressLabel.innerText = 'Тьма';
        clicksPerLevel = 11;
        backgroundImage = 'brawl_clicker-master/static/images/dark.png';
        break;
      case 8:
        progressLabel.innerText = 'Космос';
        clicksPerLevel = 12;
        backgroundImage = 'brawl_clicker-master/static/images/cosmos.png';
        break;
      case 9:
        progressLabel.innerText = 'Темнота';
        clicksPerLevel = 13;
        backgroundImage = 'brawl_clicker-master/static/images/dark_2.png';
        break;
      case 10:
        progressLabel.innerText = 'НЛО';
        clicksPerLevel = 14;
        backgroundImage = 'brawl_clicker-master/static/images/plat.png';
        break;
      default:
        progressLabel.innerText = 'Деревня';
        leagueLevel = 0;
        clicksPerLevel = 5;
        backgroundImage = 'brawl_clicker-master/static/images/hogwarts.png';
    }

    body.style.backgroundImage = `url("${backgroundImage}")`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundAttachment = 'fixed';
    progressLabel.style.backgroundImage = `url("${backgroundImage}")`;
    progressLabel.style.backgroundSize = 'cover';
    progressLabel.style.backgroundPosition = 'center';

    if (backgroundImage === 'brawl_clicker-master/static/images/hogwarts.png' || backgroundImage === 'brawl_clicker-master/static/images/ice.png') {
      body.style.backgroundPosition = 'center calc(50% - 12vh)';
    } else {
      body.style.backgroundPosition = 'center';
    }

    localStorage.setItem('backgroundImage', backgroundImage);
  }

  function spawnCoinDrop(event) {
    const coin = document.createElement('div');
    coin.classList.add('coin_drop');
    coin.style.left = `${event.clientX - 20}px`;
    coin.style.top = `${event.clientY - 20}px`;
    coinContainer.appendChild(coin);
    coin.addEventListener('animationend', () => coin.remove());
  }

  clickButton.addEventListener('click', () => {
    clickButton.classList.add('active');
    setTimeout(() => clickButton.classList.remove('active'), 300);
  });
});

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
  water.style.backgroundImage = 'brawl_clicker-master/static/images/water.png';
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

function createSpark() {
  const currentBackground = document.body.style.backgroundImage;
  if (currentBackground !== 'url("brawl_clicker-master/static/images/ad.png")') {
    return;
  }
  let spark = document.createElement("div");
  spark.classList.add("spark");
  document.body.appendChild(spark);
  let size = Math.random() * 2 + 6;
  spark.style.width = size + "px";
  spark.style.height = size + "px";
  let colors = ["#FFD700"];
  let glowColor = colors[Math.floor(Math.random() * colors.length)];
  spark.style.background = `radial-gradient(circle, ${glowColor} 10%, rgba(255, 0, 0, 1) 80%)`;
  spark.style.boxShadow = `0px 0px 50px ${glowColor}, 0px 0px 100px ${glowColor}`;
  spark.style.left = Math.random() * window.innerWidth + "px";
  spark.style.top = window.innerHeight + "px";
  let duration = Math.random() * 1.5 + 1.5;
  spark.style.animationDuration = duration + "s";
  setTimeout(() => spark.remove(), duration * 1000);
}

setInterval(createSpark, 500);

const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const snowflakes = [];
const numFlakes = 100;
let animationFrameId = null;

class Snowflake {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 3 + 1;
    this.speed = Math.random() * 1 + 0.2;
    this.wind = Math.random() * 0.5 - 0.25;
  }

  update() {
    this.y += this.speed;
    this.x += this.wind;
    if (this.y > canvas.height) {
      this.y = -this.radius;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }
}

for (let i = 0; i < numFlakes; i++) {
  snowflakes.push(new Snowflake());
}

function animateSnow() {
  if (!isSnowEnabled()) {
    cancelAnimationFrame(animationFrameId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snowflakes.forEach(flake => {
    flake.update();
    flake.draw();
  });
  animationFrameId = requestAnimationFrame(animateSnow);
}

function isSnowEnabled() {
  return getComputedStyle(document.body).backgroundImage.includes('brawl_clicker-master/static/images/ice.png');
}

const observer = new MutationObserver(() => {
  if (isSnowEnabled()) {
    if (!animationFrameId) {
      animateSnow();
    }
  } else {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

if (isSnowEnabled()) {
  animateSnow();
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  snowflakes.forEach(flake => flake.reset());
});
