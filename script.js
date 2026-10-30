// Глобальная функция для стрелок
function scrollCases(direction) {
    const track = document.getElementById('casesTrack');
    if (!track) return;

    const card = track.querySelector('.case-card');
    if (!card) return;

    const gap = 24;
    const cardWidth = card.offsetWidth + gap;
    const scrollAmount = direction * cardWidth;

    track.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
    const track = document.getElementById('casesTrack');
    const dots = document.querySelectorAll('#sliderDots span');

    if (!track || dots.length === 0) return;

    // Обновление точек при скролле
    track.addEventListener('scroll', function () {
        const scrollLeft = track.scrollLeft;
        const card = track.querySelector('.case-card');
        if (!card) return;

        const cardWidth = card.offsetWidth + 24;
        const index = Math.round(scrollLeft / cardWidth);

        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    });

    // Клик по точке
    dots.forEach(dot => {
        dot.addEventListener('click', function () {
            const index = parseInt(this.dataset.index);
            const card = track.querySelector('.case-card');
            if (!card) return;

            const cardWidth = card.offsetWidth + 24;
            track.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
        });
    });
});

// Анимации при скролле (заготовка)
// Добавь класс .animate-on-scroll к элементам, которые должны анимироваться
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
});

// ========== СЛАЙДЕР REAL CASES ==========
(function () {
    const track = document.querySelector('.cases-track');
    const cards = document.querySelectorAll('.case-card');
    const dotsContainer = document.getElementById('sliderDots');

    if (!track || !cards.length || !dotsContainer) return;

    const dots = dotsContainer.querySelectorAll('span');

    // Клик по точке — скролл к карточке
    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            scrollToCard(index);
        });
    });

    // Скролл к нужной карточке
    function scrollToCard(index) {
        const card = cards[index];
        if (!card) return;
        track.scrollTo({
            left: card.offsetLeft - track.offsetLeft,
            behavior: 'smooth'
        });
    }

    // Обновляем активную точку при скролле
    function updateActiveDot() {
        const trackCenter = track.scrollLeft + track.offsetWidth / 2;
        let activeIndex = 0;
        let minDistance = Infinity;

        cards.forEach((card, i) => {
            const cardCenter = card.offsetLeft - track.offsetLeft + card.offsetWidth / 2;
            const distance = Math.abs(trackCenter - cardCenter);
            if (distance < minDistance) {
                minDistance = distance;
                activeIndex = i;
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });
    }

    // Слушаем скролл
    let scrollTimeout;
    track.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveDot, 50);
    });

    // Инициализация
    updateActiveDot();
})();

// ========== АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ ==========
document.addEventListener('DOMContentLoaded', function () {
    // Находим все элементы, которые нужно анимировать
    const animatedElements = document.querySelectorAll(
        '.hero-content, .hero-img, .stamps-img, ' +
        '.two-trips-header, .compare-card, .mobile-card, ' +
        '.real-cases-title, .case-card, ' +
        '.checklists-title, .checklists-subtitle, .checklist-card, ' +
        '.final-title, .final-visual'
    );

    // Добавляем класс для начального состояния
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    // Intersection Observer — следит за появлением в viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Перестаем следить после появления (анимация один раз)
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,  // Срабатывает, когда 15% элемента видно
        rootMargin: '0px 0px -50px 0px'  // Чуть выше нижнего края
    });

    animatedElements.forEach(el => observer.observe(el));

    // Перезапуск анимации самолёта при скролле к секции
    const twoTripsSection = document.querySelector('.two-trips');
    if (twoTripsSection) {
        const planeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Перезапускаем SVG-анимацию
                    const plane = document.querySelector('.plane-group');
                    const line = document.querySelector('.flight-line');
                    if (plane && line) {
                        // Клонируем и заменяем — это перезапускает animateMotion
                        const newPlane = plane.cloneNode(true);
                        const newLine = line.cloneNode(true);
                        plane.parentNode.replaceChild(newPlane, plane);
                        line.parentNode.replaceChild(newLine, line);
                    }
                    planeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        planeObserver.observe(twoTripsSection);
    }
});