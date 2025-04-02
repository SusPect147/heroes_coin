document.addEventListener("DOMContentLoaded", function() {
  const menuButtons = document.querySelectorAll(".nav-button");
  const pages = document.querySelectorAll(".page");

  // Предзагрузка всех изображений
  function preloadImages() {
    // Собираем все изображения со страницы
    const images = document.querySelectorAll("img");
    const imageSources = Array.from(images).map(img => img.src);

    // Можно также вручную указать пути к изображениям, если они не все в HTML
    const additionalImages = [
      "path/to/background1.jpg",
      "path/to/background2.jpg",
      // Добавь свои фоны или картинки для мини-игр
    ];

    // Объединяем списки
    const allImages = [...imageSources, ...additionalImages];

    // Предзагружаем изображения
    allImages.forEach(src => {
      const img = new Image(); // Создаем объект изображения
      img.src = src; // Присваиваем источник, что запускает загрузку
    });
  }

  // Восстановление значений из localStorage (при загрузке страницы)
  function initializeScore() {
    const storedScore = parseInt(localStorage.getItem('currentScore')) || 0;
    updateScoreDisplay(storedScore);
  }

  // Функция для скрытия всех страниц
  function hideAllPages() {
    pages.forEach(page => {
      page.style.display = "none"; // Скрываем все страницы
    });
  }

  // Функция для деактивации всех кнопок меню
  function deactivateAllButtons() {
    menuButtons.forEach(button => {
      button.classList.remove("active"); // Убираем активный класс
    });
  }

  // Обработчик кликов по кнопкам меню
  menuButtons.forEach(button => {
    button.addEventListener("click", function(event) {
      event.preventDefault();

      // Деактивируем все кнопки
      deactivateAllButtons();

      // Активируем текущую кнопку
      this.classList.add("active");

      // Скрываем все страницы
      hideAllPages();

      // Получаем id страницы из атрибута data-page
      const pageId = this.getAttribute("data-page");

      // Отображаем нужную страницу
      const activePage = document.getElementById(pageId);
      activePage.style.display = "block"; // Показываем нужную страницу
    });
  });

  // Вызываем предзагрузку изображений и инициализацию счета при загрузке
  preloadImages();
  initializeScore();
});

// Менюшка
const menuIcon = document.getElementById('menu-icon');
const dropdownMenu = document.getElementById('dropdown-menu');

// Переключение видимости меню при клике на картинку
menuIcon.addEventListener('click', (event) => {
  event.stopPropagation(); // Предотвращаем всплытие события
  dropdownMenu.classList.toggle('active');
});

// Закрываем меню, если кликнули вне его
document.addEventListener('click', (event) => {
  if (!menuIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.remove('active');
  }
});

// Функция для загрузки содержимого по вкладке
function loadContent(section) {
  // Скрываем все секции
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.style.display = 'none';
  });

  // Показываем нужную секцию
  const activeSection = document.getElementById(section);
  if (activeSection) {
    activeSection.style.display = 'block';
  }
}