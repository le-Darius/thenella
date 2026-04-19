// DOM Elements
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const langEnBtn = document.getElementById('lang-en');
const langFrBtn = document.getElementById('lang-fr');
const sliderContainer = document.getElementById('slider-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const bookingForm = document.getElementById('booking-form');

// Gallery elements
const dots = document.querySelectorAll('.dot');
const thumbItems = document.querySelectorAll('.thumb-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

// Current language
let currentLang = 'en';

// Slider variables
let currentSlide = 0;
let sliderInterval;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// ── Navigation scroll effect ──────────────────────────────────
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 100);
});

// ── Mobile navigation ─────────────────────────────────────────
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// ── Gallery helpers ───────────────────────────────────────────
function updateGallery(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Dots
    dots.forEach(d => d.classList.remove('active'));
    dots[currentSlide].classList.add('active');

    // Thumbnails
    thumbItems.forEach(t => t.classList.remove('active'));
    thumbItems[currentSlide].classList.add('active');
}

function startAutoSlide() {
    sliderInterval = setInterval(() => updateGallery(currentSlide + 1), 5000);
}

function stopAutoSlide() {
    clearInterval(sliderInterval);
}

// Arrow buttons
nextBtn.addEventListener('click', () => { stopAutoSlide(); updateGallery(currentSlide + 1); startAutoSlide(); });
prevBtn.addEventListener('click', () => { stopAutoSlide(); updateGallery(currentSlide - 1); startAutoSlide(); });

// Dot clicks
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        stopAutoSlide();
        updateGallery(parseInt(dot.dataset.index));
        startAutoSlide();
    });
});

// Thumbnail clicks → go to slide
thumbItems.forEach(thumb => {
    thumb.addEventListener('click', () => {
        stopAutoSlide();
        updateGallery(parseInt(thumb.dataset.index));
        startAutoSlide();
    });
});

// Pause on hover
const mediaSlider = document.querySelector('.media-slider');
mediaSlider.addEventListener('mouseenter', stopAutoSlide);
mediaSlider.addEventListener('mouseleave', startAutoSlide);

// ── Lightbox ──────────────────────────────────────────────────
function openLightbox(index) {
    const slide = slides[index];
    const img = slide.querySelector('img');
    const caption = slide.querySelector('h3');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}

// Open lightbox on slide click
slides.forEach((slide, i) => slide.addEventListener('click', () => openLightbox(i)));

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

lightboxNext.addEventListener('click', () => {
    const next = (currentSlide + 1) % totalSlides;
    updateGallery(next);
    openLightbox(next);
});
lightboxPrev.addEventListener('click', () => {
    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
    updateGallery(prev);
    openLightbox(prev);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxNext.click();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
});

// ── Language Switching ────────────────────────────────────────
function switchLanguage(lang) {
    currentLang = lang;
    langEnBtn.classList.toggle('active', lang === 'en');
    langFrBtn.classList.toggle('active', lang === 'fr');

    document.querySelectorAll('[data-lang-en]').forEach(el => {
        const text = el.getAttribute(`data-lang-${lang}`);
        if (!text) return;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.id === 'message' ? (el.placeholder = text) : (el.value = text);
        } else {
            el.textContent = text;
        }
    });

    document.querySelectorAll('option[data-lang-en]').forEach(opt => {
        opt.textContent = opt.getAttribute(`data-lang-${lang}`);
    });

    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        messageTextarea.placeholder = lang === 'en'
            ? 'Tell us about your event and how Thenella can minister...'
            : 'Parlez-nous de votre événement et comment Thenella peut exercer son ministère...';
    }
}

langEnBtn.addEventListener('click', () => switchLanguage('en'));
langFrBtn.addEventListener('click', () => switchLanguage('fr'));

