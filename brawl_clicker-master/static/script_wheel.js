document.addEventListener('DOMContentLoaded', () => {
  if (typeof lottie === 'undefined') {
    console.error("Lottie library is not loaded. Please include lottie.min.js.");
    return;
  }

  const spinButton = document.getElementById('spinButton');
  const rewardModal = document.getElementById('rewardModal');
  const rewardText = document.getElementById('rewardText');
  const closeModalButton = document.getElementById('closeModalButton');
  const prizeList = document.getElementById('prizeList');
  const betButtons = document.querySelectorAll('.bet-button');
  const spinCostDisplay = document.getElementById('spinCost');

  let selectedBet = 1;
  let spinCost = 150;

  const prizes = [
    { type: 'gift', name: "Подарок 1", value: 150, animationPath: "brawl_clicker-master/static/static/images/May1.json" },
    { type: 'gift', name: "Подарок 2", value: 100, animationPath: "brawl_clicker-master/static/images/Kettle.json" },
    { type: 'gift', name: "Подарок 3", value: 1000, animationPath: "brawl_clicker-master/static/images/Tiffany.json" },
    { type: 'gift', name: "Подарок 4", value: 60, animationPath: "brawl_clicker-master/static/images/Pepe.json" },
    { type: 'gift', name: "Подарок 5", value: 200, animationPath: "brawl_clicker-master/static/images/Bear.json" }
  ];

  const totalItems = 30;
  for (let i = 0; i < totalItems; i++) {
    const prizeIndex = i % prizes.length;
    const prizeItem = document.createElement('div');
    prizeItem.className = 'prize-item';

    const prize = prizes[prizeIndex];
    if (prize.animationPath) {
      const animationContainer = document.createElement('div');
      animationContainer.id = `anim-${i}`;
      prizeItem.appendChild(animationContainer);

      try {
        lottie.loadAnimation({
          container: animationContainer,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: prize.animationPath,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
          }
        }).addEventListener('data_failed', () => {
          console.error(`Failed to load animation for prize ${prizeIndex} at path: ${prize.animationPath}`);
        });
      } catch (error) {
        console.error(`Error loading animation for prize ${prizeIndex}:`, error);
      }
    } else if (prize.img) {
      const prizeImg = document.createElement('img');
      prizeImg.src = prize.img;
      prizeImg.className = 'prize-img';
      prizeImg.onerror = () => console.error(`Failed to load image for prize ${prizeIndex} at path: ${prize.img}`);
      prizeItem.appendChild(prizeImg);
    }

    prizeList.appendChild(prizeItem);
  }

  function updateSpinButtonState(score) {
    spinButton.disabled = score < spinCost;
  }

  function updateScore(newScore) {
    localStorage.setItem('currentScore', newScore);
    updateSpinButtonState(newScore);
  }

  betButtons.forEach(button => {
    button.addEventListener('click', () => {
      betButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      selectedBet = parseInt(button.getAttribute('data-bet'));
      spinCost = parseInt(button.getAttribute('data-cost'));
      spinCostDisplay.textContent = spinCost;
      updateSpinButtonState(parseInt(localStorage.getItem('currentScore')) || 0);
    });
  });

spinButton.addEventListener('click', () => {
  let score = parseInt(localStorage.getItem('currentScore')) || 0;
  if (score < spinCost) {
    console.warn('Not enough coins to spin.');
    return;
  }

  spinButton.disabled = true;
  score -= spinCost;
  updateScore(score);

  prizeList.style.transition = 'none';
  prizeList.style.transform = 'translateX(0)';

  const prizeIndex = Math.floor(Math.random() * prizes.length);
  const prize = prizes[prizeIndex];
  let rewardValue = prize.value;

const itemWidth = 200; // ширина одного приза в пикселях
const targetIndex = Math.floor(totalItems / 2) + prizeIndex;

const containerWidth = prizeList.parentElement.offsetWidth; // ширина видимой области
const centerOffset = (containerWidth / 2) - (itemWidth / 2); // сдвиг чтобы элемент оказался по центру
const offset = -(targetIndex * itemWidth) + centerOffset;

setTimeout(() => {
  prizeList.style.transition = 'transform 3s ease-out';
  prizeList.style.transform = `translateX(${offset}px)`;
}, 50);

  setTimeout(() => {
    if (prize.type === 'coins') {
      rewardValue *= selectedBet;
      score += rewardValue;
      updateScore(score);
      rewardText.textContent = `Вы получили монеты: +${rewardValue}`;
    } else if (prize.type === 'gift') {
      rewardText.textContent = `Вы получили подарок: ${prize.name} (${rewardValue}★)`;
    }

    rewardModal.style.display = 'flex';
    spinButton.disabled = false;
  }, 3000);
});


  closeModalButton.addEventListener('click', () => {
    rewardModal.style.display = 'none';
  });
});
