/* ═══════════════════════════════════════════════
   LES SAJ — Main JavaScript
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Active Nav Link ───────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  // ── Sticky Nav ────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    const updateNav = () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
        nav.classList.remove('transparent');
      } else {
        nav.classList.remove('scrolled');
        nav.classList.add('transparent');
      }
    };
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  // ── Mobile Menu ───────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Scroll Reveal ─────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  // ── Hero BG Parallax ─────────────────────────
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = `scale(1) translateY(${scrollY * 0.4}px)`;
    }, { passive: true });
  }

  // ── Menu Category Filter ──────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuSections = document.querySelectorAll('.menu-section[data-cat]');
  const menuItems = document.querySelectorAll('.menu-item[data-cat]');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;

        if (menuSections.length) {
          menuSections.forEach(sec => {
            sec.style.display = (cat === 'all' || sec.dataset.cat === cat) ? 'block' : 'none';
          });
        }
        if (menuItems.length) {
          menuItems.forEach(item => {
            item.style.display = (cat === 'all' || item.dataset.cat === cat) ? 'flex' : 'none';
          });
        }
      });
    });
  }

  // ── Testimonials Slider ───────────────────────
  const slider = document.querySelector('.testimonials-slider');
  const sliderTrack = document.querySelector('.slider-track');
  const sliderDots = document.querySelectorAll('.slider-dot');
  const sliderPrev = document.querySelector('.slider-prev');
  const sliderNext = document.querySelector('.slider-next');
  let currentSlide = 0;

  function goToSlide(n) {
    const slides = sliderTrack?.querySelectorAll('.slide');
    if (!slides || !slides.length) return;
    currentSlide = (n + slides.length) % slides.length;
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    sliderDots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  if (sliderPrev) sliderPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
  if (sliderNext) sliderNext.addEventListener('click', () => goToSlide(currentSlide + 1));
  sliderDots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
  if (sliderTrack) setInterval(() => goToSlide(currentSlide + 1), 5000);

  // ── Counter Animation ─────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;
          const update = () => {
            current = Math.min(current + step, target);
            el.textContent = Math.round(current) + suffix;
            if (current < target) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  // ── Category Card Tabs (homepage) ────────────
  const catCards = document.querySelectorAll('.category-card');
  catCards.forEach(card => {
    card.addEventListener('click', () => {
      catCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // ── Newsletter Form ───────────────────────────
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const input = form.querySelector('input');
      if (!input.value.includes('@')) {
        input.style.borderColor = '#E53935';
        return;
      }
      btn.textContent = '✓ Subscribed!';
      btn.style.background = '#2E7D32';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
      }, 3000);
    });
  });

  // ── Catering Form ─────────────────────────────
  const cateringForm = document.querySelector('#catering-form');
  if (cateringForm) {
    cateringForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = cateringForm.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending...';
      setTimeout(() => {
        cateringForm.innerHTML = `
          <div style="text-align:center; padding: 3rem;">
            <div style="font-size:3rem; margin-bottom:1rem;">✅</div>
            <h3 style="color: var(--text); margin-bottom:0.75rem;">Request Received!</h3>
            <p style="color: var(--text-muted);">Thank you for your catering inquiry. Our team will contact you within 24 hours to discuss your event details and create a custom menu just for you.</p>
          </div>`;
      }, 1500);
    });
  }

  // ── Contact Form ──────────────────────────────
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      btn.disabled = true; btn.textContent = 'Sending...';
      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = '#2E7D32';
        contactForm.querySelectorAll('input, textarea').forEach(f => f.value = '');
        setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; btn.disabled = false; }, 3000);
      }, 1200);
    });
  }

  // ── Smooth Anchor Scrolling ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Ticker Duplication ────────────────────────
  const tickerInner = document.querySelector('.ticker-inner');
  if (tickerInner) {
    tickerInner.innerHTML += tickerInner.innerHTML;
  }

});
