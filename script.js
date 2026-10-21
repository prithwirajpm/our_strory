/* =========================================================
   Prithwi & Devutty - LOVE STORY WEBSITE
   script.js - All interactive functionality
   ========================================================= */

'use strict';

// ─────────────────────────────────────────────
// 0. PASSWORD LOCK SCREEN
// ─────────────────────────────────────────────
(function initLockScreen() {
  const lockScreen = document.getElementById('lockScreen');
  if (!lockScreen) return;

  // If already unlocked in this session, hide immediately
  if (sessionStorage.getItem('pd_unlocked') === 'true') {
    lockScreen.style.display = 'none';
    return;
  }

  // Prevent scrolling while locked
  document.body.style.overflow = 'hidden';

  const CORRECT_PASSWORD = '2255';
  const inputs = [
    document.getElementById('otp0'),
    document.getElementById('otp1'),
    document.getElementById('otp2'),
    document.getElementById('otp3'),
  ];
  const lockError = document.getElementById('lockError');
  const lockBtn   = document.getElementById('lockBtn');
  const lockHearts = document.getElementById('lockHearts');

  // Create floating hearts for lock screen background
  const symbols = ['\u2764', '\u2661', '\u2665', '\u2764'];
  for (let i = 0; i < 16; i++) {
    const h = document.createElement('span');
    h.className = 'lock-float-heart';
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    h.setAttribute('aria-hidden', 'true');
    h.style.fontSize = (0.6 + Math.random() * 1.4) + 'rem';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.animationDuration = (10 + Math.random() * 16) + 's';
    h.style.animationDelay   = (Math.random() * 15) + 's';
    lockHearts.appendChild(h);
  }

  // Auto-focus first input
  setTimeout(() => inputs[0] && inputs[0].focus(), 400);

  // OTP input handling — auto advance & backspace
  inputs.forEach((input, idx) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value;
      // Keep only last character and only digits
      const digit = val.replace(/\D/g, '').slice(-1);
      e.target.value = digit;

      if (digit) {
        e.target.classList.add('filled');
        lockError.textContent = '';
        // Move to next
        if (idx < inputs.length - 1) {
          inputs[idx + 1].focus();
        } else {
          // All filled — auto submit
          attemptUnlock();
        }
      } else {
        e.target.classList.remove('filled');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) {
        inputs[idx - 1].focus();
        inputs[idx - 1].value = '';
        inputs[idx - 1].classList.remove('filled');
      }
      if (e.key === 'Enter') {
        attemptUnlock();
      }
    });

    // Only allow digit keys
    input.addEventListener('keypress', (e) => {
      if (!/[0-9]/.test(e.key)) e.preventDefault();
    });

    // On mobile paste
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      pasted.split('').slice(0, 4).forEach((ch, i) => {
        if (inputs[i]) {
          inputs[i].value = ch;
          inputs[i].classList.add('filled');
        }
      });
      if (pasted.length >= 4) attemptUnlock();
    });
  });

  lockBtn.addEventListener('click', attemptUnlock);

  function attemptUnlock() {
    const entered = inputs.map(i => i.value).join('');
    if (entered.length < 4) {
      lockError.textContent = 'Please enter all 4 digits 💕';
      inputs[entered.length] && inputs[entered.length].focus();
      return;
    }
    if (entered === CORRECT_PASSWORD) {
      // ✅ Correct — unlock with animation
      lockScreen.classList.add('unlocking');
      sessionStorage.setItem('pd_unlocked', 'true');
      setTimeout(() => {
        lockScreen.style.display = 'none';
        document.body.style.overflow = '';
      }, 750);
    } else {
      // ❌ Wrong — shake and show error
      lockError.textContent = 'Incorrect password. Try again ❤️';
      inputs.forEach(inp => {
        inp.value = '';
        inp.classList.remove('filled');
        inp.classList.remove('shake');
        void inp.offsetWidth; // force reflow
        inp.classList.add('shake');
      });
      inputs[0].focus();
      // Remove shake after animation
      setTimeout(() => inputs.forEach(inp => inp.classList.remove('shake')), 600);
    }
  }
})();



