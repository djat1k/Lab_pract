const testimonials = [
    {
        name: 'Екатерина Осипова',
        role: 'CEO',
        company: 'Aurora Tech',
        initials: 'EO'
    },
    {
        name: 'Валентин Карпов',
        role: 'Руководитель маркетинга',
        company: 'Nord.Cloud',
        initials: 'ВК'
    },
    {
        name: 'Антон Долматов',
        role: 'Product Lead',
        company: 'X-Drive',
        initials: 'АД'
    },
    {
        name: 'Ника Рахманова',
        role: 'Head of Growth',
        company: 'FinKit',
        initials: 'НР'
    }
];

const track = document.querySelector('.carousel__track');
const indicatorsContainer = document.querySelector('.carousel__indicators');
const prevButton = document.querySelector('.carousel__control--prev');
const nextButton = document.querySelector('.carousel__control--next');
const trackContainer = document.querySelector('.carousel__track-container');
const themeToggle = document.getElementById('themeToggle');

let currentIndex = 0;
let cardWidth = 0;
const GAP = 24;
let testimonialsWithQuotes = [];
const THEME_STORAGE_KEY = 'preferred-theme';
const Theme = {
    LIGHT: 'light',
    DARK: 'dark'
};

const FALLBACK_QUOTES = [
    'Лучший способ предсказать будущее — создать его.',
    'Не бойтесь идти медленно, бойтесь стоять на месте.',
    'Клиент возвращается туда, где ему комфортно и полезно.',
    'Сильная команда всегда важнее идеальной идеи.',
    'То, что измеряется, улучшается.',
    'Каждый спринт делает продукт сильнее, если есть цель.'
];

const QUOTE_SOURCES = [
    {
        name: 'dummyjson',
        url: () => 'https://dummyjson.com/quotes/random',
        parse: (data) => data?.quote
    },
    {
        name: 'adviceslip',
        url: () => `https://api.adviceslip.com/advice?timestamp=${Date.now()}`,
        parse: (data) => data?.slip?.advice
    },
    {
        name: 'typefit',
        url: () => 'https://type.fit/api/quotes',
        parse: (data, raw) => {
            const list = Array.isArray(data)
                ? data
                : (() => {
                      try {
                          return JSON.parse(raw);
                      } catch {
                          return [];
                      }
                  })();
            if (!list.length) {
                return null;
            }
            const randomQuote =
                list[Math.floor(Math.random() * list.length)];
            return randomQuote?.text;
        }
    }
];

const TRANSLATION_API = 'https://api.mymemory.translated.net/get';
const RUSSIAN_LETTERS = /[а-яё]/i;

function getStoredTheme() {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
        return null;
    }
}

function setStoredTheme(theme) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // localStorage может быть недоступен (режим инкогнито и т.д.)
    }
}

function updateThemeToggle(theme) {
    if (!themeToggle) {
        return;
    }
    const isDark = theme === Theme.DARK;
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.textContent = isDark ? 'Светлая тема' : 'Тёмная тема';
}

function applyTheme(theme, { persist = true } = {}) {
    const normalized = theme === Theme.DARK ? Theme.DARK : Theme.LIGHT;
    document.documentElement.setAttribute('data-theme', normalized);
    updateThemeToggle(normalized);
    if (persist) {
        setStoredTheme(normalized);
    }
}

function initTheme() {
    const savedTheme = getStoredTheme();
    const prefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? Theme.DARK : Theme.LIGHT);
    applyTheme(initialTheme, { persist: Boolean(savedTheme) });

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme =
                document.documentElement.getAttribute('data-theme') || Theme.LIGHT;
            const nextTheme =
                currentTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
            applyTheme(nextTheme);
        });
    }
}

function pickFallbackQuote() {
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
}

function requestWithTimeout(url, options = {}, timeoutMs = 6000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    return fetch(url, { ...options, signal: controller.signal }).finally(() =>
        clearTimeout(id)
    );
}

async function requestQuote(source) {
    const response = await requestWithTimeout(source.url(), {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
        mode: 'cors'
    });
    if (!response.ok) {
        throw new Error(`Quote source ${source.name} error (${response.status})`);
    }

    const rawText = await response.text();
    let parsedData = rawText;
    try {
        parsedData = JSON.parse(rawText);
    } catch {
        // оставляем строку, если JSON не распарсился
    }

    const quote = source.parse(parsedData, rawText);
    if (!quote || typeof quote !== 'string') {
        throw new Error(`Quote source ${source.name} returned empty data`);
    }
    return quote.trim();
}

function isRussian(text = '') {
    return RUSSIAN_LETTERS.test(text);
}

function decodeEntities(text = '') {
    return text
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, '’')
        .replace(/&amp;/g, '&');
}

async function translateToRussian(text, timeout = 8000) {
    const url = `${TRANSLATION_API}?q=${encodeURIComponent(
        text
    )}&langpair=en|ru`;
    const response = await requestWithTimeout(
        url,
        { cache: 'no-store' },
        timeout
    );
    if (!response.ok) {
        throw new Error(`Translation API error (${response.status})`);
    }
    const data = await response.json();
    const translated = data?.responseData?.translatedText;
    if (!translated) {
        throw new Error('Translation API returned empty result');
    }
    return decodeEntities(translated).trim();
}

async function ensureRussianQuote(text) {
    if (!text) {
        return pickFallbackQuote();
    }
    if (isRussian(text)) {
        return text;
    }
    try {
        return await translateToRussian(text);
    } catch (error) {
        console.warn('Translation failed, using fallback quote', error);
        return pickFallbackQuote();
    }
}

