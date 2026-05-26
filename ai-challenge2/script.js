/* ═══════════════════════════════════════════════════════════
   LexAI — Premium JavaScript
   GSAP · AOS · Particles · Chatbot · Counters · Carousel
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── DOM Ready ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initAOS();
  initNavbar();
  initScrollProgress();
  initCursor();
  initParticles();
  initMagneticButtons();
  initThemeToggle();
  initAccessibility();
  initChatbot();
  initTestimonials();
  initCounters();
  initAppointmentForm();
  initCharCounter();
  initNewsletterForm();
  initKeyboardNav();
  initGSAP();
  setMinDate();
});

/* ─── 1. LOADER ─────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('fade-out');
      loader.addEventListener('animationend', () => {
        loader.style.display = 'none';
        document.body.style.overflow = '';
      }, { once: true });
    }, 2400);
  });
  document.body.style.overflow = 'hidden';
}

/* ─── 2. AOS ─────────────────────────────────────────────── */
function initAOS() {
  AOS.init({
    duration: 800,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    once: true,
    offset: 60,
    disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });
}

/* ─── 3. NAVBAR ─────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const sections = document.querySelectorAll('section[id]');
  const links    = nav.querySelectorAll('.nav-link');

  const handleScroll = () => {
    // Sticky style
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    // Active link
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.getAttribute('id');
    });
    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Smooth close on mobile link click
  links.forEach(l => {
    l.addEventListener('click', () => {
      const collapse = document.getElementById('navMenu');
      if (collapse && collapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        bsCollapse && bsCollapse.hide();
      }
    });
  });
}

/* ─── 4. SCROLL PROGRESS ────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total  = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = `${pct}%`;
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }, { passive: true });
}

/* ─── 5. CUSTOM CURSOR ──────────────────────────────────── */
function initCursor() {
  const glow = document.getElementById('cursor-glow');
  const dot  = document.getElementById('cursor-dot');
  if (!glow || !dot) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mx = 0, my = 0, gx = 0, gy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = `${mx}px`;
    dot.style.top  = `${my}px`;
  }, { passive: true });

  // Smooth glow follow
  const animGlow = () => {
    gx += (mx - gx) * 0.06;
    gy += (my - gy) * 0.06;
    glow.style.left = `${gx}px`;
    glow.style.top  = `${gy}px`;
    requestAnimationFrame(animGlow);
  };
  animGlow();

  // Hover effect on interactive elements
  const interactives = 'a, button, .practice-card, .attorney-card, .glass-card, input, select, textarea, .chat-chip';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) dot.classList.add('hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) dot.classList.remove('hover');
  });
}

/* ─── 6. PARTICLES ──────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, particles = [];

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const GOLD = [201, 168, 76];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.opDir = Math.random() > 0.5 ? 1 : -1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += 0.002 * this.opDir;
      if (this.opacity >= 0.6 || this.opacity <= 0.05) this.opDir *= -1;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GOLD[0]},${GOLD[1]},${GOLD[2]},${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles (fewer on mobile)
  const count = window.innerWidth < 768 ? 60 : 150;
  for (let i = 0; i < count; i++) particles.push(new Particle());

  // Draw connections
  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${GOLD[0]},${GOLD[1]},${GOLD[2]},${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  };
  animate();
}

/* ─── 7. MAGNETIC BUTTONS ───────────────────────────────── */
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ─── 8. THEME TOGGLE ───────────────────────────────────── */
function initThemeToggle() {
  const html = document.documentElement;
  const saved = localStorage.getItem('lexai-theme') || 'dark';
  html.setAttribute('data-theme', saved);

  const toggleTheme = () => {
    const cur = html.getAttribute('data-theme');
    const nxt = cur === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', nxt);
    localStorage.setItem('lexai-theme', nxt);
    document.querySelectorAll('#themeToggle, #themeToggleMob').forEach(btn => {
      btn.textContent = nxt === 'dark' ? '☀' : '🌙';
      btn.setAttribute('aria-label', `Switch to ${nxt === 'dark' ? 'light' : 'dark'} mode`);
    });
  };

  document.querySelectorAll('#themeToggle, #themeToggleMob').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
    btn.textContent = saved === 'dark' ? '☀' : '🌙';
  });

  // High contrast
  const hcBtn = document.getElementById('highContrast');
  if (hcBtn) {
    hcBtn.addEventListener('click', () => {
      const cur = html.getAttribute('data-contrast');
      if (cur === 'high') {
        html.removeAttribute('data-contrast');
        hcBtn.setAttribute('aria-pressed', 'false');
      } else {
        html.setAttribute('data-contrast', 'high');
        hcBtn.setAttribute('aria-pressed', 'true');
      }
    });
  }
}

