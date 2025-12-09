// Ждем полной загрузки страницы (картинки, шрифты, стили), 
// чтобы GSAP правильно рассчитал высоту
window.addEventListener("load", () => {

    // --- 1. ПРОВЕРКА БИБЛИОТЕК ---
    const isGsapLoaded = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
    const isLenisLoaded = typeof Lenis !== "undefined";

    if (!isGsapLoaded) {
        console.error("CRITICAL: GSAP или ScrollTrigger не подключены!");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    if (typeof lucide !== "undefined") lucide.createIcons();

    // --- 2. НАСТРОЙКА LENIS + GSAP (СВЯЗКА) ---
    let lenis;
    if (isLenisLoaded) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
        });

        // Связываем Lenis и ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
    }

    // --- 3. АНИМАЦИИ (GSAP) ---

    // 3.1 HERO (Играет сразу, без скролла)
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    if (document.querySelector('.hero__title')) {
        heroTl.from(".hero__badge", { y: -20, opacity: 0, duration: 0.8 })
              .from(".hero__title", { y: 50, opacity: 0, duration: 1 }, "-=0.4")
              .from(".hero__desc", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")
              .from(".hero__actions .btn", { y: 20, opacity: 0, duration: 0.6, stagger: 0.2 }, "-=0.6")
              .from(".hero__visual", { scale: 0.8, opacity: 0, duration: 1.2, ease: "back.out(1.7)" }, "-=1");
    }

    // 3.2 ЗАГОЛОВКИ СЕКЦИЙ
    ScrollTrigger.batch(".section__title", {
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, overwrite: true }),
        start: "top 85%",
    });
    gsap.set(".section__title", { opacity: 0, y: 50 });


    // 3.3 ПРЕИМУЩЕСТВА (Benefits)
    const benefits = document.querySelectorAll(".benefit-card");
    if (benefits.length > 0) {
        gsap.set(benefits, { opacity: 0, y: 60 });
        
        ScrollTrigger.batch(benefits, {
            start: "top 85%",
            onEnter: batch => gsap.to(batch, {
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                stagger: 0.2, 
                ease: "power3.out",
                overwrite: true 
            })
        });
    }

    // 3.4 БЛОГ
    const posts = document.querySelectorAll(".blog-card");
    if (posts.length > 0) {
        gsap.set(posts, { opacity: 0, y: 60 });

        ScrollTrigger.batch(posts, {
            start: "top 85%",
            onEnter: batch => gsap.to(batch, {
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                stagger: 0.2, 
                ease: "power3.out"
            })
        });
    }

    // 3.5 КЕЙСЫ (Горизонтальный скролл)
    const casesSection = document.querySelector(".cases");
    const casesTrack = document.querySelector(".cases__track");
    
    if (casesSection && casesTrack) {
        let mm = gsap.matchMedia();

        mm.add("(min-width: 992px)", () => {
            const scrollAmount = casesTrack.scrollWidth - window.innerWidth;

            gsap.to(casesTrack, {
                x: -scrollAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: ".cases",
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => `+=${casesTrack.scrollWidth}`,
                    invalidateOnRefresh: true
                }
            });
        });
    }

    // --- 4. UI И ФУНКЦИОНАЛ ---

    // Год
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Мобильное меню
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const navLinks = document.querySelectorAll('.header__link');
    const burgerIcon = burger?.querySelector('i');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            const isActive = nav.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
            if (burgerIcon) {
                burgerIcon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
                lucide.createIcons();
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                document.body.style.overflow = '';
                if (burgerIcon) {
                    burgerIcon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // Cookie Popup
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('acceptCookies');
    
    if (cookiePopup && !localStorage.getItem('zyntra_cookies_accepted')) {
        setTimeout(() => cookiePopup.classList.add('show'), 2000);
    }
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('zyntra_cookies_accepted', 'true');
            if (cookiePopup) cookiePopup.classList.remove('show');
        });
    }

    // 5.2 Контактная форма (Добавлен чекбокс)
    const form = document.getElementById('contactForm');
    const messageBox = document.getElementById('formMessage');
    const consentCheckbox = document.getElementById('consent'); // <-- Чекбокс
    const captchaQ = document.getElementById('captchaQuestion');
    const captchaA = document.getElementById('captchaAnswer');
    
    let n1 = Math.floor(Math.random() * 10), n2 = Math.floor(Math.random() * 10);
    if (captchaQ) captchaQ.textContent = `${n1} + ${n2} = ?`;

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

            // 1. Валидация телефона
            const phone = form.querySelector('input[name="phone"]');
            if (phone && !/^\d+$/.test(phone.value)) {
                phone.closest('.form-group').classList.add('error');
                isValid = false;
            }

            // 2. Валидация Капчи
            if (captchaA && parseInt(captchaA.value) !== (n1 + n2)) {
                captchaA.closest('.form-group').classList.add('error');
                isValid = false;
                n1 = Math.floor(Math.random() * 10);
                n2 = Math.floor(Math.random() * 10);
                if (captchaQ) captchaQ.textContent = `${n1} + ${n2} = ?`;
                captchaA.value = '';
            }

            // 3. Валидация Имени
            const name = form.querySelector('input[name="name"]');
            if (name && !name.value.trim()) {
                name.closest('.form-group').classList.add('error');
                isValid = false;
            }
            
            // 4. Валидация ЧЕКБОКСА (Новая логика)
            if (consentCheckbox && !consentCheckbox.checked) {
                consentCheckbox.closest('.checkbox-group').classList.add('error');
                isValid = false;
            }

            if (isValid) {
                const btn = form.querySelector('button[type="submit"]');
                const btnText = btn.querySelector('.btn-text');
                const originalText = btnText.textContent;
                
                btnText.textContent = 'Отправка...';
                btn.style.opacity = '0.7';

                setTimeout(() => {
                    form.reset();
                    // Сброс капчи
                    n1 = Math.floor(Math.random() * 10);
                    n2 = Math.floor(Math.random() * 10);
                    if (captchaQ) captchaQ.textContent = `${n1} + ${n2} = ?`;
                    
                    btnText.textContent = originalText;
                    btn.style.opacity = '1';
                    
                    if(messageBox) {
                        messageBox.textContent = 'Успешно!'; 
                        messageBox.classList.add('success');
                        setTimeout(() => { messageBox.textContent=''; messageBox.classList.remove('success');}, 4000);
                    }
                }, 1000);
            }
        });
    }

    // ------------------------------------------------
    // 5. ФИНАЛЬНЫЙ РЕФРЕШ
    // ------------------------------------------------
    ScrollTrigger.refresh();
});