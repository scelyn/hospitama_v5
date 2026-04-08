/* ==========================================================================
   script.js — Hospitama Consulting
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. LOADER
// --------------------------------------------------------------------------
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.visibility = 'hidden';
        document.body.style.overflow = 'auto';
    }, 800);
});

// --------------------------------------------------------------------------
// 2. HAMBURGER MENU
//    - Toggle overlay saat ikon diklik
//    - Tutup otomatis saat salah satu link diklik
//    - Tutup otomatis saat area luar overlay diklik (opsional UX)
// --------------------------------------------------------------------------
const menuToggle = document.getElementById('mobile-menu');
const navLinks   = document.querySelector('.nav-links');

function closeMenu() {
    navLinks.classList.remove('active');
    // Kembalikan ikon ke burger (fa-bars)
    const icon = menuToggle.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
}

function openMenu() {
    navLinks.classList.add('active');
    // Ganti ikon ke X (fa-times)
    const icon = menuToggle.querySelector('i');
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-times');
}

if (menuToggle && navLinks) {
    // Toggle buka/tutup
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.contains('active') ? closeMenu() : openMenu();
    });

    /*
     * Tutup menu saat link di dalam overlay diklik.
     * Ini menangani SEMUA <a> di dalam .nav-links, termasuk
     * link anchor (#about, #services, dll.) maupun link halaman lain.
     */
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Tutup menu saat klik di luar overlay
    document.addEventListener('click', (e) => {
        if (
            navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {
            closeMenu();
        }
    });
}

// --------------------------------------------------------------------------
// 3. SMOOTH SCROLL — untuk semua anchor link (#...)
//    Memperhitungkan tinggi navbar agar section tidak tertutup
// --------------------------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        e.preventDefault();

        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetTop    = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
});

// --------------------------------------------------------------------------
// 4. SCROLL REVEAL
// --------------------------------------------------------------------------
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// --------------------------------------------------------------------------
// 5. NAVBAR SCROLL STYLE
// --------------------------------------------------------------------------
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    navbar.classList.toggle('nav-scrolled', window.scrollY > 50);
});

// --------------------------------------------------------------------------
// 6. PORTFOLIO — stagger delay
// --------------------------------------------------------------------------
document.querySelectorAll('.portfolio-item').forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.05}s`;
});

// --------------------------------------------------------------------------
// 7. GALLERY — infinite marquee + tombol navigasi manual
// --------------------------------------------------------------------------
const track    = document.getElementById('galleryTrack');
const viewport = document.getElementById('galleryViewport');

function moveManual(direction) {
    if (!track || !viewport) return;

    // Hentikan animasi sementara agar tidak konflik
    track.style.animation = 'none';

    const scrollAmount = 440; // lebar item (420) + gap (20)
    viewport.scrollLeft += direction * scrollAmount;

    // Nyalakan kembali animasi otomatis setelah 5 detik idle
    clearTimeout(window.galleryTimeout);
    window.galleryTimeout = setTimeout(() => {
        track.style.animation = 'marquee 45s linear infinite';
    }, 5000);
}

// Drag / swipe dengan mouse
if (viewport) {
    let isDown   = false;
    let startX;
    let scrollLeft;

    viewport.addEventListener('mousedown', (e) => {
        isDown     = true;
        startX     = e.pageX - viewport.offsetLeft;
        scrollLeft = viewport.scrollLeft;
        if (track) track.style.animationPlayState = 'paused';
    });

    viewport.addEventListener('mouseleave', () => {
        isDown = false;
        if (track) track.style.animationPlayState = 'running';
    });

    viewport.addEventListener('mouseup', () => {
        isDown = false;
        if (track) track.style.animationPlayState = 'running';
    });

    viewport.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x    = e.pageX - viewport.offsetLeft;
        const walk = (x - startX) * 2;
        viewport.scrollLeft = scrollLeft - walk;
    });
}