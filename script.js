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
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = bookingForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = currentLang === 'en' ? 'Sending...' : 'Envoi...';

    try {
        const res = await fetch('http://localhost:5000/api/booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                eventType: document.getElementById('event-type').value,
                message: document.getElementById('message').value
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        alert(currentLang === 'en'
            ? `Thank you! Your request has been sent. Check your email.`
            : `Merci ! Votre demande a été envoyée. Vérifiez votre email.`);
        bookingForm.reset();
    } catch {
        alert(currentLang === 'en' ? 'Error sending. Try again.' : 'Erreur envoi. Réessayez.');
    } finally {
        btn.disabled = false;
        btn.textContent = currentLang === 'en' ? 'Send Booking Request' : 'Envoyer la Demande de Réservation';
    }
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

// ── Events from API ───────────────────────────────────────────
const API_URL = 'https://backenddethenellawebdyn-production.up.railway.app/api';

async function loadEvents() {
    const grid    = document.getElementById('events-grid');
    const loading = document.getElementById('events-loading');
    const empty   = document.getElementById('events-empty');

    try {
        const res  = await fetch(`${API_URL}/events`);
        const data = await res.json();

        loading.style.display = 'none';

        const today = new Date(); today.setHours(0,0,0,0);
        const upcoming = Array.isArray(data)
            ? data.filter(e => e.published && new Date(e.date) >= today)
                  .sort((a,b) => new Date(a.date) - new Date(b.date))
            : [];

        if (!upcoming.length) {
            empty.style.display = 'block';
            return;
        }

        grid.style.display = 'flex';
        grid.innerHTML = upcoming.map(e => {
            const date = new Date(e.date);
            const day  = date.getDate().toString().padStart(2,'0');
            const monthIdx = date.getMonth();
            const year = date.getFullYear();
            const monthLabel = currentLang === 'fr' ? MONTHS_FR[monthIdx] : MONTHS_EN[monthIdx];

            const typeLabel = e.category || e.type || '';
            let badgeClass = '';
            let badgeLabel = typeLabel;
            if (e.status === 'free')     { badgeClass = 'free';     badgeLabel = currentLang === 'fr' ? 'Entrée libre' : 'Free entry'; }
            if (e.status === 'sold-out') { badgeClass = 'sold-out'; badgeLabel = currentLang === 'fr' ? 'Complet' : 'Sold out'; }

            return `
            <div class="event-card">
                <div class="event-date">
                    <span class="day">${day}</span>
                    <span class="month">${monthLabel}</span>
                    <span class="year">${year}</span>
                </div>
                <div class="event-details">
                    <h3>${e.title}</h3>
                    <div class="event-meta">
                        ${e.location ? `<span><i class="fas fa-map-marker-alt"></i> ${e.location}</span>` : ''}
                        ${typeLabel ? `<span><i class="fas fa-tag"></i> ${typeLabel}</span>` : ''}
                    </div>
                </div>
                ${badgeLabel ? `<span class="event-badge ${badgeClass}">${badgeLabel}</span>` : ''}
            </div>`;
        }).join('');

    } catch (err) {
        loading.style.display = 'none';
        empty.style.display = 'block';
        console.warn('Erreur chargement événements:', err);
    }
}

// ── Testimonials ──────────────────────────────────────────────
async function loadTestimonials() {
    const grid    = document.getElementById('testimonials-grid');
    const loading = document.getElementById('testimonials-loading');
    const empty   = document.getElementById('testimonials-empty');

    try {
        const res  = await fetch(`${API_URL}/testimonials`);
        const data = await res.json();

        loading.style.display = 'none';

        if (!data.length) {
            empty.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        grid.innerHTML = data.map(t => `
            <div class="testimonial-card">
                <div class="testimonial-quote"><i class="fas fa-quote-left"></i></div>
                <p class="testimonial-message">${t.message}</p>
                <div class="testimonial-author">
                    <div class="testimonial-avatar">${t.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <strong>${t.name}</strong>
                        ${t.role ? `<span class="testimonial-role">${t.role}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

    } catch (err) {
        loading.style.display = 'none';
        empty.style.display = 'block';
        console.warn('Erreur chargement témoignages:', err);
    }
}

// Soumission du formulaire témoignage
const testimonialForm = document.getElementById('testimonial-form');
if (testimonialForm) {
    testimonialForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('tm-submit-btn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            const res = await fetch(`${API_URL}/testimonials`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name   : document.getElementById('tm-public-name').value,
                    role   : document.getElementById('tm-public-role').value,
                    message: document.getElementById('tm-public-message').value
                })
            });

            if (res.ok) {
                testimonialForm.style.display = 'none';
                document.getElementById('testimonial-success').style.display = 'block';
            } else {
                throw new Error('Erreur serveur');
            }
        } catch (err) {
            btn.disabled = false;
            btn.innerHTML = '<span>Submit Testimony</span>';
            alert('Erreur lors de la soumission. Réessayez.');
        }
    });
}

// ── Dropdown "Plus" ───────────────────────────────────────────
const navDropdown = document.getElementById('nav-dropdown');
const dropdownToggle = document.getElementById('dropdown-toggle');
const dropdownMenu = document.getElementById('dropdown-menu');

if (dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navDropdown.classList.toggle('open');
        dropdownToggle.setAttribute('aria-expanded', isOpen);
    });
}

// Fermer en cliquant ailleurs
document.addEventListener('click', (e) => {
    if (navDropdown && !navDropdown.contains(e.target)) {
        navDropdown.classList.remove('open');
        if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', false);
    }
});

// Fermer quand on clique sur un lien du dropdown
if (dropdownMenu) {
    dropdownMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navDropdown.classList.remove('open');
            navLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    switchLanguage('en');
    updateGallery(0);
    startAutoSlide();
    loadEvents();
    loadTestimonials(); // ← ajouté pour charger les témoignages
});