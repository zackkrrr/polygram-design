/* ============================================================
   POLYGRAM DESIGN — main.js
   ============================================================ */

// ---- Navbar scroll shrink ----
(function () {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ---- Mobile hamburger ----
(function () {
  const btn = document.querySelector('.nav-hamburger');
  const menu = document.querySelector('.nav-mobile');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => { btn.classList.remove('open'); menu.classList.remove('open'); })
  );
})();

// ---- Hero staggered reveals ----
(function () {
  const els = ['.hero-label', '.hero-name', '.hero-tagline', '.hero-cta']
    .map(s => document.querySelector(s)).filter(Boolean);
  if (!els.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  els.forEach(el => el.classList.add('go'));
})();

// ---- Hero canvas polygon animation ----
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const GOLD = '#b8860b';

  const shapes = [
    { xr: 0.78, yr: 0.28, r: 220, sides: 5, angle: 0,   speed:  0.0018, alpha: 0.30, lw: 1.2 },
    { xr: 0.88, yr: 0.72, r: 130, sides: 3, angle: 0.5,  speed: -0.0025, alpha: 0.22, lw: 1 },
    { xr: 0.62, yr: 0.12, r: 90,  sides: 4, angle: 0.3,  speed:  0.003,  alpha: 0.18, lw: 0.9 },
    { xr: 0.93, yr: 0.5,  r: 180, sides: 6, angle: 0,    speed:  0.0012, alpha: 0.14, lw: 0.7 },
    { xr: 0.68, yr: 0.88, r: 100, sides: 5, angle: 1,    speed: -0.002,  alpha: 0.18, lw: 0.8 },
  ];

  function resize() {
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function drawPolygon(s) {
    const cx = s.xr * canvas.width;
    const cy = s.yr * canvas.height;
    ctx.beginPath();
    for (let i = 0; i <= s.sides; i++) {
      const a = (i / s.sides) * Math.PI * 2 + s.angle;
      const x = cx + Math.cos(a) * s.r;
      const y = cy + Math.sin(a) * s.r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = s.lw;
    ctx.globalAlpha = s.alpha;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(s => { s.angle += s.speed; drawPolygon(s); });
    requestAnimationFrame(tick);
  }
  tick();
})();

// ---- Scroll section reveals ----
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = document.querySelectorAll('.reveal-section');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
})();

// ---- Page hero stagger (inner pages) ----
(function () {
  const hero = document.querySelector('.page-hero');
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  ['.breadcrumb', '.eyebrow', '.cat-badge', 'h1', '.lead']
    .map(s => hero.querySelector(s)).filter(Boolean)
    .forEach((el, i) => { el.style.animationDelay = `${0.1 + i * 0.2}s`; el.classList.add('go'); });
})();

// ---- Staggered child scroll reveals ----
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const grids = document.querySelectorAll('.reveal-stagger');
  if (!grids.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        [...e.target.children].forEach((child, i) =>
          child.style.setProperty('--stagger-delay', `${i * 90}ms`)
        );
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  grids.forEach(g => obs.observe(g));
})();

// ---- Project filter chips (projects.html) ----
(function () {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card[data-category]');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(c => c.classList.toggle('hidden', f !== 'all' && c.dataset.category !== f));
    });
  });
})();

// ---- Lightbox (project detail pages) ----
(function () {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg     = lb.querySelector('.lb-img');
  const lbCounter = lb.querySelector('.lb-counter');
  const lbClose   = lb.querySelector('.lb-close');
  const lbPrev    = lb.querySelector('.lb-prev');
  const lbNext    = lb.querySelector('.lb-next');
  const items     = Array.from(document.querySelectorAll('.gallery-item'));
  let cur = 0;

  function show(i) {
    cur = i;
    const img = items[cur].querySelector('img');
    lbImg.src = img.src; lbImg.alt = img.alt;
    lbCounter.textContent = `${cur + 1} / ${items.length}`;
  }
  function open(i)  { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close()  { lb.classList.remove('open'); document.body.style.overflow = ''; }
  function prev()   { show((cur - 1 + items.length) % items.length); }
  function next()   { show((cur + 1) % items.length); }

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));
  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
})();

// ---- Contact form (contact.html) ----
(function () {
  const submitBtn = document.getElementById('contact-submit');
  if (!submitBtn) return;

  function val(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function err(id, has) { const el = document.getElementById(id); if (el) el.classList.toggle('error', has); }

  submitBtn.addEventListener('click', () => {
    const name    = val('f-name');
    const email   = val('f-email');
    const message = val('f-message');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    err('f-name',    !name);
    err('f-email',   !email || !emailOk);
    err('f-message', !message);

    if (!name || !email || !emailOk || !message) return;

    ['f-name','f-email','f-phone','f-message'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    ['f-name','f-email','f-message'].forEach(id => err(id, false));
    const ok = document.getElementById('form-success');
    if (ok) ok.classList.add('show');
  });
})();
