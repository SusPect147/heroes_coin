document.addEventListener("DOMContentLoaded", function() {
    const menuButtons = document.querySelectorAll(".nav-button");
    const pages = document.querySelectorAll(".page");

    function initializeScore() {
        const storedScore = parseInt(localStorage.getItem('currentScore')) || 0;
        updateScoreDisplay(storedScore);
    }

    function hideAllPages() {
        pages.forEach(page => {
            page.style.display = "none";
        });
    }

    function deactivateAllButtons() {
        menuButtons.forEach(button => {
            button.classList.remove("active");
        });
    }

    menuButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            deactivateAllButtons();
            this.classList.add("active");
            hideAllPages();
            const pageId = this.getAttribute("data-page");
            const activePage = document.getElementById(pageId);
            activePage.style.display = "block";
            if (pageId === 'shop') {
                loadContent('special');
            }
        });
    });

    const marketNavButtons = document.querySelectorAll('.market-nav-button');
    if (marketNavButtons.length > 0) {
        marketNavButtons.forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.market-nav-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                document.querySelectorAll('.market-tab-content').forEach(content => content.classList.remove('active'));
                const tabId = button.getAttribute('data-tab');
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });

        const availableSkinsTab = document.getElementById('available-skins');
        if (availableSkinsTab) {
            availableSkinsTab.classList.add('active');
        }
    }

    initializeScore();
});

const menuIcon = document.getElementById('menu-icon');
const dropdownMenu = document.getElementById('dropdown-menu');

if (menuIcon && dropdownMenu) {
    menuIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', (event) => {
        if (!menuIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('active');
        }
    });
}

function loadContent(section) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    const activeSection = document.getElementById(section);
    if (activeSection) {
        activeSection.style.display = 'block';
    }
}