// ============================================
// Общая конфигурация режимов
// ============================================
const MODES = Object.freeze({
    JQUERY: 'jquery',
    VANILLA: 'vanilla'
});

let activeMode = MODES.JQUERY;
let jqueryUiInitialized = false;

function isMode(mode) {
    return activeMode === mode;
}

function applyModeEffects(mode) {
    if (document.body) {
        document.body.dataset.jsMode = mode;
    }
    if (mode === MODES.JQUERY) {
        initJqueryUIFeatures();
        const draggableEl = document.getElementById('draggable');
        if (draggableEl) {
            draggableEl.style.transform = '';
            draggableEl.style.opacity = '1';
        }
    } else {
        destroyJqueryUIFeatures();
    }
    document.dispatchEvent(new CustomEvent('jsmodechange', { detail: { mode } }));
    console.info(`Активирован режим: ${mode}`);
}

function setActiveMode(mode) {
    if (!Object.values(MODES).includes(mode) || mode === activeMode) {
        return;
    }
    activeMode = mode;
    applyModeEffects(mode);
}

function initModeSwitcher() {
    const controls = document.querySelectorAll('input[name="js-mode"]');
    controls.forEach(control => {
        control.addEventListener('change', () => {
            if (control.checked) {
                setActiveMode(control.value);
            }
        });
    });
    const checked = document.querySelector('input[name="js-mode"]:checked');
    if (checked && checked.value !== activeMode) {
        activeMode = checked.value;
    }
    applyModeEffects(activeMode);
}

document.addEventListener('DOMContentLoaded', initModeSwitcher);

function initJqueryUIFeatures() {
    if (typeof $ === 'undefined' || jqueryUiInitialized) {
        return;
    }

    const $draggable = $('#draggable');
    const $datepicker = $('#datepicker');

    if ($draggable.length) {
        $draggable
            .css({ top: '', left: '', position: '' })
            .draggable({
                containment: 'body',
                cursor: 'move',
                opacity: 0.8,
                revert: false
            });
    }

    if ($datepicker.length) {
        $datepicker.datepicker({
            dateFormat: 'dd.mm.yy',
            firstDay: 1,
            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            showButtonPanel: true,
            changeMonth: true,
            changeYear: true
        });
    }

    jqueryUiInitialized = true;
}

function destroyJqueryUIFeatures() {
    if (typeof $ === 'undefined' || !jqueryUiInitialized) {
        return;
    }

    const $draggable = $('#draggable');
    if ($draggable.length && $draggable.data('ui-draggable')) {
        $draggable.draggable('destroy').css({ top: '', left: '', position: '' });
    }

    const $datepicker = $('#datepicker');
    if ($datepicker.length && $datepicker.hasClass('hasDatepicker')) {
        $datepicker.datepicker('destroy').val('');
    }

    jqueryUiInitialized = false;
}

// ============================================
// Проверка загрузки jQuery
// ============================================
$(document).ready(function() {
    if (!isMode(MODES.JQUERY)) {
        return;
    }
    console.log('jQuery готов к работе!');
    $('body').css('background-color', '#f9f9f9');
});

// ============================================
// ЗАДАЧА A: ВКЛАДКИ (TABS)
// ============================================

// Решение на jQuery
$(document).ready(function() {
    $('.tab-btn').click(function() {
        if (!isMode(MODES.JQUERY)) {
            return;
        }
        // Удалить класс active у всех кнопок и контента
        $('.tab-btn').removeClass('active');
        $('.tab-content').removeClass('active');
        
        // Добавить класс active нажатой кнопке
        $(this).addClass('active');
        
        // Получить значение data-tab
        const tabId = $(this).data('tab');
        
        // Найти элемент по ID и добавить класс active
        $('#' + tabId).addClass('active');
    });
});

// Решение на Vanilla JS
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!isMode(MODES.VANILLA)) {
                return;
            }
            // Удалить класс active у всех кнопок
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Удалить класс active у всего контента
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Добавить класс active нажатой кнопке
            this.classList.add('active');
            
            // Получить значение data-tab
            const tabId = this.dataset.tab;
            
            // Найти элемент по ID и добавить класс active
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});

// ============================================
// ЗАДАЧА B: ПЛАВНАЯ ПРОКРУТКА К ЯКОРЮ
// ============================================

// Решение на jQuery
$(document).ready(function() {
    $('a[href^="#"]').click(function(e) {
        if (!isMode(MODES.JQUERY)) {
            return;
        }
        e.preventDefault();
        
        const target = $(this.getAttribute('href'));
        
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 50
            }, 500);
        }
    });
});

// Решение на Vanilla JS
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!isMode(MODES.VANILLA)) {
                return;
            }
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ============================================
// ЗАДАЧА C: AJAX ЗАПРОСЫ
// ============================================

// Решение на jQuery
$(document).ready(function() {
    $('#loadQuote').click(function() {
        if (!isMode(MODES.JQUERY)) {
            return;
        }
        $.get('https://api.quotable.io/random', function(data) {
            $('#quote .quote-text').text(data.content);
            $('#quote .quote-author').text('— ' + data.author);
        }).fail(function() {
            $('#quote .quote-text').text('Ошибка загрузки цитаты. Попробуйте позже.');
            $('#quote .quote-author').text('');
        });
    });
});

// Решение на Vanilla JS
document.addEventListener('DOMContentLoaded', function() {
    const loadQuoteBtn = document.getElementById('loadQuote');
    const quoteText = document.querySelector('#quote .quote-text');
    const quoteAuthor = document.querySelector('#quote .quote-author');
    
    if (loadQuoteBtn) {
        loadQuoteBtn.addEventListener('click', function() {
            if (!isMode(MODES.VANILLA)) {
                return;
            }
            fetch('https://api.quotable.io/random')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка сети');
                    }
                    return response.json();
                })
                .then(data => {
                    quoteText.textContent = data.content;
                    quoteAuthor.textContent = '— ' + data.author;
                })
                .catch(error => {
                    quoteText.textContent = 'Ошибка загрузки цитаты. Попробуйте позже.';
                    quoteAuthor.textContent = '';
                    console.error('Ошибка:', error);
                });
        });
    }
});

// ============================================
// ЗАДАЧА D: JQUERY UI
// ============================================

// ============================================
// ДОПОЛНИТЕЛЬНО: Vanilla JS для drag-and-drop
// (для сравнения сложности)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const draggableElement = document.getElementById('draggable');
    
    if (draggableElement) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        
        draggableElement.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        
        function dragStart(e) {
            if (!isMode(MODES.VANILLA)) {
                return;
            }
            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
            
            if (e.target === draggableElement || draggableElement.contains(e.target)) {
                isDragging = true;
                draggableElement.style.opacity = '0.8';
            }
        }
        
        function drag(e) {
            if (!isMode(MODES.VANILLA)) {
                return;
            }
            if (isDragging) {
                e.preventDefault();
                
                if (e.type === 'touchmove') {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }
                
                xOffset = currentX;
                yOffset = currentY;
                
                setTranslate(currentX, currentY, draggableElement);
            }
        }
        
        function dragEnd(e) {
            if (!isMode(MODES.VANILLA)) {
                return;
            }
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            draggableElement.style.opacity = '1';
        }
        
        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }
    }
});


