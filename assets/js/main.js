import {calculateYearFromPurchases} from './calculator.js?v=20261111-net-range';
/* =========================================================
   FLASHBOX — main.js
   ========================================================= */
const reduceMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

/* Standardvilkår fra Gældende beslutninger · Flashbox. */
const yearly = sessionsPerMonth => calculateYearFromPurchases(sessionsPerMonth * 12);
const fmt = n => new Intl.NumberFormat('da-DK',{maximumFractionDigits:0}).format(n);
const fmtKr = n => fmt(n) + ' kr.';
const roundTo = (n, step) => Math.round(n / step) * step;

/* ---------- Nav ---------- */
const nav = document.getElementById('nav');
const onNav = () => nav.classList.toggle('scrolled', window.scrollY > 40);
onNav(); window.addEventListener('scroll', onNav, { passive: true });

/* ---------- Reveal ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .14, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 70 + 'ms'; io.observe(el); });

/* ---------- Cursor-lys ---------- */
(function () {
  const spot = document.getElementById('spot');
  if (!spot || reduceMotion || window.matchMedia('(pointer:coarse)').matches) return;
  let x = innerWidth / 2, y = innerHeight / 3, tx = x, ty = y, raf = null;
  const step = () => {
    x += (tx - x) * .12; y += (ty - y) * .12;
    spot.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
    if (Math.abs(tx - x) > .5 || Math.abs(ty - y) > .5) raf = requestAnimationFrame(step); else raf = null;
  };
  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; spot.classList.add('on'); if (!raf) raf = requestAnimationFrame(step); }, { passive: true });
  window.addEventListener('mouseleave', () => spot.classList.remove('on'));
})();

/* ---------- Hero: parallax på strimler ---------- */
(function () {
  const floaters = document.getElementById('floaters');
  if (!floaters || reduceMotion) return;
  const strips = [...floaters.querySelectorAll('.strip')];
  window.addEventListener('mousemove', e => {
    const dx = (e.clientX / innerWidth - .5), dy = (e.clientY / innerHeight - .5);
    strips.forEach(s => {
      const d = parseFloat(s.dataset.depth || '10');
      s.style.translate = (dx * d) + 'px ' + (dy * d) + 'px';
    });
  }, { passive: true });
})();

/* ---------- Hero parallax ---------- */
(function () {
  if (reduceMotion) return;
  const wm = document.querySelector('.hero__watermark');
  if (!wm) return;
  let t = false;
  const run = () => {
    const y = Math.min(window.scrollY, 900);
    wm.style.translate = '0 ' + (-y * 0.15) + 'px';
    t = false;
  };
  window.addEventListener('scroll', () => { if (!t) { t = true; requestAnimationFrame(run); } }, { passive: true });
})();

/* ---------- Magnetiske knapper ---------- */
if (!reduceMotion && !window.matchMedia('(pointer:coarse)').matches) {
  [...document.querySelectorAll('.btn')].filter(b => !b.closest('.nav')).forEach(b => {
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); const dx = (e.clientX - r.left - r.width / 2) / r.width, dy = (e.clientY - r.top - r.height / 2) / r.height; b.style.transform = 'translate(' + (dx * 6).toFixed(1) + 'px,' + (dy * 6 - 2).toFixed(1) + 'px)'; });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });
}

/* ---------- Start i toppen ved reload ---------- */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (!location.hash) { window.scrollTo(0, 0); window.addEventListener('pageshow', () => window.scrollTo(0, 0)); }

/* ---------- CTA -> beregner ---------- */
document.querySelectorAll('a[href="#beregner"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const box = document.getElementById('beregner');
    if (!box) return;
    e.preventDefault();
    box.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => { const n = document.getElementById('naetter'); if (n) n.focus({ preventScroll: true }); }, reduceMotion ? 60 : 600);
  });
});

/* ---------- Tællere ---------- */
function animateCount(el, target, dur, suffix) {
  suffix = suffix === undefined ? ' kr.' : suffix;
  const out = v => fmt(v) + suffix;
  if (reduceMotion) { el.textContent = out(target); return; }
  const t0 = performance.now(), ease = x => 1 - Math.pow(1 - x, 3);
  const step = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = out(target * ease(p));
    if (p < 1) requestAnimationFrame(step); else { el.textContent = out(target); el.classList.add('pop'); }
  };
  requestAnimationFrame(step);
}
(function () {
  const amount = document.getElementById('hero-amount');
  if (amount) { amount.textContent = '0 kr.'; setTimeout(() => amount.classList.add('pop'), 900); }
  const rev = document.getElementById('revenue-counter');
  if (rev) {
    let done = false;
    const ob = new IntersectionObserver((es) => { es.forEach(e => { if (e.isIntersecting && !done) { done = true; animateCount(rev, parseInt(rev.dataset.target, 10), 2400); ob.disconnect(); } }); }, { threshold: .5 });
    ob.observe(rev);
  }
  // Regneeksempler: udregnes af konstanterne ovenfor
  document.querySelectorAll('.ecard[data-sessions]').forEach(card => {
    const s = parseInt(card.dataset.sessions, 10);
    const num = card.querySelector('[data-count]');
    const val = yearly(s);
    let done = false;
    const ob = new IntersectionObserver((es) => { es.forEach(e => { if (e.isIntersecting && !done) { done = true; animateCount(num, val, 1800); ob.disconnect(); } }); }, { threshold: .4 });
    ob.observe(card);
  });
})();

