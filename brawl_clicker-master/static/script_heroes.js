window.addEventListener('DOMContentLoaded', () => {
  const characters = document.querySelectorAll('.character');
  const preview = document.getElementById('preview');
  const previewImg = preview.querySelector('img');
  const characterDescription = document.getElementById('character-description');
  const selectButton = document.getElementById('select-button');

  const shopBox = document.querySelector('.shop_box');
  const overlayBox1 = document.querySelector('.overlay_box1');
  const containerBox1 = document.querySelector('.container_box_1');
  const containerBox11 = document.querySelector('.container_box_11');
  const closeButtonBox1 = document.querySelector('.close-button_box1');
  const closeRewardButton = document.querySelector('.close-reward-button');
  const upgradeButtonBox1 = document.querySelector('.upgrade-button_box1');
  const rewardImage = document.getElementById('rewardImage');

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
    // Массив персонажей, которых нужно заблокировать
    const charactersToLock = [

    ];

    // Проходим по каждому из персонажей в массиве и блокируем их
    charactersToLock.forEach(hero => {
      const character = document.querySelector(`.character[data-id="${hero.id}"]`);
      if (character) {
        character.classList.add('locked'); // Добавляем класс 'locked'
        character.setAttribute('data-locked', 'true'); // Добавляем атрибут блокировки
      }
    });
  }

  // Функция для разблокировки персонажа
  function unlockCharacter(characterId) {
    const character = document.querySelector(`.character[data-id="${characterId}"]`);
    if (character) {
      character.classList.remove('locked'); // Убираем класс 'locked'
      character.removeAttribute('data-locked'); // Убираем атрибут блокировки
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

    // Выбираем случайного персонажа
    const randomHero = heroes[Math.floor(Math.random() * heroes.length)];

    // Показываем окно с выпавшим героем
    containerBox11.style.display = 'block';
    rewardImage.src = randomHero.img;
    rewardImage.alt = 'Выпавший герой';

    // Разблокировка персонажа после выпадения
    unlockCharacter(randomHero.id);  // Разблокируем персонажа
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
      const description = character.getAttribute('data-description');

      previewImg.src = imgSrc;
      characterDescription.textContent = description;

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
    const name = currentPreviewCharacter.getAttribute('data-name'); // Эта переменная не используется
    const description = currentPreviewCharacter.getAttribute('data-description');
    const characterId = currentPreviewCharacter.getAttribute('data-id');

    localStorage.setItem('selectedCharacter', characterId);
    localStorage.setItem('selectedCharacterImg', imgSrc);
    localStorage.setItem('selectedCharacterName', name); // И эта тоже
    localStorage.setItem('selectedCharacterDescription', description);

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