/* ─── 9. ACCESSIBILITY ──────────────────────────────────── */
function initAccessibility() {
  const root = document.documentElement;
  let fontSize = parseFloat(getComputedStyle(root).getPropertyValue('--base-font-size')) || 16;

  const setSize = size => {
    size = Math.min(Math.max(size, 12), 24);
    fontSize = size;
    root.style.setProperty('--base-font-size', `${size}px`);
    root.style.fontSize = `${size}px`;
    localStorage.setItem('lexai-fontsize', size);
  };

  // Restore saved size
  const saved = localStorage.getItem('lexai-fontsize');
  if (saved) setSize(parseFloat(saved));

  document.querySelectorAll('#fontIncrease, #fontIncreaseMob').forEach(btn => {
    btn.addEventListener('click', () => setSize(fontSize + 2));
  });
  document.querySelectorAll('#fontDecrease').forEach(btn => {
    btn.addEventListener('click', () => setSize(fontSize - 2));
  });
}

/* ─── 10. CHATBOT ────────────────────────────────────────── */
const AI_RESPONSES = {
  default: [
    "Thank you for reaching out to LexMind™. Based on what you've described, I recommend scheduling a consultation with one of our senior attorneys for a personalised assessment.",
    "That's a situation our attorneys handle frequently. Our AI analysis suggests you may have strong legal standing. Would you like me to connect you with a specialist?",
    "I've analysed similar cases in our database. There are several legal avenues worth exploring. Our team would be happy to discuss these in detail during a free consultation.",
    "This falls within our practice areas. Based on 12 million case precedents, I can identify strong precedents in your favour. Shall I prepare a preliminary brief?",
  ],
  'contract dispute': "Contract disputes typically involve breach of contract claims, force majeure provisions, or interpretation disputes. LexAI has a 98% success rate in commercial contract litigation. Our team can review your contract within 24 hours.",
  'criminal defense': "Criminal matters require immediate attention. Our criminal defense team, led by Sophia Larène, has achieved acquittals in 96% of high-stakes federal cases. Please call our urgent line or book a consultation today.",
  'visa help': "Immigration law is one of our core strengths. Elena Cross and her team operate across 18 jurisdictions with a 100% asylum success rate. What type of visa or immigration matter are you facing?",
};

let chatTyping = false;

function sendChat() {
  if (chatTyping) return;
  const input = document.getElementById('chatInput');
  const body  = document.getElementById('chatBody');
  if (!input || !body) return;
  const text = input.value.trim();
  if (!text) return;

  // User message
  appendMsg(body, 'user', text);
  input.value = '';

  // Typing indicator
  const typingEl = appendTyping(body);
  chatTyping = true;

  // AI response
  setTimeout(() => {
    typingEl.remove();
    chatTyping = false;
    const lower = text.toLowerCase();
    let response = AI_RESPONSES.default[Math.floor(Math.random() * AI_RESPONSES.default.length)];
    Object.keys(AI_RESPONSES).forEach(key => {
      if (key !== 'default' && lower.includes(key)) response = AI_RESPONSES[key];
    });
    appendMsg(body, 'ai', response);
  }, 1400 + Math.random() * 600);
}

function askAI(btn) {
  const input = document.getElementById('chatInput');
  if (input) {
    input.value = btn.textContent;
    btn.closest('.chat-suggestions')?.remove();
    sendChat();
  }
}

