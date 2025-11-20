// Создаем кнопку "Наверх"
const scrollToTopButton = document.createElement('button');
scrollToTopButton.textContent = 'Наверх';
scrollToTopButton.className = 'scroll-to-top';
scrollToTopButton.setAttribute('aria-label', 'Прокрутить наверх');
document.body.appendChild(scrollToTopButton);

// Функция для показа/скрытия кнопки
function toggleScrollButton() {
    if (window.pageYOffset > 300) {
        scrollToTopButton.classList.add('show');
    } else {
        scrollToTopButton.classList.remove('show');
    }
}

// Обработчик прокрутки страницы
window.addEventListener('scroll', toggleScrollButton);

// Функция плавной прокрутки наверх
function smoothScrollToTop() {
    const startPosition = window.pageYOffset || document.documentElement.scrollTop;
    const duration = 600; // Длительность анимации в миллисекундах
    let startTime = null;
    
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    function animateScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutQuad(progress);
        
        const currentPosition = startPosition * (1 - ease);
        window.scrollTo(0, currentPosition);
        
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }
    
    requestAnimationFrame(animateScroll);
}

// Обработчик клика на кнопку - плавная прокрутка наверх
scrollToTopButton.addEventListener('click', function(e) {
    e.preventDefault();
    smoothScrollToTop();
});

// Проверяем начальное состояние при загрузке страницы
toggleScrollButton();

