/* ─────────────────────────────────────────
   js/config.js — Constantes globales del juego
───────────────────────────────────────── */

const CONFIG = Object.freeze({
  /* Canvas */
  WIDTH:  680,
  HEIGHT: 480,
  FPS_TARGET: 60,

  /* Física del personaje */
  GRAVITY:    0.55,
  JUMP_FORCE: -13,
  MOVE_SPEED:  4,
  FRICTION:    0.7,

  /* Tamaño de tile */
  TILE: 40,

  /* Jugador */
  PLAYER_W: 28,
  PLAYER_H: 40,
  PLAYER_START_X: 60,

  /* Puntos */
  PTS_COIN:    10,
  PTS_QUIZ:    50,
  PTS_LEVEL:  100,

  /* Duración de invencibilidad (frames) */
  INVINCIBLE_HIT:    120,
  INVINCIBLE_QUIZ:    90,

  /* Número de niveles */
  TOTAL_LEVELS: 3,

  /* Estrellas (umbrales de puntuación) */
  STARS_3: 400,
  STARS_2: 200,

  /* Paleta de colores del renderer */
  COLORS: {
    groundTop:     '#1a4d1a',
    grass:         '#2d6a2d',
    platform:      '#5c3d1e',
    platformTop:   '#7a5230',
    platformSide:  'rgba(0,0,0,0.15)',
    platformShade: 'rgba(0,0,0,0.3)',
    enemy:         '#e84040',
    enemyDark:     '#cc1111',
    enemyEye:      '#ffffff',
    enemyPupil:    '#111111',
    coin:          '#FFD700',
    coinHighlight: '#FFF8DC',
    coinBorder:    '#B8860B',
    flagPole:      '#c0c0c0',
    flagColor:     '#FF6B00',
    playerBody:    '#4488FF',
    playerPants:   '#2255CC',
    playerSkin:    '#FFDAB9',
    playerEye:     '#222222',
    playerHair:    '#8B4513',
  },
});