// ─────────────────────────────────────────────
// 1. NAVIGATION
// ─────────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ─────────────────────────────────────────────
// 2. SMOOTH SCROLL - HERO BUTTON
// ─────────────────────────────────────────────
document.getElementById('enterBtn').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('letter').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('reliveBtn').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─────────────────────────────────────────────
// 3. HERO ANIMATIONS - trigger on load
// ─────────────────────────────────────────────
window.addEventListener('load', () => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    setTimeout(() => heroContent.classList.add('loaded'), 100);
  }
});

// ─────────────────────────────────────────────
// 4. FLOATING HEARTS
// ─────────────────────────────────────────────
(function createFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  if (!container) return;
  const symbols = ['\u2764', '\u2661', '\u2764', '\u2665'];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.setAttribute('aria-hidden', 'true');

    const size = 0.7 + Math.random() * 1.2;
    heart.style.fontSize = size + 'rem';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (12 + Math.random() * 18) + 's';
    heart.style.animationDelay = (Math.random() * 20) + 's';
    heart.style.opacity = (0.2 + Math.random() * 0.4).toString();

    container.appendChild(heart);
  }
})();

// ─────────────────────────────────────────────
// 5. HERO PARTICLES
// ─────────────────────────────────────────────
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 25;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 2 + Math.random() * 5;
    p.style.width  = size + 'px';
    p.style.height = size + 'px';
    p.style.left   = Math.random() * 100 + 'vw';
    p.style.animationDuration = (8 + Math.random() * 15) + 's';
    p.style.animationDelay    = (Math.random() * 12) + 's';
    container.appendChild(p);
  }
})();

// ─────────────────────────────────────────────
// 6. ENGAGEMENT SPARKLES
// ─────────────────────────────────────────────
(function createSparkles() {
  const container = document.getElementById('sparkles');
  if (!container) return;
  const symbols = ['\u2726', '\u2727', '\u2736', '\u22C6', '\u2605'];
  const count = 30;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.top  = Math.random() * 100 + '%';
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDuration = (2 + Math.random() * 4) + 's';
    s.style.animationDelay   = (Math.random() * 5) + 's';
    s.style.fontSize = (0.6 + Math.random() * 1) + 'rem';
    container.appendChild(s);
  }
})();

// ─────────────────────────────────────────────
// 7. STAR BACKGROUND (FUTURE SECTION)
// ─────────────────────────────────────────────
(function createStars() {
  const container = document.getElementById('starsBg');
  if (!container) return;
  const count = 80;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star-dot';
    const size = 0.5 + Math.random() * 2.5;
    star.style.width  = size + 'px';
    star.style.height = size + 'px';
    star.style.top    = Math.random() * 100 + '%';
    star.style.left   = Math.random() * 100 + '%';
    star.style.animationDuration = (2 + Math.random() * 5) + 's';
    star.style.animationDelay   = (Math.random() * 6) + 's';
    container.appendChild(star);
  }
})();

