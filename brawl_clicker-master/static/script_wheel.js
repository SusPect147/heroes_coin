document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('rouletteCanvas');
        const ctx = canvas.getContext('2d');
        const spinButton = document.getElementById('spinButton');
        const rewardModal = document.getElementById('rewardModal');
        const rewardText = document.getElementById('rewardText');
        const closeModalButton = document.getElementById('closeModalButton');

        const sectors = [
            { name: 'Монеты (50 000)', image: 'brawl_clicker-master/static/images/coin.png' },
            { name: 'Leon (бонус)', image: 'brawl_clicker-master/static/images/leon.png' },
            { name: 'Улучшение', image: 'brawl_clicker-master/static/images/fireshot.png' },
            { name: 'Монеты (100 000)', image: 'brawl_clicker-master/static/images/coin.png' },
            { name: 'Скин', image: 'brawl_clicker-master/static/images/icon.png' },
            { name: 'Монеты (25 000)', image: 'brawl_clicker-master/static/images/coin.png' },
            { name: 'Сундук героя', image: 'brawl_clicker-master/static/images/box_1.png' },
            { name: 'Бонусные звёзды', image: 'brawl_clicker-master/static/images/stars.png' }
        ];

        const sectorAngle = (2 * Math.PI) / sectors.length;
        let currentAngle = 0;
        let isSpinning = false;

        // Градиенты для секторов
        const gradients = [
            ['#ff4500', '#ff8c00'], // Оранжевый
            ['#ffd700', '#ffa500'], // Золотой
            ['#00b7eb', '#00ced1'], // Голубой
            ['#32cd32', '#228b22'], // Зелёный
            ['#ff4500', '#ff8c00'],
            ['#ffd700', '#ffa500'],
            ['#00b7eb', '#00ced1'],
            ['#32cd32', '#228b22']
        ];

        // Загрузка изображений
        const images = {};
        let loadedImages = 0;

        sectors.forEach((sector, index) => {
            const img = new Image();
            img.src = sector.image;
            img.onload = () => {
                images[index] = img;
                loadedImages++;
                if (loadedImages === sectors.length) {
                    drawRoulette();
                }
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${sector.image}`);
                loadedImages++;
                if (loadedImages === sectors.length) {
                    drawRoulette();
                }
            };
        });

        function drawRoulette() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(currentAngle);

            sectors.forEach((sector, index) => {
                // Создание радиального градиента
                const gradient = ctx.createRadialGradient(0, 0, canvas.width / 4, 0, 0, canvas.width / 2);
                gradient.addColorStop(0, gradients[index][0]);
                gradient.addColorStop(1, gradients[index][1]);

                // Отрисовка сектора
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, canvas.width / 2, index * sectorAngle, (index + 1) * sectorAngle);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Эффект свечения
                ctx.shadowColor = '#fff';
                ctx.shadowBlur = 10;
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.shadowBlur = 0; // Отключаем свечение для других элементов

                // Отрисовка изображения
                ctx.save();
                ctx.rotate(index * sectorAngle + sectorAngle / 2);
                ctx.translate(canvas.width / 3, 0);
                ctx.rotate(Math.PI / 2);
                if (images[index]) {
                    ctx.drawImage(images[index], -40, -40, 80, 80);
                }
                ctx.restore();
            });

            ctx.restore();

            // Отрисовка стрелки
            ctx.beginPath();
            ctx.moveTo(canvas.width - 25, canvas.height / 2 - 20);
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.lineTo(canvas.width - 25, canvas.height / 2 + 20);
            ctx.fillStyle = '#fff';
            ctx.fill();
        }

        function spinRoulette() {
            if (isSpinning) return;
            isSpinning = true;
            spinButton.disabled = true;

            const spinTime = 5000; // 5 секунд
            const startTime = performance.now();
            const randomSector = Math.floor(Math.random() * sectors.length);
            const targetAngle = randomSector * sectorAngle + Math.PI * 4; // 2 полных оборота + случайный сектор

            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / spinTime, 1);
                const easeOut = 1 - (1 - progress) ** 3; // Ease-out анимация
                currentAngle = easeOut * targetAngle;

                drawRoulette();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    isSpinning = false;
                    spinButton.disabled = false;

                    // Вычисление выбранного сектора
                    const normalizedAngle = (currentAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
                    const selectedSectorIndex = Math.floor((2 * Math.PI - normalizedAngle) / sectorAngle) % sectors.length;
                    const selectedSector = sectors[selectedSectorIndex];

                    // Показ модального окна
                    rewardText.textContent = `Вы получили: ${selectedSector.name}!`;
                    rewardModal.style.display = 'flex';
                }
            }

            requestAnimationFrame(animate);
        }

        spinButton.addEventListener('click', spinRoulette);

        closeModalButton.addEventListener('click', () => {
            rewardModal.style.display = 'none';
        });
    });