// ── Form submission ───────────────────────────────────────────
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const eventType = document.getElementById('event-type').value;
    alert(currentLang === 'en'
        ? `Thank you ${name}! Your booking request for a ${eventType} has been received. We'll contact you at ${email} shortly.`
        : `Merci ${name}! Votre demande de réservation pour un ${eventType} a été reçue. Nous vous contacterons à ${email} sous peu.`);
    bookingForm.reset();
    document.getElementById('message').placeholder = currentLang === 'en'
        ? 'Tell us about your event and how Thenella can minister...'
        : 'Parlez-nous de votre événement et comment Thenella peut exercer son ministère...';
});

// ── Smooth scrolling ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// ── Events from Google Sheets ─────────────────────────────────
// 👉 Remplace cette URL par l'URL de publication de ton Google Sheets
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTzQ1m0AYELDkNDGTfCG1t6OInZikRU9jLccauP6NPKXlQEyrKSfSHyZReckp9--mPZRFDkvo64WVPw/pub?output=csv';

const MONTHS_FR = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];
const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

async function loadEvents() {
    const grid    = document.getElementById('events-grid');
    const loading = document.getElementById('events-loading');
    const empty   = document.getElementById('events-empty');

    try {
        const res  = await fetch(SHEET_URL);
        const text = await res.text();

        // Parse CSV : on ignore la première ligne (en-têtes)
        const lines = text.trim().split('\n').slice(1);

        const today = new Date(); today.setHours(0,0,0,0);

        const events = lines
            .map(line => {
                // Gestion des virgules dans les champs entre guillemets
                const cols = line.match(/(".*?"|[^,]+)(?=,|$)/g) || [];
                const clean = cols.map(c => c.replace(/^"|"$/g, '').trim());
                return {
                    dateStr : clean[0] || '',
                    title   : clean[1] || '',
                    location: clean[2] || '',
                    city    : clean[3] || '',
                    type    : clean[4] || '',
                    status  : (clean[5] || '').toLowerCase()
                };
            })
            .filter(e => {
                if (!e.dateStr || !e.title) return false;
                const [d, m, y] = e.dateStr.split('/');
                if (!d || !m || !y) return false;
                const date = new Date(y, m - 1, d);
                return date >= today;
            })
            .sort((a, b) => {
                const toDate = s => {
                    const [d, m, y] = s.split('/');
                    return new Date(y, m - 1, d);
                };
                return toDate(a.dateStr) - toDate(b.dateStr);
            });

        loading.style.display = 'none';

        if (events.length === 0) {
            empty.style.display = 'block';
            return;
        }

        grid.style.display = 'flex';
        grid.innerHTML = events.map(e => {
            const [d, m, y] = e.dateStr.split('/');
            const monthIdx   = parseInt(m) - 1;
            const lang       = currentLang;
            const monthLabel = lang === 'fr' ? MONTHS_FR[monthIdx] : MONTHS_EN[monthIdx];

            let badgeClass = '';
            let badgeLabel = e.type;
            if (e.status === 'free')     { badgeClass = 'free';     badgeLabel = lang === 'fr' ? 'Entrée libre' : 'Free entry'; }
            if (e.status === 'sold-out') { badgeClass = 'sold-out'; badgeLabel = lang === 'fr' ? 'Complet'      : 'Sold out';   }

            return `
            <div class="event-card">
                <div class="event-date">
                    <span class="day">${d}</span>
                    <span class="month">${monthLabel}</span>
                    <span class="year">${y}</span>
                </div>
                <div class="event-details">
                    <h3>${e.title}</h3>
                    <div class="event-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${e.location}${e.city ? ', ' + e.city : ''}</span>
                        ${e.type ? `<span><i class="fas fa-tag"></i> ${e.type}</span>` : ''}
                    </div>
                </div>
                ${badgeLabel ? `<span class="event-badge ${badgeClass}">${badgeLabel}</span>` : ''}
            </div>`;
        }).join('');

    } catch (err) {
        loading.style.display = 'none';
        empty.style.display = 'block';
        console.warn('Impossible de charger les événements :', err);
    }
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    switchLanguage('en');
    updateGallery(0);
    startAutoSlide();
    loadEvents();
});