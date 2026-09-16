/* ==========================================================================
   case-study.js — behavior for standalone case study pages
   Shares design language with main.js but scoped to a single project page.

   Handles: screens gallery, lightbox (gallery + inline deep-dive shots),
   sticky section nav with scroll spy, impact metric ring, header state,
   scroll progress, back-to-top, theme toggle, footer year.
   Vanilla JS only — no dependencies.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ---------------------------------------------------------------------
   * GALLERY DATA — single source of truth for this case study.
   * Inline deep-dive figures reference these by index via data-shot,
   * so the lightbox can page through the whole set from anywhere.
   * ------------------------------------------------------------------- */
  /* A page may supply its own set via window.CS_GALLERY before this script
     loads; entries there may carry a `name` so markup can reference a screen
     by name instead of a fragile numeric index. */
  const GALLERY = window.CS_GALLERY || [
    { src: 'assets/images/customer-portal/dashboard-v2.jpg', caption: 'Property dashboard — value, quick actions, and services at a glance' },
    { src: 'assets/images/customer-portal/access-cards-request.jpg', caption: 'Request Access Cards — property context pre-filled, then only what the request needs' },
    { src: 'assets/images/customer-portal/payment-schedule.jpg', caption: 'Payment schedule — three summary tiles above seven milestones' },
    { src: 'assets/images/customer-portal/quick-pay.jpg', caption: 'Quick Pay — overdue and upcoming combined, with the card limit disclosed up front' },
    { src: 'assets/images/customer-portal/quick-pay-empty.jpg', caption: 'Quick Pay empty state — nothing due, framed as reassurance' },
    { src: 'assets/images/customer-portal/quick-pay-success.jpg', caption: 'Payment confirmed, with the next step stated' },
    { src: 'assets/images/customer-portal/payment-validation.jpg', caption: 'Inline validation that routes the customer to the right tool' },
    { src: 'assets/images/customer-portal/payment-failed.jpg', caption: 'Failure state with two concrete recovery options' },
    { src: 'assets/images/customer-portal/payment-history.jpg', caption: 'Payment history — receipts, amount-first, across all properties' },
    { src: 'assets/images/customer-portal/payment-history-filter.jpg', caption: 'Grouped multi-category filtering for a history that only grows' },
    { src: 'assets/images/customer-portal/documents.jpg', caption: 'Document centre — contracts and confirmations on demand' },
    { src: 'assets/images/customer-portal/documents-empty.jpg', caption: 'Empty state written as explanation, not as failure' },
    { src: 'assets/images/customer-portal/raise-request.jpg', caption: 'Raise a Request — free-text reporting with optional upload' },
    { src: 'assets/images/customer-portal/noc-request.jpg', caption: 'NOC Request — structured document-type selection' },
    { src: 'assets/images/customer-portal/noc-success.jpg', caption: 'Confirmation issuing a quotable reference number' },
    { src: 'assets/images/customer-portal/charges.jpg', caption: 'Charges — the payment table reused for incidental fees' },
    { src: 'assets/images/customer-portal/dashboard.jpg', caption: 'Navigation v1 — the grouping the refresh replaced (kept for reference)' }
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* data-shot accepts either an index ("3") or a gallery entry name
     ("profile-50"). Names are resolved here so reordering the gallery can
     never silently point a figure at the wrong screen. */
  const SHOT_INDEX = new Map(GALLERY.map((g, i) => [g.name, i]).filter(([n]) => n));
  function shotIndex(fig) {
    const raw = fig.dataset.shot;
    if (SHOT_INDEX.has(raw)) return SHOT_INDEX.get(raw);
    const n = parseInt(raw, 10);
    return Number.isNaN(n) ? 0 : n;
  }

  /* ---------------------------------------------------------------------
   * RENDER GALLERY
   * ------------------------------------------------------------------- */
  const galleryEl = document.getElementById('screensGallery');
  if (galleryEl) {
    galleryEl.innerHTML = GALLERY.map((g, i) => `
      <figure class="cs-gallery__item reveal-up" style="--delay:${Math.min(i, 8) * 0.05}s" data-shot="${i}" tabindex="0" role="button" aria-label="Open larger view: ${g.caption}">
        <img src="${g.src}" alt="${g.caption}" loading="lazy">
        <figcaption>${g.caption}</figcaption>
      </figure>
    `).join('');
  }

  /* ---------------------------------------------------------------------
   * LIGHTBOX — shared by the gallery and every inline [data-shot] figure.
   * Listeners are attached exactly once at page level.
   * ------------------------------------------------------------------- */
  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox) {
    let currentIndex = 0;
    let lastFocused = null;
    const imgEl = document.getElementById('lightboxImg');
    const captionEl = document.getElementById('lightboxCaption');
    const closeBtn = lightbox.querySelector('.lightbox__close');

    const isOpen = () => lightbox.classList.contains('is-open');

    function show(index) {
      currentIndex = (index + GALLERY.length) % GALLERY.length;
      imgEl.src = GALLERY[currentIndex].src;
      imgEl.alt = GALLERY[currentIndex].caption;
      captionEl.textContent = `${GALLERY[currentIndex].caption} — ${currentIndex + 1}/${GALLERY.length}`;
    }

    function open(index, trigger) {
      lastFocused = trigger || null;
      show(index);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    if (prevBtn) prevBtn.addEventListener('click', () => show(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => show(currentIndex + 1));

    lightbox.querySelectorAll('[data-lightbox-close]').forEach((el) => el.addEventListener('click', close));

    /* One delegated handler covers the gallery and all deep-dive figures,
       including gallery items injected above. */
    document.addEventListener('click', (e) => {
      const fig = e.target.closest('[data-shot]');
      if (!fig) return;
      open(shotIndex(fig), fig);
    });

    document.addEventListener('keydown', (e) => {
      const fig = e.target.closest && e.target.closest('[data-shot]');
      if (fig && !isOpen() && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        open(shotIndex(fig), fig);
        return;
      }
      if (!isOpen()) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(currentIndex - 1);
      if (e.key === 'ArrowRight') show(currentIndex + 1);
    });
  }

  /* ---------------------------------------------------------------------
   * IMPACT METRIC RING (animates once visible)
   * ------------------------------------------------------------------- */
  const ring = document.getElementById('impactRing');
  const ringNum = document.getElementById('impactRingNum');
  if (ring && ringNum) {
    const targetVal = 84;
    const r = 54;
    const circumference = 2 * Math.PI * r;
    const targetOffset = circumference * (1 - targetVal / 100);

    const animateRing = () => {
      ring.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)';
      ring.style.strokeDashoffset = targetOffset;
      if (prefersReducedMotion) {
        ringNum.textContent = `${targetVal}%`;
        return;
      }
      const start = performance.now();
      const duration = 1400;
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        ringNum.textContent = `${Math.round(progress * targetVal)}%`;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { animateRing(); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      obs.observe(ring);
    } else {
      animateRing();
    }
  }

  /* ---------------------------------------------------------------------
   * HEADER STATE, SCROLL PROGRESS, BACK TO TOP, STICKY SUBNAV SCROLL SPY
   * ------------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const subnavInner = document.querySelector('.cs-subnav__inner');
  const subnavLinks = Array.from(document.querySelectorAll('[data-subnav]'));
  const sections = subnavLinks.map((link) => document.querySelector(link.getAttribute('href')));

  /* Offset for the fixed header + sticky subnav so a section counts as
     "current" the moment it clears the chrome above it. */
  function chromeHeight() {
    const headerH = header ? header.offsetHeight : 76;
    const subnavH = subnavInner ? subnavInner.offsetHeight : 0;
    return headerH + subnavH + 16;
  }

  let activeIndex = -1;

  function onScroll() {
    const scrollY = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', scrollY > 20);
    if (backToTop) backToTop.classList.toggle('is-visible', scrollY > 600);

    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }

    if (!sections.length) return;
    const offset = chromeHeight();
    let currentIndex = -1;
    sections.forEach((section, i) => {
      if (section && section.getBoundingClientRect().top <= offset) currentIndex = i;
    });

    if (currentIndex !== activeIndex) {
      activeIndex = currentIndex;
      subnavLinks.forEach((link, i) => link.classList.toggle('is-active', i === currentIndex));

      /* Keep the active pill in view on narrow screens without hijacking
         the page scroll — scrollLeft only, never scrollIntoView. */
      const activeLink = subnavLinks[currentIndex];
      if (activeLink && subnavInner) {
        const target = activeLink.offsetLeft - (subnavInner.clientWidth / 2) + (activeLink.offsetWidth / 2);
        subnavInner.scrollTo({ left: Math.max(0, target), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }
  }

  document.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));
  }

  /* Anchor jumps must clear the fixed header + sticky subnav. */
  subnavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - chromeHeight() + 8;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------------------------------------------------------------------
   * THEME TOGGLE (persisted, shared key with main site)
   * ------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    let storedTheme = null;
    try { storedTheme = localStorage.getItem('portfolio-theme'); } catch (err) { /* private mode */ }
    /* Dark is the default. The inline script in <head> has already applied
       it; this just keeps the toggle's state in sync. */
    const initialTheme = storedTheme === 'light' ? 'light' : 'dark';

    if (initialTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.setAttribute('aria-pressed', 'true');
    }

    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
      themeToggle.setAttribute('aria-pressed', String(!isDark));
      try { localStorage.setItem('portfolio-theme', next); } catch (err) { /* private mode */ }
    });
  }

  /* ---------------------------------------------------------------------
   * FOOTER YEAR
   * ------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
   * SHARED ANIMATION HOOKS (from animations.js)
   * ------------------------------------------------------------------- */
  if (window.PortfolioAnimations) {
    window.PortfolioAnimations.initScrollReveal();
    window.PortfolioAnimations.initCustomCursor();
    window.PortfolioAnimations.initMagneticButtons();
  }
});