/* ---------- Kort: lys der følger musen ---------- */
if (!window.matchMedia('(pointer:coarse)').matches) {
  document.querySelectorAll('.bcard,.ecard,.mcard,.step,.video-card,.reqitem').forEach(c => {
    c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); }, { passive: true });
  });
}

/* ---------- Marquee: dubler indholdet ---------- */
(function () {
  const t = document.getElementById('marqueeTrack');
  if (t) t.innerHTML += t.innerHTML;
})();

/* ---------- Cirklen: positionér, afslør, rotér med scroll ---------- */
(function () {
  const orbit = document.getElementById('orbit');
  const ring = document.getElementById('orbitLogos');
  if (!orbit || !ring) return;
  const items = [...ring.children];
  let R = 0;
  function position(rot) {
    items.forEach(l => {
      const a = (l._a + rot) * Math.PI / 180;
      l.style.setProperty('--x', (Math.cos(a) * R).toFixed(1) + 'px');
      l.style.setProperty('--y', (Math.sin(a) * R).toFixed(1) + 'px');
    });
  }
  let cur = 0, tgt = 0, ticking = false;
  function layout() {
    R = orbit.clientWidth * 0.40; const n = items.length || 1;
    items.forEach((l, i) => { l._a = -90 + i * (360 / n); l.style.transitionDelay = (i * 110) + 'ms'; });
    position(cur * 300 - 40);
  }
  layout(); window.addEventListener('resize', layout);
  let shown = false;
  const rev = new IntersectionObserver((es) => { es.forEach(e => { if (e.isIntersecting && !shown) { shown = true; orbit.classList.add('in'); rev.disconnect(); } }); }, { threshold: .3 });
  rev.observe(orbit);
  if (reduceMotion) return;
  const core = document.getElementById('core');
  const raysBox = document.getElementById('coreRays');
  const rays = [];
  if (raysBox) {
    const flash = document.createElement('div'); flash.className = 'core__flash'; raysBox.appendChild(flash); raysBox._flash = flash;
    for (let i = 0; i < 28; i++) {
      const r = document.createElement('i');
      r.style.setProperty('--a', (i * (360 / 28) + ((i * 37) % 11) - 5) + 'deg');
      r.style.setProperty('--len', (70 + ((i * 53) % 90)) + 'px');
      r._spd = 0.7 + ((i * 61) % 100) / 100;
      raysBox.appendChild(r); rays.push(r);
    }
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = x => x * x * (3 - 2 * x);
  function compute() {
    const r = orbit.getBoundingClientRect();
    tgt = clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
  }
  function render() {
    cur += (tgt - cur) * 0.09;
    const p = cur;
    position(p * 300 - 40);
    if (core) {
      // 3D-drej ind mod midten, frys drejningen under eksplosionen
      let e = clamp((p - 0.48) / 0.28, 0, 1); e = smooth(e);
      const pe = p - 0.8 * Math.max(0, p - 0.48) * e;
      const ry = -50 * Math.sin(pe * Math.PI * 2);
      const rx = 8 * Math.cos(pe * Math.PI);
      const sc = 0.88 + 0.16 * Math.sin(p * Math.PI) + e * 0.06;
      core.style.transform = 'rotateY(' + ry.toFixed(2) + 'deg) rotateX(' + rx.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
      const R2 = orbit.clientWidth * 0.5;
      const ee = Math.pow(e, 0.6);
      for (const r of rays) {
        const d = ee * R2 * r._spd * 0.55;
        r.style.setProperty('--d', d.toFixed(1) + 'px');
        r.style.setProperty('--s', (ee * (1 - e * 0.35)).toFixed(3));
        r.style.setProperty('--o', (e > 0.001 ? (1 - e * 0.85) : 0).toFixed(3));
      }
      if (raysBox && raysBox._flash) raysBox._flash.style.opacity = (e > 0 && e < 0.5 ? (1 - e * 2) * 0.9 : 0).toFixed(3);
    }
    if (Math.abs(tgt - cur) > 0.0006) requestAnimationFrame(render); else ticking = false;
  }
  const onScroll = () => { compute(); if (!ticking) { ticking = true; requestAnimationFrame(render); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  compute(); cur = tgt; requestAnimationFrame(render);
})();

/* ---------- Video-placeholders ---------- */
document.querySelectorAll('.vp__play').forEach(b => b.addEventListener('click', () => {
  b.animate([{ transform: 'scale(1)' }, { transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: 220 });
}));