// ─────────────────────────────────────────────
// 8. SCROLL REVEAL ANIMATIONS
// ─────────────────────────────────────────────
(function initReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(delay, 400));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ─────────────────────────────────────────────
// 9. ANNIVERSARY COUNTDOWN
// ─────────────────────────────────────────────
(function initCountdown() {
  const anniversaryDate = new Date('2026-11-18T00:00:00');

  const cdDays    = document.getElementById('cdDays');
  const cdHours   = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');
  const cdGrid    = document.getElementById('countdownGrid');
  const cdLabel   = document.getElementById('countdownLabel');
  const cdMsg     = document.getElementById('anniversaryMsg');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const now  = new Date();
    const diff = anniversaryDate - now;

    if (diff <= 0) {
      cdGrid.style.display  = 'none';
      cdLabel.style.display = 'none';
      cdMsg.style.display   = 'block';
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days    = Math.floor(totalSeconds / 86400);
    const hours   = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    cdDays.textContent    = pad(days);
    cdHours.textContent   = pad(hours);
    cdMinutes.textContent = pad(minutes);
    cdSeconds.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// ─────────────────────────────────────────────
// 10. GALLERY LIGHTBOX
// ─────────────────────────────────────────────
const galleries = {
  devika: [
    'assets/image/single/devika_one.jpeg',
    'assets/image/single/devika_two.jpeg',
    'assets/image/single/devika_three.jpeg',
    'assets/image/single/devika_Four.jpeg',
    'assets/image/single/devika_six.jpeg',
  ],
  memories: [
    'assets/image/couple/couple_1.jpeg',
    'assets/image/couple/couple_2.jpeg',
    'assets/image/couple/couple_3.jpeg',
    'assets/image/couple/couple_4.jpeg',
  ],
  child: [
    'assets/image/child/child_1.jpeg',
    'assets/image/child/child_2.jpeg',
  ],
};

const alts = {
  devika:   ['Devutty', 'Devutty', 'Devutty', 'Devutty', 'Devutty'],
  memories: ['Prithwi and Devutty', 'Prithwi and Devutty', 'Our memories together', 'Prithwi and Devutty moments'],
  child:    ['Childhood memory', 'Childhood memory'],
};

const lightbox         = document.getElementById('lightbox');
const lightboxImg      = document.getElementById('lightboxImg');
const lightboxClose    = document.getElementById('lightboxClose');
const lightboxPrev     = document.getElementById('lightboxPrev');
const lightboxNext     = document.getElementById('lightboxNext');
const lightboxCounter  = document.getElementById('lightboxCounter');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');

let currentGallery = null;
let currentIndex   = 0;

function openLightbox(gallery, index) {
  currentGallery = gallery;
  currentIndex   = index;
  showLightboxImage();
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
  currentGallery = null;
}

function showLightboxImage() {
  const srcs   = galleries[currentGallery];
  const altArr = alts[currentGallery];
  lightboxImg.src = srcs[currentIndex];
  lightboxImg.alt = altArr[currentIndex] || '';
  lightboxCounter.textContent = (currentIndex + 1) + ' / ' + srcs.length;
  lightboxPrev.style.display = srcs.length > 1 ? 'flex' : 'none';
  lightboxNext.style.display = srcs.length > 1 ? 'flex' : 'none';
}

function prevLightbox() {
  const len = galleries[currentGallery].length;
  currentIndex = (currentIndex - 1 + len) % len;
  showLightboxImage();
}

function nextLightbox() {
  const len = galleries[currentGallery].length;
  currentIndex = (currentIndex + 1) % len;
  showLightboxImage();
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', prevLightbox);
lightboxNext.addEventListener('click', nextLightbox);

document.addEventListener('keydown', (e) => {
  if (lightbox.style.display === 'flex') {
    if (e.key === 'ArrowLeft')  prevLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'Escape')     closeLightbox();
  }
});

// Wire up gallery images
document.querySelectorAll('[data-gallery]').forEach(img => {
  img.style.cursor = 'pointer';
  img.addEventListener('click', () => {
    const gallery = img.dataset.gallery;
    const index   = parseInt(img.dataset.index, 10);
    openLightbox(gallery, index);
  });
  const parent = img.closest('.masonry-item') || img.closest('.scrapbook-frame');
  if (parent) {
    parent.setAttribute('role', 'button');
    parent.setAttribute('tabindex', '0');
    parent.setAttribute('aria-label', 'View photo');
    parent.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const gallery = img.dataset.gallery;
        const index   = parseInt(img.dataset.index, 10);
        openLightbox(gallery, index);
      }
    });
  }
});

// ─────────────────────────────────────────────
// 11. SLIDESHOW
// ─────────────────────────────────────────────
const slideshowBtn      = document.getElementById('slideshowBtn');
const slideshowOverlay  = document.getElementById('slideshowOverlay');
const slideshowImg      = document.getElementById('slideshowImg');
const slideshowClose    = document.getElementById('slideshowClose');
const slideshowPrevBtn  = document.getElementById('slideshowPrev');
const slideshowNextBtn  = document.getElementById('slideshowNext');
const slideshowPause    = document.getElementById('slideshowPause');
const slideshowCounter  = document.getElementById('slideshowCounter');
const slideshowBackdrop = document.getElementById('slideshowBackdrop');

