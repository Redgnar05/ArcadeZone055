// ── Juegos ────────────────────────────────────────────────────────────────────
// Las rutas de img/ y src son relativas a la raíz del proyecto (ZonaArcade/).
// arcade.html vive en arcade-zone/ → sube un nivel con ../
const games = [
  // ── Math Quest (juego local, sin iframe de Scratch) ───────────────────────
  {
    id: 'math-quest',
    title: 'Math Quest',
    genre: 'Educativo',
    emoji: '🧮',
    bg: 'url("../img/imgMath-quest.png")',
    src: '../math-quest/math-quest.html',   // ruta relativa desde arcade-zone/
    scratch: null,                           // no tiene página de Scratch
  },
  {
    id: 'balltwo',
    title: 'BallTwo',
    genre: 'Arcade',
    emoji: '🟡',
    bg: 'url("../img/img1.png")',
    src: 'https://scratch.mit.edu/projects/1309711573/embed',
    scratch: 'https://scratch.mit.edu/projects/1309711573',
  },
  {
    id: 'dinodisparo',
    title: 'DinoDisparo',
    genre: 'Acción',
    emoji: '🦖',
    bg: 'url("../img/img2.png")',
    src: 'https://scratch.mit.edu/projects/1308851657/embed',
    scratch: 'https://scratch.mit.edu/projects/1308851657',
  },
  {
    id: 'nave-espacial',
    title: 'Nave Espacial',
    genre: 'Shooter',
    emoji: '🚀',
    bg: 'url("../img/img3.png")',
    src: 'https://scratch.mit.edu/projects/1305289171/embed',
    scratch: 'https://scratch.mit.edu/projects/1305289171',
  },
  {
    id: 'murcielago',
    title: 'Escape del Murciélago',
    genre: 'Aventura',
    emoji: '🦇',
    bg: 'url("../img/img4.png")',
    src: 'https://scratch.mit.edu/projects/1202083377/embed',
    scratch: 'https://scratch.mit.edu/projects/1202083377',
  },
];

// ── Referencias al DOM ────────────────────────────────────────────────────────
const track         = document.getElementById('track');
const dotsContainer = document.getElementById('dots');
const overlay       = document.getElementById('modalOverlay');
const gameFrame     = document.getElementById('gameFrame');
const loader        = document.getElementById('iframeLoader');
const modalTitle    = document.getElementById('modalTitle');

// ── Renderizar tarjetas y dots ────────────────────────────────────────────────
games.forEach((g, i) => {
  // ── Tarjeta ──
  const card = document.createElement('div');
  card.className = 'game-card';
  card.dataset.index = i;

  // El enlace a Scratch sólo se muestra si el juego lo tiene
  const scratchLink = g.scratch
    ? `<a class="scratch-link" href="${g.scratch}" target="_blank" rel="noopener"
          title="Ver en Scratch" onclick="event.stopPropagation()">
         <img src="https://scratch.mit.edu/favicon.ico" alt="Scratch" />
       </a>`
    : '';

  card.innerHTML = `
    <div class="card-thumb-placeholder"></div>
    <div class="card-body">
      <div class="card-title">${g.emoji} ${g.title}</div>
      <div class="card-genre">${g.genre}</div>
      <span class="play-badge">▶ Jugar</span>
      ${scratchLink}
    </div>`;

  // Imagen o gradiente de fondo del thumbnail
  const thumb = card.querySelector('.card-thumb-placeholder');
  if (g.bg.startsWith('url(')) {
    thumb.style.backgroundImage    = g.bg;
    thumb.style.backgroundSize     = 'cover';
    thumb.style.backgroundPosition = 'center';
  } else {
    // Gradiente CSS (Math Quest y futuros juegos locales)
    thumb.style.background = g.bg;
  }

  card.addEventListener('click', () => openGame(g));
  track.appendChild(card);

  // ── Punto indicador ──
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.dataset.index = i;
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
});

// ── Lógica del carrusel ───────────────────────────────────────────────────────
let current = 0;

const getCards = () => document.querySelectorAll('.game-card');
const getDots  = () => document.querySelectorAll('.dot');

function cardWidth() {
  const c = track.querySelector('.game-card');
  if (!c) return 0;
  const gap = parseFloat(getComputedStyle(track).gap) || 24;
  return c.offsetWidth + gap;
}

function applyTrackPadding() {
  const card = track.querySelector('.game-card');
  if (!card) return;
  const viewW   = track.parentElement.offsetWidth;
  const sidepad = Math.max(0, (viewW - card.offsetWidth) / 2);
  track.style.paddingLeft  = sidepad + 'px';
  track.style.paddingRight = sidepad + 'px';
}

function offsetForIndex(idx) {
  return idx * cardWidth();
}

function goTo(idx) {
  current = Math.max(0, Math.min(idx, games.length - 1));
  applyTrackPadding();
  track.style.transform = `translateX(-${offsetForIndex(current)}px)`;
  getDots().forEach((d, i) => d.classList.toggle('active', i === current));
  getCards().forEach((c, i) => c.classList.toggle('active', i === current));
}

document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));

// Soporte táctil (swipe)
let startX = 0;
track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
});

window.addEventListener('resize', () => goTo(current));

// ── Modal con iframe ──────────────────────────────────────────────────────────
function openGame(g) {
  modalTitle.textContent = g.title;
  loader.classList.remove('hidden');
  gameFrame.src = '';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    gameFrame.src = g.src;
    gameFrame.onload = () => loader.classList.add('hidden');
  }, 300);
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { gameFrame.src = ''; }, 350);
}

function goFullScreen() {
  if (gameFrame.requestFullscreen)             gameFrame.requestFullscreen();
  else if (gameFrame.webkitRequestFullscreen)  gameFrame.webkitRequestFullscreen();
  else if (gameFrame.msRequestFullscreen)      gameFrame.msRequestFullscreen();
}

document.getElementById('modalClose').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Init ──────────────────────────────────────────────────────────────────────
requestAnimationFrame(() => goTo(0));