async function fetchQuote() {
    try {
        const quote = await Promise.any(
            QUOTE_SOURCES.map((source) => requestQuote(source))
        );
        return await ensureRussianQuote(quote);
    } catch (error) {
        console.warn('All quote sources failed, fallback used', error);
        return pickFallbackQuote();
    }
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function createSlide(testimonial, index) {
    const card = document.createElement('li');
    card.className = 'testimonial-card';
    card.setAttribute('role', 'tabpanel');
    card.setAttribute('aria-hidden', index === currentIndex ? 'false' : 'true');

    card.innerHTML = `
        <p class="testimonial-card__quote">“${testimonial.quote}”</p>
        <div class="testimonial-card__author">
            <div class="testimonial-card__avatar">${testimonial.initials}</div>
            <div class="testimonial-card__info">
                <span class="testimonial-card__name">${testimonial.name}</span>
                <span class="testimonial-card__role">${testimonial.role}, ${testimonial.company}</span>
            </div>
        </div>
    `;

    return card;
}

function createIndicator(index) {
    const button = document.createElement('button');
    button.className = 'carousel__indicator';
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-label', `Показать отзыв ${index + 1}`);
    button.dataset.index = String(index);
    if (index === currentIndex) {
        button.setAttribute('aria-selected', 'true');
    } else {
        button.setAttribute('aria-selected', 'false');
    }

    button.addEventListener('click', () => goToSlide(index));
    return button;
}

function updateQuoteText(index, quoteText) {
    const cards = track.querySelectorAll('.testimonial-card');
    const card = cards[index];
    if (!card) return;
    const quoteEl = card.querySelector('.testimonial-card__quote');
    if (quoteEl) {
        quoteEl.textContent = `“${quoteText}”`;
    }
}

function renderCarousel() {
    track.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    testimonialsWithQuotes.forEach((testimonial, index) => {
        track.appendChild(createSlide(testimonial, index));
        indicatorsContainer.appendChild(createIndicator(index));
    });
}

function measureSlides() {
    cardWidth = trackContainer.clientWidth;
    track.querySelectorAll('.testimonial-card').forEach((card) => {
        card.style.minWidth = `${cardWidth}px`;
        card.style.maxWidth = `${cardWidth}px`;
    });
    updateCarousel();
}

function updateCarousel() {
    const offset = -(cardWidth + GAP) * currentIndex;
    track.style.transform = `translateX(${offset}px)`;

    const cards = track.querySelectorAll('.testimonial-card');
    cards.forEach((card, index) => {
        card.setAttribute('aria-hidden', index === currentIndex ? 'false' : 'true');
    });

    const indicators = indicatorsContainer.querySelectorAll('.carousel__indicator');
    indicators.forEach((indicator, index) => {
        indicator.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');
    });

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === testimonialsWithQuotes.length - 1;
}

function goToSlide(index) {
    const maxIndex = testimonialsWithQuotes.length - 1;
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    updateCarousel();
}

prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));

window.addEventListener('resize', () => {
    measureSlides();
});

const MIN_LOADING_TIME = 3000;

async function initCarousel() {
    testimonialsWithQuotes = testimonials.map((testimonial) => ({
        ...testimonial,
        quote: 'Загрузка...'
    }));

    renderCarousel();
    measureSlides();

    await Promise.all(
        testimonials.map(async (_, index) => {
            const startTime = performance.now();
            const quote = await fetchQuote(200);
            const elapsed = performance.now() - startTime;
            if (elapsed < MIN_LOADING_TIME) {
                await delay(MIN_LOADING_TIME - elapsed);
            }

            testimonialsWithQuotes[index].quote = quote;
            updateQuoteText(index, quote);
        })
    );
}

initCarousel();

// ==================== БЛОК СЛУЧАЙНЫХ ИЗОБРАЖЕНИЙ ====================

async function fetchRandomImage(width = 600, height = 400) {
    const seed = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const url = `https://picsum.photos/seed/${seed}/${width}/${height}`;

    try {
        const response = await fetch(url, { mode: 'cors', cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Image API error (${response.status})`);
        }
        return response.url;
    } catch (error) {
        console.warn('Не удалось загрузить изображение, используем заглушку', error);
        return `https://via.placeholder.com/${width}x${height}/E3E8FF/4B6BFB?text=No+Image`;
    }
}

async function loadRandomImages(count = 6) {
    const container = document.getElementById('images');

    if (!container) {
        console.warn('Контейнер #images не найден');
        return;
    }

    container.innerHTML = '';
    container.setAttribute('aria-busy', 'true');

    const placeholders = Array.from({ length: count }).map(() => {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-card image-card--loading';
        placeholder.textContent = 'Загрузка...';
        container.appendChild(placeholder);
        return placeholder;
    });

    const images = await Promise.all(
        Array.from({ length: count }).map(() => fetchRandomImage(480, 320))
    );

    container.innerHTML = '';

    images.forEach((src) => {
        const figure = document.createElement('figure');
        figure.className = 'image-card';

        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Случайное изображение';
        img.loading = 'lazy';

        figure.appendChild(img);
        container.appendChild(figure);
    });

    container.setAttribute('aria-busy', 'false');
}

document.addEventListener('DOMContentLoaded', () => {
    loadRandomImages(6);
    const refreshBtn = document.getElementById('refreshImages');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => loadRandomImages(6));
    }
});

initTheme();