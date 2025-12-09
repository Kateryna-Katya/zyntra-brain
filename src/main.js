document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Инициализация иконок
    lucide.createIcons();

    // 2. Smooth Scroll (Lenis)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 3. Динамический год в футере
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 4. Мобильное меню (Базовая логика)
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            // Для мобильной версии мы добавим класс visible через CSS
            // В рамках текущего CSS это пока не стилизовано под "шторку", 
            // но функционал заложен на будущее или требует доп. CSS для .active
            nav.classList.toggle('active');
            
            // Временный алерт для теста, пока нет CSS для шторки
            console.log('Menu toggled'); 
        });
    }
});