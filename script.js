/* ============================================================
   MUCORE — script.js
   Premium interactions & animations
   ============================================================ */

'use strict';

/* ── Loader ─────────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    fill.style.width = progress + '%';
    if (progress === 100) {
      setTimeout(() => loader.classList.add('hidden'), 300);
    }
  }, 80);
})();


/* ── Scroll Progress ────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / docH * 100) + '%';
  }, { passive: true });
})();


/* ── Navbar ─────────────────────────────────────────────── */
(function initNavbar() {
  const nav     = document.getElementById('navbar');
  const burger  = document.getElementById('navHamburger');
  const links   = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });

  // Close on nav link click
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      burger.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.querySelectorAll('.nav-link').forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
})();


/* ── Particle Canvas ────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;

  const COLORS = ['rgba(37,99,235,', 'rgba(0,229,255,', 'rgba(124,58,237,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(Math.floor(W * H / 14000), 90);
    particles = Array.from({ length: count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a:  Math.random() * 0.5 + 0.1,
      c:  COLORS[Math.floor(Math.random() * COLORS.length)]
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + p.a + ')';
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(37,99,235,${(1 - dist / 120) * 0.12})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  resize(); createParticles(); draw();
  window.addEventListener('resize', () => { resize(); createParticles(); }, { passive: true });

  // Mouse parallax on particles
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / W - 0.5) * 0.4;
    my = (e.clientY / H - 0.5) * 0.4;
    particles.forEach(p => {
      p.vx = (Math.random() - 0.5) * 0.3 + mx * 0.05;
      p.vy = (Math.random() - 0.5) * 0.3 + my * 0.05;
    });
  }, { passive: true });
})();


/* ── Typing Effect ──────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typingTarget');
  if (!el) return;
  const phrases = [
    'Intelligent Technology',
    'Secure Infrastructure',
    'Scalable Cloud Systems',
    'AI-Native Platforms',
    'Future Enterprises'
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (deleting) {
      el.textContent = current.slice(0, --charIdx);
    } else {
      el.textContent = current.slice(0, ++charIdx);
    }

    let delay = deleting ? 40 : 80;
    if (!deleting && charIdx === current.length) {
      delay = 2400; deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }

  // Start after loader
  setTimeout(type, 1200);
})();


/* ── Scroll Reveal ──────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();


/* ── Animated Counters ──────────────────────────────────── */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-number');
  let started = false;

  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  function animateCounter(el) {
    const target  = parseFloat(el.dataset.target);
    const suffix  = el.dataset.suffix || '';
    const duration = 2200;
    const start    = performance.now();

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const val = Math.round(easeOutExpo(t) * target);
      el.textContent = val + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !started) {
        started = true;
        nums.forEach(animateCounter);
        io.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats');
  if (statsSection) io.observe(statsSection);
})();


/* ── Testimonial Carousel ───────────────────────────────── */
(function initCarousel() {
  const track  = document.getElementById('testimonialTrack');
  const dotsEl = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoInterval;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() { autoInterval = setInterval(() => goTo(current + 1), 5000); }
  function stopAuto()  { clearInterval(autoInterval); }

  prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  // Touch/swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { stopAuto(); goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
  });

  startAuto();
})();


/* ── Contact Form Validation ────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  if (!form) return;

  const name    = document.getElementById('contactName');
  const email   = document.getElementById('contactEmail');
  const msg     = document.getElementById('contactMessage');
  const nameErr = document.getElementById('nameError');
  const emailErr= document.getElementById('emailError');
  const msgErr  = document.getElementById('messageError');
  const success = document.getElementById('formSuccess');
  const spinner = document.getElementById('formSpinner');

  function validate(field, errEl, condition, message) {
    if (!condition) {
      field.classList.add('error');
      errEl.textContent = message;
      return false;
    }
    field.classList.remove('error');
    errEl.textContent = '';
    return true;
  }

  // Live clear
  [name, email, msg].forEach(f => f.addEventListener('input', () => f.classList.remove('error')));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const v1 = validate(name,  nameErr,  name.value.trim().length >= 2,         'Please enter your name.');
    const v2 = validate(email, emailErr, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), 'Enter a valid email address.');
    const v3 = validate(msg,   msgErr,   msg.value.trim().length >= 10,         'Message must be at least 10 characters.');

    if (!(v1 && v2 && v3)) return;

    // Simulate submission
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    spinner.classList.remove('hidden');

    setTimeout(() => {
      spinner.classList.add('hidden');
      btn.disabled = false;
      form.reset();
      success.classList.remove('hidden');
      setTimeout(() => success.classList.add('hidden'), 5000);
    }, 1800);
  });
})();


/* ── Newsletter ─────────────────────────────────────────── */
(function initNewsletter() {
  const btn   = document.getElementById('newsletterBtn');
  const input = document.getElementById('newsletterEmail');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!input.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      input.style.borderColor = '#ef4444';
      setTimeout(() => (input.style.borderColor = ''), 2000);
      return;
    }
    btn.textContent = '✓ Subscribed';
    btn.style.background = '#16a34a';
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
    }, 3500);
  });
})();


/* ── Smooth Scroll ──────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── Card Tilt Effect ───────────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.tech-card, .service-card, .about-card');
  const maxTilt = 6;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();