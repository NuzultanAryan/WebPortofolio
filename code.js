/**
 * Portfolio - Nuzultan Aryan Ramadhan
 * Main JavaScript File
 */

/* ============================================
   THEME TOGGLE
   ============================================ */
const htmlEl = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

// Initialize theme from localStorage or system preference
const savedTheme = localStorage.getItem('portfolio-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

htmlEl.setAttribute('data-theme', initialTheme);
updateThemeIcon(initialTheme);

themeToggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateThemeIcon(next);
});

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
}, { passive: true });

/* ============================================
   NAVBAR — SCROLL & ACTIVE LINK
   ============================================ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    // Navbar shrink on scroll
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link tracking
    let currentSection = '';
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').replace('#', '');
        if (href === currentSection) {
            link.classList.add('active');
        }
    });
}, { passive: true });

/* ============================================
   HAMBURGER MENU
   ============================================ */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

// Close menu on resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}, { passive: true });

/* ============================================
   SMOOTH SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = parseInt(getComputedStyle(htmlEl).getPropertyValue('--nav-height')) || 72;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ============================================
   TYPING EFFECT — HERO SUBTITLE
   ============================================ */
const typingEl = document.getElementById('typingText');
const roles = [
    'Siswa RPL di SMK Telkom',
    'Web Developer 🧑‍💻',
    'UI/UX Enthusiast 🎨',
    'Frontend Developer ⚡',
    'Problem Solver 💡',
];

let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typingTimeout;

function typeLoop() {
    const currentRole = roles[roleIdx];

    if (!isDeleting) {
        typingEl.textContent = currentRole.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === currentRole.length) {
            isDeleting = true;
            typingTimeout = setTimeout(typeLoop, 2000); // pause before deleting
            return;
        }
    } else {
        typingEl.textContent = currentRole.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
        }
    }

    const speed = isDeleting ? 60 : 100;
    typingTimeout = setTimeout(typeLoop, speed);
}

// Start typing after hero animation completes
setTimeout(typeLoop, 800);

/* ============================================
   SCROLL REVEAL ANIMATION
   ============================================ */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================
   ANIMATED STAT COUNTERS
   ============================================ */
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            if (isNaN(target)) return;

            animateCounter(el, 0, target, 1600);
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => statObserver.observe(el));

function animateCounter(el, from, to, duration) {
    const suffix = el.textContent.replace(/[0-9]/g, '').trim();
    const startTime = performance.now();

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(from + (to - from) * eased);
        el.textContent = current + (suffix || (to > 10 ? '+' : ''));
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = to + (to >= 3 && to <= 15 ? '+' : '');
    }

    requestAnimationFrame(step);
}

/* ============================================
   SKILL BAR ANIMATION
   ============================================ */
const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.skill-bar-fill');
            fills.forEach(fill => {
                const width = fill.getAttribute('data-width');
                // Small delay to let CSS transition kick in visually
                setTimeout(() => {
                    fill.style.width = width + '%';
                }, 200);
            });
            skillBarObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-card').forEach(card => skillBarObserver.observe(card));

/* ============================================
   CONTACT FORM
   ============================================ */
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

function showToast(message, type = 'success') {
    toastMsg.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        // Basic validation
        if (!name || !email || !subject || !message) {
            showToast('Mohon lengkapi semua field.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Format email tidak valid.', 'error');
            return;
        }

        // Simulate sending (can be integrated with EmailJS, Formspree, etc.)
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '⏳ Mengirim...';
        submitBtn.disabled = true;

        setTimeout(() => {
            console.log('Form submitted:', { name, email, subject, message });
            contactForm.reset();
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            showToast('Terima kasih! Pesan kamu telah dikirim. 🎉', 'success');
        }, 1500);
    });
}

/* ============================================
   SUBTLE PARALLAX ON HERO BLOBS
   ============================================ */
const blob1 = document.querySelector('.hero-blob-1');
const blob2 = document.querySelector('.hero-blob-2');

if (blob1 && blob2) {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        blob1.style.transform = `translate(${x}px, ${y}px)`;
        blob2.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
    }, { passive: true });
}