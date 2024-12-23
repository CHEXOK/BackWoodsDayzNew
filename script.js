document.addEventListener('DOMContentLoaded', function() {
    // Генерация упорядоченного фона
    function generateBackground() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", "0 0 1920 1080");
        
        // Размер ячейки сетки
        const cellSize = 300;
        const cols = Math.ceil(1920 / cellSize);
        const rows = Math.ceil(1080 / cellSize);
        
        // Создаем треугольники в каждой ячейке
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                
                // Базовая точка в центре ячейки
                const centerX = col * cellSize + cellSize / 2;
                const centerY = row * cellSize + cellSize / 2;
                
                // Случайное смещение центра
                const offsetX = (Math.random() - 0.5) * cellSize * 0.5;
                const offsetY = (Math.random() - 0.5) * cellSize * 0.5;
                
                // Создаем треугольник с случайным поворотом
                const angle = Math.random() * Math.PI * 2;
                const size = cellSize * 0.8; // Немного меньше ячейки
                
                const x1 = centerX + offsetX + Math.cos(angle) * size * 0.5;
                const y1 = centerY + offsetY + Math.sin(angle) * size * 0.5;
                const x2 = centerX + offsetX + Math.cos(angle + Math.PI * 0.8) * size * 0.7;
                const y2 = centerY + offsetY + Math.sin(angle + Math.PI * 0.8) * size * 0.7;
                const x3 = centerX + offsetX + Math.cos(angle - Math.PI * 0.8) * size * 0.7;
                const y3 = centerY + offsetY + Math.sin(angle - Math.PI * 0.8) * size * 0.7;
                
                polygon.setAttribute("points", `${x1},${y1} ${x2},${y2} ${x3},${y3}`);
                
                // Оттенок зависит от позиции
                const baseShade = Math.floor((row + col) / (rows + cols) * 25);
                const shade = baseShade + Math.floor(Math.random() * 10);
                polygon.setAttribute("fill", `rgb(${shade},${shade},${shade})`);
                
                // Меньше вариаций в прозрачности
                polygon.setAttribute("opacity", (Math.random() * 0.2 + 0.8).toString());
                
                svg.appendChild(polygon);
            }
        }
        
        // Конвертируем SVG в строку и создаем URL
        const svgString = new XMLSerializer().serializeToString(svg);
        const encoded = encodeURIComponent(svgString);
        return `url("data:image/svg+xml,${encoded}")`;
    }

    // Применяем фон
    const backgroundOverlay = document.querySelector('.background-overlay');
    backgroundOverlay.style.backgroundImage = generateBackground();

    // Плавная прокрутка к якорям
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth' 
                });

                // Обновление активного пункта меню
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Плавный скролл для всех якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 50; 
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1500; 
                let start = null;
                
                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const progress = Math.min(timeElapsed / duration, 1);
                    const easeInOutCubic = progress < 0.5 
                        ? 4 * progress ** 3 
                        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                    
                    window.scrollTo(0, startPosition + distance * easeInOutCubic);
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }
                
                requestAnimationFrame(animation);
            }
        });
    });

    // Обработчик для копирования IP
    const copyIpButton = document.getElementById('copyIpButton');
    const ipNotificationsContainer = document.getElementById('ipNotificationsContainer');
    const serverIp = document.getElementById('serverIp');

    if (copyIpButton && ipNotificationsContainer && serverIp) {
        copyIpButton.addEventListener('click', () => {
            // Копируем IP
            navigator.clipboard.writeText(serverIp.value).then(() => {
                showNotification('IP успешно скопирован!', 'success');
            }).catch(err => {
                console.error('Ошибка копирования: ', err);
                showNotification('Ошибка копирования', 'error');
            });
        });
    }

    // Обработчик для тестовой кнопки
    const testButton = document.getElementById('testButton');
    const notificationsContainer = document.getElementById('notificationsContainer');

    if (testButton && notificationsContainer) {
        testButton.addEventListener('click', () => {
            showNotification('Уведомление работает!', 'success');
        });
    }

    // Функция показа уведомлений
    function showNotification(message, type = 'success', duration = 3000) {
        // Remove any existing notifications first
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.classList.add('notification', type, 'show');
        
        // Add icon based on notification type
        const icon = document.createElement('i');
        icon.classList.add('fas', type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle');
        notification.appendChild(icon);

        // Add message text
        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;
        notification.appendChild(messageSpan);

        // Append to body
        document.body.appendChild(notification);

        // Set timeout to remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            // Remove from DOM after transition
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }

    // Анимация появления секций при скролле
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.hero-section, .server-features, .connect-section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Функция для обновления активных ссылок при скролле
    function updateActiveNavLinks() {
        const navLinks = document.querySelectorAll('.nav-link:not(.cta-link)');
        const sections = document.querySelectorAll('section[id]');
        
        let currentSection = null;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            
            // Проверяем, если секция видима более чем на 30%
            if (rect.top <= window.innerHeight * 0.3 && rect.bottom >= window.innerHeight * 0.3) {
                currentSection = section;
            }
        });
        
        // Сбрасываем активные состояния
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Устанавливаем активное состояние для соответствующей ссылки
        if (currentSection) {
            const activeLink = document.querySelector(`.nav-link[href="#${currentSection.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    // Debounce function to limit the rate of function execution
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Use debounce for scroll event
    window.addEventListener('scroll', debounce(updateActiveNavLinks, 100));

    // Параллакс-эффект для фона с оптимизацией
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                backgroundOverlay.style.transform = `translateY(${-scrollPosition * 0.1}px)`;
                ticking = false;
            });
            
            ticking = true;
        }
    });

    // Рандомизация углов фона без повторений
    function randomizeBackgroundAngles() {
        const backgroundOverlay = document.querySelector('.background-overlay');
        
        // Массив для хранения уникальных углов
        const uniqueAngles = [];
        
        // Генерируем 4 уникальных угла
        while (uniqueAngles.length < 4) {
            const newAngle = Math.floor(Math.random() * 360);
            
            // Проверяем, что угол еще не использовался
            if (!uniqueAngles.includes(newAngle)) {
                uniqueAngles.push(newAngle);
            }
        }
        
        // Применяем углы к фону
        backgroundOverlay.style.setProperty('--angle1', `${uniqueAngles[0]}deg`);
        backgroundOverlay.style.setProperty('--angle2', `${uniqueAngles[1]}deg`);
        backgroundOverlay.style.setProperty('--angle3', `${uniqueAngles[2]}deg`);
        backgroundOverlay.style.setProperty('--angle4', `${uniqueAngles[3]}deg`);
    }

    // Первичная рандомизация
    randomizeBackgroundAngles();

    // Периодическая рандомизация (каждые 7-10 секунд)
    setInterval(randomizeBackgroundAngles, 7000 + Math.random() * 3000);

    // Добавление плавной прокрутки для логотипа
    document.querySelector('.logo-link').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.hero-section').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Мобильное меню
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Закрытие меню при клике на ссылку
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });

    // Функция получения статистики сервера
    async function updateServerStats() {
        try {
            const serverId = '30487923';
            const response = await fetch(`https://api.battlemetrics.com/servers/${serverId}`);
            const data = await response.json();
            
            const playerCount = data.data.attributes.players;
            const maxPlayers = data.data.attributes.maxPlayers;
            const serverStatus = data.data.attributes.status;
            
            // Обновляем количество игроков
            const playersElement = document.querySelector('.stat-value.players');
            playersElement.textContent = `${playerCount}/${maxPlayers}`;
            
            // Улучшенная визуализация статуса
            const statusElement = document.querySelector('.stat-value.status');
            const statusIndicator = document.querySelector('.server-status-indicator');
            
            if (serverStatus === 'online') {
                statusElement.textContent = 'Активен';
                statusElement.classList.add('online');
                statusElement.classList.remove('offline');
                statusIndicator.classList.add('pulse');
                statusIndicator.style.backgroundColor = '#4CAF50';
            } else {
                statusElement.textContent = 'Недоступен';
                statusElement.classList.remove('online');
                statusElement.classList.add('offline');
                statusIndicator.classList.remove('pulse');
                statusIndicator.style.backgroundColor = '#F44336';
            }
        } catch (error) {
            console.error('Ошибка получения статистики сервера:', error);
            
            document.querySelector('.stat-value.players').textContent = '0/100';
            
            const statusElement = document.querySelector('.stat-value.status');
            const statusIndicator = document.querySelector('.server-status-indicator');
            
            statusElement.textContent = 'Ошибка';
            statusElement.classList.remove('online');
            statusElement.classList.add('offline');
            statusIndicator.classList.remove('pulse');
            statusIndicator.style.backgroundColor = '#FF9800';
        }
    }

    // Обновляем статистику при загрузке и каждые 5 минут
    updateServerStats();
    setInterval(updateServerStats, 5 * 60 * 1000);

    // Функция для копирования IP
    document.getElementById('copyIpButton').addEventListener('click', function() {
        const ipInput = document.getElementById('serverIp');
        const toast = document.getElementById('copyToast');
        
        // Копируем текст
        ipInput.select();
        document.execCommand('copy');
        
        // Показываем уведомление
        toast.classList.add('show');
        
        // Скрываем уведомление через 3 секунды
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    });
});
