/* ==========================================================================
   animations.js
   Handles: scroll-reveal, custom cursor, mouse-follow parallax on hero cards,
   magnetic buttons, counter animation, typing animation, skill bar reveal.
   Vanilla JS only — no dependencies.
   ========================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
   * 1. SCROLL REVEAL (IntersectionObserver)
   * ------------------------------------------------------------------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal-up, .skill-bars__track');
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    /* Elements still waiting to be revealed. Kept as a Set so the safety sweep
       below stays cheap on the long case-study pages (100+ targets). */
    const pending = new Set(targets);

    function reveal(el) {
      el.classList.add('is-visible');
      pending.delete(el);
      observer.unobserve(el);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    targets.forEach((el) => observer.observe(el));

    /* Safety sweep.
       The observer only reveals on isIntersecting, and an entry can be
       delivered a frame or more after it was computed — so a fast flick, a
       jump-to-anchor, or a lazy image that shifts layout mid-scroll can hand us
       an entry whose element has already left the viewport. Those blocks then
       sit at opacity 0 until the visitor happens to scroll back, which reads as
       a blank section. This reveals anything the viewport has reached or passed,
       regardless of what the observer reported. It runs at most once per frame,
       only while something is still pending, and disconnects when the set
       empties, so a fully-read page costs nothing. */
    let queued = false;
    function sweep() {
      queued = false;
      const limit = window.innerHeight - 60;
      pending.forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.top < limit) reveal(el);
      });
      if (!pending.size) {
        observer.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    }
    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(sweep);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* ---------------------------------------------------------------------
   * 2. CUSTOM CURSOR (desktop / pointer:fine only)
   * ------------------------------------------------------------------- */
  function initCustomCursor() {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function loop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    const hoverTargets = document.querySelectorAll('a, button, .project-card, input, textarea');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });
  }

  /* ---------------------------------------------------------------------
   * 3. MOUSE-FOLLOW PARALLAX ON HERO FLOATING CARDS
   * ------------------------------------------------------------------- */
  function initParallax() {
    const stage = document.getElementById('portraitCard');
    if (!stage || prefersReducedMotion) return;
    const cards = stage.querySelectorAll('.float-card');

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      cards.forEach((card) => {
        const depth = parseFloat(card.dataset.depth) || 16;
        card.style.transform = `translate(${px * depth}px, ${py * depth}px)`;
      });
      stage.style.transform = `rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
    });

    stage.addEventListener('mouseleave', () => {
      cards.forEach((card) => { card.style.transform = 'translate(0,0)'; });
      stage.style.transform = 'rotateY(0) rotateX(0)';
    });
  }

  /* ---------------------------------------------------------------------
   * 4. MAGNETIC BUTTONS
   * ------------------------------------------------------------------- */
  function initMagneticButtons() {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------------------------------------------------------------------
   * 5. COUNTER ANIMATION (hero stats)
   * ------------------------------------------------------------------- */
  function initCounters() {
    const counters = document.querySelectorAll('.stat__num');
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      if (prefersReducedMotion) {
        el.textContent = target;
      } else {
        requestAnimationFrame(tick);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------------------
   * 6. TYPING ANIMATION (hero role)
   * ------------------------------------------------------------------- */
  function initTyping() {
    const el = document.getElementById('typeTarget');
    if (!el || prefersReducedMotion) return;

    const words = ['UI/UX Designer', 'Product Designer', 'Design Systems', 'Motion & Video'];
    let wordIndex = 0, charIndex = words[0].length, deleting = true;

    function step() {
      const word = words[wordIndex];
      if (deleting) {
        charIndex--;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(step, 400);
          return;
        }
      } else {
        charIndex++;
        const nextWord = words[wordIndex];
        el.textContent = nextWord.slice(0, charIndex);
        if (charIndex === nextWord.length) {
          deleting = true;
          setTimeout(step, 1800);
          return;
        }
      }
      setTimeout(step, deleting ? 45 : 65);
    }
    setTimeout(step, 2200);
  }

  /* Expose init function so main.js can call these after DOM ready */
  window.PortfolioAnimations = {
    initScrollReveal,
    initCustomCursor,
    initParallax,
    initMagneticButtons,
    initCounters,
    initTyping,
  };
})();
