// ── Juegos de Scratch (públicos) ─────────────────────────────────────────────
const games = [
  {
    id: 'balltwo',
    title: 'BallTwo',
    genre: 'Arcade',
    emoji: '🟡',
    bg: 'url("./img/img1.png")',
    src: 'https://scratch.mit.edu/projects/1309711573/embed',
<<<<<<< HEAD
    scratch: 'https://scratch.mit.edu/projects/1309711573',
=======
>>>>>>> a7413cad829705b657b8c5b85749aac769b73534
  },
  {
    id: 'dinodisparo',
    title: 'DinoDisparo',
    genre: 'Acción',
    emoji: '🦖',
    bg: 'url("./img/img2.png")',
    src: 'https://scratch.mit.edu/projects/1308851657/embed',
<<<<<<< HEAD
    scratch: 'https://scratch.mit.edu/projects/1308851657',
=======
>>>>>>> a7413cad829705b657b8c5b85749aac769b73534
  },
  {
    id: 'nave-espacial',
    title: 'Nave Espacial',
    genre: 'Shooter',
    emoji: '🚀',
    bg: 'url("./img/img3.png")',
    src: 'https://scratch.mit.edu/projects/1305289171/embed',
<<<<<<< HEAD
    scratch: 'https://scratch.mit.edu/projects/1305289171',
=======
>>>>>>> a7413cad829705b657b8c5b85749aac769b73534
  },
  {
    id: 'murcielago',
    title: 'Escape del Murciélago',
    genre: 'Aventura',
    emoji: '🦇',
    bg: 'url("./img/img4.png")',
    src: 'https://scratch.mit.edu/projects/1202083377/embed',
<<<<<<< HEAD
    scratch: 'https://scratch.mit.edu/projects/1202083377',
=======
>>>>>>> a7413cad829705b657b8c5b85749aac769b73534
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
  // Tarjeta
  const card = document.createElement('div');
  card.className = 'game-card';
  card.dataset.index = i;
  card.innerHTML = `
    <div class="card-thumb-placeholder"></div>
    <div class="card-body">
      <div class="card-title">${g.title}</div>
      <div class="card-genre">${g.genre}</div>
      <span class="play-badge">▶ Jugar</span>
<<<<<<< HEAD
    </div>
    <a class="scratch-link" href="${g.scratch}" target="_blank" rel="noopener" title="Ver en Scratch" onclick="event.stopPropagation()">
      <img src="https://scratch.mit.edu/favicon.ico" alt="Scratch" />
    </a>`;
=======
    </div>`;
>>>>>>> a7413cad829705b657b8c5b85749aac769b73534

  // Asignar imagen via JS para evitar problemas con rutas relativas en inline style
  const thumb = card.querySelector('.card-thumb-placeholder');
  thumb.style.backgroundImage = g.bg;
  thumb.style.backgroundSize = 'cover';
  thumb.style.backgroundPosition = 'center';
<<<<<<< HEAD
=======

>>>>>>> a7413cad829705b657b8c5b85749aac769b73534
  card.addEventListener('click', () => openGame(g));
  track.appendChild(card);

  // Punto indicador
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
  const style = getComputedStyle(track);
  const gap = parseFloat(style.gap) || 24;
  return c.offsetWidth + gap;
}

/** Aplica padding lateral al track para que la primera y última tarjeta puedan centrarse */
function applyTrackPadding() {
  const card = track.querySelector('.game-card');
  if (!card) return;
  const cardW   = card.offsetWidth;
  const viewW   = track.parentElement.offsetWidth;
  const sidepad = Math.max(0, (viewW - cardW) / 2);
  track.style.paddingLeft  = sidepad + 'px';
  track.style.paddingRight = sidepad + 'px';
}

/** Calcula el translateX para centrar la tarjeta `idx` (con padding ya aplicado) */
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

// Recalcular posición al redimensionar ventana
window.addEventListener('resize', () => goTo(current));

// ── Modal con iframe ──────────────────────────────────────────────────────────
function openGame(g) {
  modalTitle.textContent = g.title;
  loader.classList.remove('hidden');
  gameFrame.src = '';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Pequeño delay para mostrar animación de carga antes del iframe
  setTimeout(() => {
    gameFrame.src = g.src;
    gameFrame.onload = () => loader.classList.add('hidden');
  }, 300);
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  // Limpiar el iframe al terminar la animación de cierre
  setTimeout(() => { gameFrame.src = ''; }, 350);
}

function goFullScreen() {
  if (gameFrame.requestFullscreen) {
    gameFrame.requestFullscreen();
  } else if (gameFrame.webkitRequestFullscreen) {
    gameFrame.webkitRequestFullscreen();
  } else if (gameFrame.msRequestFullscreen) {
    gameFrame.msRequestFullscreen();
  }
}

document.getElementById('modalClose').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Init ──────────────────────────────────────────────────────────────────────
requestAnimationFrame(() => goTo(0));
