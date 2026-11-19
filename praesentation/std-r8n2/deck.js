import * as model from '/assets/js/calculator.js?v=20261111-net-range';

const $ = id => document.getElementById(id);
const deck = $('deck');
const slides = [...deck.querySelectorAll('.slide')];
const film = $('film'), play = $('play');
let i = 0;

function go(n) {
  i = Math.max(0, Math.min(slides.length - 1, n));
  deck.style.transform = `translateX(${-i * 100}vw)`;
  $('count').textContent = `${i + 1} / ${slides.length}`;
  $('prev').disabled = i === 0;
  $('next').disabled = i === slides.length - 1;
  if (!slides[i].contains(film) && !film.paused) film.pause();
  if (document.activeElement && document.activeElement.blur && !slides[i].contains(document.activeElement)) document.activeElement.blur();
  try { history.replaceState(null, '', '#' + (i + 1)); } catch {}
}
$('prev').addEventListener('click', () => go(i - 1));
$('next').addEventListener('click', () => go(i + 1));

document.addEventListener('keydown', e => {
  if (e.target.matches('input')) return;
  if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(i + 1); }
  if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(i - 1); }
});

// Swipe only: a plain tap never changes slide.
let sx = null, sy = null;
deck.addEventListener('touchstart', e => {
  if (e.target.closest('input,button,.calc-in,video')) { sx = null; return; }
  sx = e.touches[0].clientX; sy = e.touches[0].clientY;
}, { passive: true });
deck.addEventListener('touchend', e => {
  if (sx === null) return;
  const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
  sx = null;
  if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) go(i + (dx < 0 ? 1 : -1));
}, { passive: true });

// Video: play on tap, show the button again when paused or finished.
function syncPlay() { play.classList.toggle('hidden', !film.paused && !film.ended); film.controls = !film.paused; }
play.addEventListener('click', () => { if (film.ended) film.currentTime = 0; film.play(); });
film.addEventListener('click', () => { if (!film.paused) film.pause(); });
for (const ev of ['play', 'pause', 'ended']) film.addEventListener(ev, syncPlay);
film.addEventListener('ended', () => { film.currentTime = 0; film.pause(); });

// Fullscreen where supported; on iPad, adding to Home Screen gives the same effect.
$('fs').addEventListener('click', () => {
  const el = document.documentElement;
  const req = el.requestFullscreen || el.webkitRequestFullscreen;
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  const on = document.fullscreenElement || document.webkitFullscreenElement;
  if (on) exit && exit.call(document); else if (req) req.call(el);
});
if (!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)) $('fs').hidden = true;

// Calculator, same model as /beregner/.
const nf = (n, d = 0) => new Intl.NumberFormat('da-DK', { maximumFractionDigits: d }).format(n);
const range = (lo, hi, f) => Math.abs(hi - lo) < 0.5 ? f(lo) : `${f(lo)} – ${f(hi)}`;
function render() {
  const nights = Number($('naetter').value);
  const raw = $('gaester').value.trim();
  const guests = Math.round(Number(raw));
  $('naetterOut').textContent = nights;
  for (const b of document.querySelectorAll('.chips button')) b.setAttribute('aria-pressed', String(Number(b.dataset.g) === guests));
  let r = null;
  if (raw !== '' && Number.isFinite(guests) && guests >= 0 && guests <= 100000) {
    try { r = model.calculateRange(guests, nights, 2); } catch { r = null; }
  }
  if (!r) { $('annual').textContent = '—'; $('monthly').textContent = '—'; $('prints').textContent = '—'; $('perNight').textContent = 'Indtast gæster pr. aften'; return; }
  $('annual').textContent = range(r.low.firstYearAnnual, r.high.firstYearAnnual, nf) + ' kr.';
  $('monthly').textContent = range(r.low.firstYearAnnual / 12, r.high.firstYearAnnual / 12, nf) + ' kr. pr. måned i gennemsnit';
  $('prints').textContent = range(r.low.annualPrints, r.high.annualPrints, nf);
  $('perNight').textContent = 'Svarer til ' + range(r.low.purchasesPerNight, r.high.purchasesPerNight, n => nf(n)) + ' køb pr. åbningsaften i gennemsnit';
}
for (const b of document.querySelectorAll('.stepper button')) {
  b.addEventListener('click', () => {
    const v = Math.max(1, Math.min(7, Number($('naetter').value) + Number(b.dataset.d)));
    $('naetter').value = v; render();
  });
}
for (const b of document.querySelectorAll('.chips button')) b.addEventListener('click', () => { $('gaester').value = b.dataset.g; render(); });
$('gaester').addEventListener('input', render);
$('calcForm').addEventListener('submit', e => { e.preventDefault(); $('gaester').blur(); });

render();
syncPlay();
const start = Number(location.hash.slice(1));
go(Number.isInteger(start) && start >= 1 ? start - 1 : 0);