function appendMsg(container, role, text) {
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.setAttribute('aria-label', `${role === 'ai' ? 'AI' : 'You'}: ${text}`);
  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
  div.innerHTML = `
    <div class="msg-avatar" aria-hidden="true">${role === 'ai' ? 'AI' : 'You'}</div>
    <div class="msg-bubble">
      <p>${escapeHTML(text)}</p>
      <span class="msg-time">${time}</span>
    </div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function appendTyping(container) {
  const div = document.createElement('div');
  div.className = 'chat-msg ai';
  div.setAttribute('aria-label', 'AI is typing');
  div.innerHTML = `<div class="msg-avatar" aria-hidden="true">AI</div><div class="msg-bubble"><div class="typing-indicator" aria-hidden="true"><span></span><span></span><span></span></div></div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function initChatbot() {
  const input = document.getElementById('chatInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); sendChat(); }
    });
  }
}

// Expose to HTML
window.sendChat = sendChat;
window.askAI    = askAI;

/* ─── 11. TESTIMONIALS CAROUSEL ─────────────────────────── */
function initTestimonials() {
  const track  = document.getElementById('testimonialsTrack');
  const dotsEl = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let interval;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `testi-dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  const isMobile = () => window.innerWidth < 992;
  const visibleCount = () => isMobile() ? 1 : 2;

  function goTo(index) {
    const max = Math.ceil(cards.length / visibleCount()) - 1;
    current = Math.max(0, Math.min(index, max));
    const slideW = isMobile() ? 100 : 50;
    track.style.transform = `translateX(-${current * slideW * visibleCount()}%)`;
    dotsEl.querySelectorAll('.testi-dot').forEach((d, i) => {
      const active = i === current;
      d.classList.toggle('active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  prevBtn && prevBtn.addEventListener('click', () => {
    goTo(current === 0 ? Math.ceil(cards.length / visibleCount()) - 1 : current - 1);
    resetInterval();
  });
  nextBtn && nextBtn.addEventListener('click', () => {
    goTo(current >= Math.ceil(cards.length / visibleCount()) - 1 ? 0 : current + 1);
    resetInterval();
  });

  // Auto-advance
  const startInterval = () => {
    interval = setInterval(() => goTo(current >= Math.ceil(cards.length / visibleCount()) - 1 ? 0 : current + 1), 5000);
  };
  const resetInterval = () => { clearInterval(interval); startInterval(); };
  startInterval();

  // Keyboard navigation
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetInterval(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetInterval(); }
  });

  // Resize
  window.addEventListener('resize', () => goTo(current), { passive: true });
}

/* ─── 12. COUNTERS ──────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = el => {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    let start = null;

    const step = ts => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const val  = Math.floor(easeOut(prog) * target);
      el.textContent = `${prefix}${val.toLocaleString()}${suffix}`;
      if (prog < 1) requestAnimationFrame(step);
      else el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ─── 13. APPOINTMENT FORM ──────────────────────────────── */
function initAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      // Focus first invalid
      const firstInvalid = form.querySelector(':invalid');
      firstInvalid && firstInvalid.focus();
      return;
    }
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span>Processing...</span> <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>';
    setTimeout(() => {
      form.innerHTML = `<div class="success-msg" role="alert" aria-live="assertive">
        <i class="fas fa-check-circle" style="font-size:2.5rem;display:block;margin-bottom:1rem;" aria-hidden="true"></i>
        <strong>Consultation Confirmed!</strong><br>
        <span style="font-size:0.85rem;opacity:0.8;font-family:var(--font-body)">Our team will contact you within 2 business hours. Check your email for confirmation.</span>
      </div>`;
    }, 1800);
  });
}

/* ─── 14. CHAR COUNTER ──────────────────────────────────── */
function initCharCounter() {
  const ta = document.getElementById('apptMessage');
  const cc = document.getElementById('charCount');
  if (!ta || !cc) return;
  ta.addEventListener('input', () => {
    cc.textContent = `${ta.value.length}/1000`;
    cc.style.color = ta.value.length > 900 ? '#ef4444' : 'var(--white-dim)';
  });
}

/* ─── 15. NEWSLETTER ────────────────────────────────────── */
function initNewsletterForm() {
  document.querySelectorAll('.footer-newsletter').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn   = form.querySelector('button');
      if (!input || !input.value.includes('@')) {
        input.style.borderColor = '#ef4444';
        setTimeout(() => input.style.borderColor = '', 2000);
        return;
      }
      btn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';
      btn.style.background = '#22C55E';
      input.value = '';
      input.placeholder = 'You\'re subscribed!';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-arrow-right" aria-hidden="true"></i>';
        btn.style.background = '';
        input.placeholder = 'your@email.com';
      }, 3000);
    });
  });
}

/* ─── 16. KEYBOARD NAVIGATION ───────────────────────────── */
function initKeyboardNav() {
  // Tab through practice cards with keyboard
  document.querySelectorAll('.practice-card[tabindex]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Skip to next section with arrow keys from hero
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        document.getElementById('about')?.focus();
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ─── 17. GSAP ANIMATIONS ───────────────────────────────── */
function initGSAP() {
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Parallax floating elements
    gsap.to('.float-el.gavel', {
      y: -60,
      scrollTrigger: { trigger: '#hero', scrub: 1.5 },
    });
    gsap.to('.float-el.scales', {
      y: -90,
      scrollTrigger: { trigger: '#hero', scrub: 2 },
    });
    gsap.to('.float-el.book', {
      y: -40,
      scrollTrigger: { trigger: '#hero', scrub: 1 },
    });
    gsap.to('.float-el.courthouse', {
      y: -70,
      scrollTrigger: { trigger: '#hero', scrub: 1.8 },
    });

    // Stats section parallax
    gsap.from('.stat-card', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.section-stats',
        start: 'top 80%',
      },
    });

    // About visual parallax
    gsap.to('.about-card-3d', {
      rotationY: 180,
      scrollTrigger: {
        trigger: '#about',
        start: 'top center',
        end: 'bottom top',
        scrub: 3,
      },
    });
  }

  // Hero title entrance (after loader)
  window.addEventListener('load', () => {
    setTimeout(() => {
      gsap.from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 2.6 });
      gsap.from('.title-line',    { y: 60, opacity: 0, duration: 1,   ease: 'power3.out', delay: 2.8 });
      gsap.from('.title-em',      { y: 60, opacity: 0, duration: 1,   ease: 'power3.out', delay: 3.0 });
      gsap.from('.title-sub',     { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 3.2 });
      gsap.from('.hero-desc',     { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 3.4 });
      gsap.from('.hero-cta',      { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 3.6 });
      gsap.from('.hero-badges',   { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 3.8 });
    }, 0);
  });

  // Navbar entrance
  gsap.from('#mainNav', { y: -80, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 2.5 });
}

/* ─── 18. SET MIN DATE ──────────────────────────────────── */
function setMinDate() {
  const dateInput = document.getElementById('apptDate');
  if (!dateInput) return;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split('T')[0];
}

/* ─── 19. SMOOTH SCROLL for all anchor links ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
});

/* ─── 20. GLASS CARD 3D TILT ────────────────────────────── */
(function init3DTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.practice-card, .attorney-card, .case-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const rx = ((e.clientY - cy) / rect.height) * -8;
      const ry = ((e.clientX - cx) / rect.width)  *  8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── 21. ACTIVE SECTION HIGHLIGHT ─────────────────────── */
(function initSectionObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });

  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
})();

/* ─── 22. PRACTICE CARD INTERACTION ─────────────────────── */
document.querySelectorAll('.practice-card').forEach(card => {
  card.addEventListener('click', () => {
    document.getElementById('appointment')?.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ─── 23. VISUAL LOADING PERFORMANCE ────────────────────── */
// Lazy load AOS-observed elements
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('loaded');
        imgObserver.unobserve(e.target);
      }
    });
  });
  document.querySelectorAll('[data-lazy]').forEach(el => imgObserver.observe(el));
}

/* ─── 24. PRINT FRIENDLY ─────────────────────────────────── */
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('[data-aos]').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
});