const slideshowImages = galleries.memories;
let slideshowIndex   = 0;
let slideshowTimer   = null;
let slideshowPlaying = false;

function openSlideshow() {
  slideshowIndex = 0;
  slideshowOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  showSlideshowImage();
  startSlideshowAuto();
  slideshowClose.focus();
}

function closeSlideshow() {
  stopSlideshowAuto();
  slideshowOverlay.style.display = 'none';
  document.body.style.overflow = '';
}

function showSlideshowImage() {
  slideshowImg.style.opacity = '0';
  setTimeout(() => {
    slideshowImg.src = slideshowImages[slideshowIndex];
    slideshowImg.alt = alts.memories[slideshowIndex] || '';
    slideshowCounter.textContent = (slideshowIndex + 1) + ' / ' + slideshowImages.length;
    slideshowImg.style.opacity = '1';
  }, 150);
}

function startSlideshowAuto() {
  slideshowPlaying = true;
  slideshowPause.textContent = '\u23F8 Pause';
  slideshowTimer = setInterval(() => {
    slideshowIndex = (slideshowIndex + 1) % slideshowImages.length;
    showSlideshowImage();
  }, 3500);
}

function stopSlideshowAuto() {
  slideshowPlaying = false;
  slideshowPause.textContent = '\u25B6 Play';
  clearInterval(slideshowTimer);
  slideshowTimer = null;
}

slideshowBtn.addEventListener('click', openSlideshow);
slideshowClose.addEventListener('click', closeSlideshow);
slideshowBackdrop.addEventListener('click', closeSlideshow);

slideshowPrevBtn.addEventListener('click', () => {
  slideshowIndex = (slideshowIndex - 1 + slideshowImages.length) % slideshowImages.length;
  showSlideshowImage();
});

slideshowNextBtn.addEventListener('click', () => {
  slideshowIndex = (slideshowIndex + 1) % slideshowImages.length;
  showSlideshowImage();
});

slideshowPause.addEventListener('click', () => {
  if (slideshowPlaying) {
    stopSlideshowAuto();
  } else {
    startSlideshowAuto();
  }
});

document.addEventListener('keydown', (e) => {
  if (slideshowOverlay.style.display === 'flex') {
    if (e.key === 'Escape') closeSlideshow();
  }
});

// ─────────────────────────────────────────────
// 12. MUSIC PLAYER
// ─────────────────────────────────────────────
(function initMusicPlayer() {
  const musicBtn  = document.getElementById('musicBtn');
  const musicIcon = document.getElementById('musicIcon');

  const audioFiles = [
    'assets/audio/music.mp3',
    'assets/audio/background.mp3',
    'assets/audio/romantic.mp3',
    'assets/music.mp3',
    'music.mp3',
    'background.mp3',
  ];

  let audio   = null;
  let playing = false;

  async function findAudioFile() {
    for (const file of audioFiles) {
      try {
        const resp = await fetch(file, { method: 'HEAD' });
        if (resp.ok) return file;
      } catch {}
    }
    return null;
  }

  findAudioFile().then(file => {
    if (!file) return;

    audio = new Audio(file);
    audio.loop   = true;
    audio.volume = 0.4;

    musicBtn.style.display = 'flex';

    musicBtn.addEventListener('click', () => {
      if (playing) {
        audio.pause();
        playing = false;
        musicBtn.classList.remove('playing');
        musicIcon.textContent = '\u266A';
        musicBtn.title = 'Play background music';
      } else {
        audio.play().catch(() => {});
        playing = true;
        musicBtn.classList.add('playing');
        musicIcon.textContent = '\u266B';
        musicBtn.title = 'Pause background music';
      }
    });
  });
})();

// ─────────────────────────────────────────────
// 13. BROKEN IMAGE FALLBACK
// ─────────────────────────────────────────────
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.style.display = 'none';
  });
});

// ─────────────────────────────────────────────
// 14. ACTIVE NAV HIGHLIGHT
// ─────────────────────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          const href = link.getAttribute('href').replace('#', '');
          link.style.color = (href === id) ? 'var(--champagne)' : '';
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-68px 0px 0px 0px' });

  sections.forEach(s => observer.observe(s));
})();
