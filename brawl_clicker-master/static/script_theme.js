document.addEventListener('DOMContentLoaded', () => {
  const previewImage = document.getElementById('preview-image');
  const previewName = document.getElementById('background-preview-name');
  const backgroundOptions = document.querySelectorAll('.background-option');
  const selectButton = document.getElementById('background-select-button');
  const resetButton = document.getElementById('background-reset-button');

  let currentSelectedBackground = null;

  // Функция для предпросмотра фона
  backgroundOptions.forEach(option => {
    option.addEventListener('click', () => {
      const imgSrc = option.getAttribute('data-img');
      const name = option.getAttribute('data-name');

      // Обновляем предпросмотр
      previewImage.src = imgSrc;
      previewName.textContent = name;

      // Убираем выделение с других опций
      backgroundOptions.forEach(option => option.classList.remove('selected'));

      // Выделяем текущую
      option.classList.add('selected');
      currentSelectedBackground = option;
    });
  });

  // Функция для применения выбранного фона
  selectButton.addEventListener('click', () => {
    if (!currentSelectedBackground) {
      alert('Выберите фон перед применением!');
      return;
    }

    const imgSrc = currentSelectedBackground.getAttribute('data-img');
    document.body.style.backgroundImage = `url('${imgSrc}')`;

    // Сохраняем выбранный фон в localStorage
    localStorage.setItem('selectedBackground', imgSrc);
  });

  // Функция для сброса фона
  resetButton.addEventListener('click', () => {
    document.body.style.backgroundImage = '';
    localStorage.removeItem('selectedBackground');
    alert('Фон сброшен!');
  });

  // Проверка сохраненного фона при загрузке страницы
  const savedBackground = localStorage.getItem('selectedBackground');
  if (savedBackground) {
    document.body.style.backgroundImage = `url('${savedBackground}')`;
  }
});

// Применение фона на всех страницах при загрузке
window.addEventListener('load', () => {
  const savedBackground = localStorage.getItem('selectedBackground');
  if (savedBackground) {
    document.body.style.backgroundImage = `url('${savedBackground}')`;
  }
});
