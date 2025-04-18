window.addEventListener('DOMContentLoaded', () => {
  const characters = document.querySelectorAll('.character');
  const preview = document.getElementById('preview');
  const previewImg = preview ? preview.querySelector('img') : null;
  const selectButton = document.getElementById('select-button');
  const clickButton = document.getElementById('clickButton'); // Добавляем элемент clickButton

  const shopBox = document.querySelector('.shop_box');
  const overlayBox1 = document.querySelector('.overlay_box1');
  const containerBox1 = document.querySelector('.container_box_1');
  const containerBox11 = document.querySelector('.container_box_11');
  const closeButtonBox1 = document.querySelector('.close-button_box1');
  const closeRewardButton = document.querySelector('.close-reward-button');
  const upgradeButtonBox1 = document.querySelector('.upgrade-button_box1');
  const rewardImage = document.getElementById('rewardImage');

  // Проверка на наличие всех необходимых элементов
  if (!characters.length) {
    console.error("No elements with class 'character' found.");
    return;
  }
  if (!preview) {
    console.error("Element with ID 'preview' not found.");
    return;
  }
  if (!previewImg) {
    console.error("Image element inside 'preview' not found.");
    return;
  }
  if (!selectButton) {
    console.error("Element with ID 'select-button' not found.");
    return;
  }
  if (!clickButton) {
    console.error("Element with ID 'clickButton' not found.");
    return;
  }
  if (!shopBox || !overlayBox1 || !containerBox1 || !containerBox11 || !closeButtonBox1 || !closeRewardButton || !upgradeButtonBox1 || !rewardImage) {
    console.error("One or more DOM elements for shop/reward are missing. Please check your HTML.");
    return;
  }

  // Список героев с ID
  const heroes = [
    { id: "1", img: "brawl_clicker-master/static/images/croco.png", name: "Character 1" },
    { id: "2", img: "brawl_clicker-master/static/images/cot.png", name: "Character 2" },
    { id: "3", img: "brawl_clicker-master/static/images/groot.png", name: "Character 3" },
    { id: "4", img: "brawl_clicker-master/static/images/golem.png", name: "Character 4" },
    { id: "5", img: "brawl_clicker-master/static/images/fire.png", name: "Character 5" },
    { id: "6", img: "brawl_clicker-master/static/images/water.png", name: "Character 6" },
    { id: "7", img: "brawl_clicker-master/static/images/tor.png", name: "Character 7" },
    { id: "8", img: "brawl_clicker-master/static/images/witch.png", name: "Character 8" },
    { id: "9", img: "brawl_clicker-master/static/images/angel.png", name: "Character 9" },
    { id: "10", img: "brawl_clicker-master/static/images/ananas.png", name: "Character 10" },
    { id: "11", img: "brawl_clicker-master/static/images/frog.png", name: "Character 11" },
    { id: "12", img: "brawl_clicker-master/static/images/leon.png", name: "Character 12" },
    { id: "13", img: "brawl_clicker-master/static/images/syth.png", name: "Character 13" },
    { id: "14", img: "brawl_clicker-master/static/images/cat.png", name: "Character 14" },
    { id: "15", img: "brawl_clicker-master/static/images/minion.png", name: "Character 15" },
  ];

  // Функция для блокировки персонажей
  function lockSpecificCharacters() {
    const charactersToLock = [];
    charactersToLock.forEach(hero => {
      const character = document.querySelector(`.character[data-id="${hero.id}"]`);
      if (character) {
        character.classList.add('locked');
        character.setAttribute('data-locked', 'true');
      }
    });
  }

  // Функция для разблокировки персонажа
  function unlockCharacter(characterId) {
    const character = document.querySelector(`.character[data-id="${characterId}"]`);
    if (character) {
      character.classList.remove('locked');
      character.removeAttribute('data-locked');
    }
  }

  // Блокируем персонажей при загрузке
  lockSpecificCharacters();

  // Открытие окна сундука
  shopBox.addEventListener('click', () => {
    overlayBox1.style.display = 'block';
    containerBox1.style.display = 'block';
  });

  // Закрытие окна при нажатии на кнопку закрытия
  closeButtonBox1.addEventListener('click', () => {
    overlayBox1.style.display = 'none';
    containerBox1.style.display = 'none';
  });

  // Закрытие окна при клике на слой затемнения
  overlayBox1.addEventListener('click', () => {
    overlayBox1.style.display = 'none';
    containerBox1.style.display = 'none';
  });

  // Открытие сундука
  upgradeButtonBox1.addEventListener('click', () => {
    containerBox1.style.display = 'none';
    const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
    containerBox11.style.display = 'block';
    rewardImage.src = randomHero.img;
    rewardImage.alt = 'Выпавший герой';
    unlockCharacter(randomHero.id);
  });

  // Закрытие окна с выпавшим героем
  closeRewardButton.addEventListener('click', () => {
    overlayBox1.style.display = 'none';
    containerBox11.style.display = 'none';
  });

  let currentPreviewCharacter = null;
  let selectedCharacter = null;

  characters.forEach(character => {
    character.addEventListener('click', () => {
      const imgSrc = character.getAttribute('data-img');

      // Отладка: проверяем, что получаем атрибут
      console.log(`Clicked character: data-img=${imgSrc}`);

      if (!imgSrc) {
        console.error("Character is missing 'data-img' attribute:", character);
        return;
      }

      previewImg.src = imgSrc;

      // Отладка: проверяем, что изображение загружается
      previewImg.onerror = () => {
        console.error(`Failed to load image: ${imgSrc}`);
      };
      previewImg.onload = () => {
        console.log(`Image loaded successfully: ${imgSrc}`);
      };

      if (currentPreviewCharacter) {
        currentPreviewCharacter.classList.remove('selected-preview');
      }

      character.classList.add('selected-preview');
      currentPreviewCharacter = character;
    });
  });

  selectButton.addEventListener('click', () => {
    if (!currentPreviewCharacter) {
      alert('Выберите персонажа!');
      return;
    }

    if (currentPreviewCharacter.classList.contains('locked')) {
      alert('Этот персонаж заблокирован. Откройте его через сундук!');
      return;
    }

    const imgSrc = currentPreviewCharacter.getAttribute('data-img');
    const name = currentPreviewCharacter.getAttribute('data-name');
    const characterId = currentPreviewCharacter.getAttribute('data-id');

    localStorage.setItem('selectedCharacter', characterId);
    localStorage.setItem('selectedCharacterImg', imgSrc);
    localStorage.setItem('selectedCharacterName', name);

   if (selectedCharacter) {
      selectedCharacter.classList.remove('selected');
    }

    currentPreviewCharacter.classList.remove('selected-preview');
    currentPreviewCharacter.classList.add('selected');
    selectedCharacter = currentPreviewCharacter;

    if (window.updateClickButtonImage) {
      window.updateClickButtonImage(imgSrc);
    }
  });
});