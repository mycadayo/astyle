document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const body = document.body;
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapse-btn');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeMobileBtn = document.getElementById('close-mobile-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const authOverlay = document.getElementById('auth-overlay');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const heroTitle = document.querySelector('.hero-title');
    const cursor = document.getElementById('custom-cursor');
    const bgParticles = document.getElementById('bg-particles');

    // --- Audio System (Retro Phone Sounds) ---
    const playSound = (type) => {
        const sounds = {
            click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
            hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
            slide: 'https://assets.mixkit.co/active_storage/sfx/133/133-preview.mp3'
        };
        const audio = new Audio(sounds[type]);
        audio.volume = 0.2;
        audio.play().catch(() => {}); // Catch browser blocking
    };

    // --- Star Cursor & Trail Logic ---
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        
        // Spawn trail every few pixels
        if (Math.random() > 0.8) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.innerHTML = '✨';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            body.appendChild(trail);
            setTimeout(() => trail.remove(), 500);
        }
    });

    // --- Background Particles Logic ---
    function createParticles() {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 5 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.animationDuration = Math.random() * 5 + 5 + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            bgParticles.appendChild(particle);
        }
    }
    createParticles();

    // --- SPA Navigation Logic ---
    function showSection(sectionId) {
        sections.forEach(section => section.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('active'));

        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            playSound('click');
        }

        const activeNav = document.querySelector(`.nav-item[href="${sectionId}"]`);
        if (activeNav) activeNav.classList.add('active');
    }

    const initialHash = window.location.hash || '#home';
    showSection(initialHash);

    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => playSound('hover'));
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                showSection(href);
                window.location.hash = href;
                
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            }
        });
    });

    // --- Hero Buttons & Smooth Scroll ---
    const exploreBtn = document.getElementById('explore-btn');
    const trendsBtn = document.getElementById('trends-btn');

    [exploreBtn, trendsBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('mouseenter', () => playSound('hover'));
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    showSection(targetId);
                    window.location.hash = targetId;
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });

    // --- Theme Logic ---
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggle.addEventListener('mouseenter', () => playSound('hover'));
    themeToggle.addEventListener('click', () => {
        playSound('click');
        if (body.classList.contains('light-theme')) {
            body.classList.replace('light-theme', 'dark-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.replace('dark-theme', 'light-theme');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- Sidebar Logic ---
    collapseBtn.addEventListener('click', () => {
        playSound('click');
        sidebar.classList.toggle('collapsed');
        const icon = collapseBtn.querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
            icon.classList.replace('fa-chevron-left', 'fa-chevron-right');
        } else {
            icon.classList.replace('fa-chevron-right', 'fa-chevron-left');
        }
    });

    hamburgerBtn.addEventListener('click', () => {
        playSound('click');
        sidebar.classList.add('open');
    });
    closeMobileBtn.addEventListener('click', () => {
        playSound('click');
        sidebar.classList.remove('open');
    });

    // --- Auth & Session Logic ---
    function checkSession() {
        const savedUser = localStorage.getItem('astyle_user');
        if (savedUser) {
            unlockSite(savedUser);
        } else {
            lockSite();
        }
    }

    function lockSite() {
        body.classList.add('locked');
        authOverlay.classList.remove('hidden');
    }

    function unlockSite(username) {
        body.classList.remove('locked');
        authOverlay.classList.add('hidden');
        if (heroTitle) {
            heroTitle.innerHTML = `Bem-vinda, <span class="highlight">${username}!</span> <br>Y2K is back 💿 💿`;
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        if (username) {
            playSound('click');
            localStorage.setItem('astyle_user', username);
            unlockSite(username);
        }
    });

    checkSession();

    // --- Y2K Carousel Logic ---
    function initCarousel() {
        const cards = document.querySelectorAll('.carousel-card');
        if (cards.length === 0) return;

        let currentIndex = 0;

        function updateCarousel() {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'prev', 'next', 'hidden');
                
                if (index === currentIndex) {
                    card.classList.add('active');
                } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
                    card.classList.add('prev');
                } else if (index === (currentIndex + 1) % cards.length) {
                    card.classList.add('next');
                } else {
                    card.classList.add('hidden');
                }
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
            playSound('slide');
        }

        // Auto-play
        let interval = setInterval(nextSlide, 3500);

        // Click to change
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
                playSound('click');
                clearInterval(interval);
                interval = setInterval(nextSlide, 3500);
            });
        });

        updateCarousel();
    }

    initCarousel();

    // --- Contact Form Submission ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            playSound('click');

            const name = contactForm.querySelector('input[placeholder="Seu Nome"]').value.trim();
            const email = contactForm.querySelector('input[placeholder="Seu E-mail"]').value.trim();
            const message = contactForm.querySelector('textarea').value.trim();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;

            // basic validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!name || !email || !message || !emailRegex.test(email)) {
                alert('não conseguimos enviar :(');
                return;
            }

            btn.innerHTML = 'Enviando... 💿';
            btn.disabled = true;

            // compose mailto link
            const subject = encodeURIComponent('Contato do site AStyle');
            const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`);
            const mailtoLink = `mailto:amandamarcolino32@gmail.com?subject=${subject}&body=${body}`;

            // show success feedback then open mail client
            alert('email enviado com sucesso');
            window.location.href = mailtoLink;

            btn.innerHTML = originalText;
            btn.disabled = false;
            contactForm.reset();
        });
    }

    // --- Parallax Effect ---
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroText = document.querySelector('.hero-text-content');
        const heroImg = document.querySelector('.carousel-wrapper');
        
        if (heroText && scrolled < 600) {
            heroText.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroImg.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });

    // --- Playlist Interactive Logic ---
    const playlistContainer = document.getElementById('playlist-container');
    const hits = [
        { title: "Toxic", artist: "Britney Spears", year: "2003" },
        { title: "Umbrella", artist: "Rihanna", year: "2007" },
        { title: "Hips Don't Lie", artist: "Shakira", year: "2005" },
        { title: "Yeah!", artist: "Usher", year: "2004" },
        { title: "Crazy In Love", artist: "Beyoncé", year: "2003" },
        { title: "Mr. Brightside", artist: "The Killers", year: "2004" },
        { title: "Lady Marmalade", artist: "Christina Aguilera", year: "2001" },
        { title: "Hey Ya!", artist: "Outkast", year: "2003" }
    ];

    if (playlistContainer) {
        hits.forEach((hit, index) => {
            const card = document.createElement('div');
            card.className = 'song-card';
            card.innerHTML = `
                <span class="song-number">${String(index + 1).padStart(2, '0')}</span>
                <div class="song-info">
                    <h4>${hit.title}</h4>
                    <p>${hit.artist} • ${hit.year}</p>
                </div>
                <i class="fas fa-play-circle play-icon"></i>
            `;
            
            card.addEventListener('mouseenter', () => playSound('hover'));
            card.addEventListener('click', () => {
                playSound('click');
                alert(`Tocando agora: ${hit.title} - ${hit.artist} (Simulação Y2K)`);
            });
            
            playlistContainer.appendChild(card);
        });
    }

    // --- Moda Gallery Switcher ---
    const modaBtns = document.querySelectorAll('.moda-category-btn');
    const modaGalleries = document.querySelectorAll('.moda-gallery');

    if (modaBtns.length > 0) {
        modaBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => playSound('hover'));
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                
                // Update buttons
                modaBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update galleries
                modaGalleries.forEach(gallery => {
                    gallery.classList.remove('active');
                    if (gallery.id === `gallery-${category}`) {
                        gallery.classList.add('active');
                    }
                });
                
                playSound('click');
            });
        });
    }
});
