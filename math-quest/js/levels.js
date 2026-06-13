/* ─────────────────────────────────────────
   js/levels.js — Definición y construcción de niveles
───────────────────────────────────────── */

/**
 * Datos crudos de cada nivel.
 * platforms: filas de { col, row, cols } en unidades TILE
 * enemies  : posiciones pixel { x, y }
 * coins    : posiciones pixel { x, y }
 * flagX/Y  : posición pixel de la bandera
 * bgTop/bgBot: colores del gradiente de fondo
 */
const LEVEL_DATA = [
  {
    bgTop:  '#0d1b3e',
    bgBot:  '#122344',
    platforms: [
      { col:  0, row: 9, cols: 15 },
      { col: 10, row: 9, cols:  8 },
      { col:  2, row: 7, cols:  4 },
      { col:  6, row: 7, cols:  4 },
      { col: 11, row: 5, cols:  4 },
      { col: 14, row: 4, cols:  5 },
    ],
    enemies: [
      { x: 160, y: 320 },
      { x: 500, y: 320 },
      { x: 280, y: 240 },
      { x: 460, y: 120 },
    ],
    coins: [
      { x: 120, y: 255 },
      { x: 260, y: 255 },
      { x: 460, y: 175 },
      { x: 580, y: 120 },
    ],
    flagX: 620,
    flagY:  80,
  },
  {
    bgTop:  '#1a0d3e',
    bgBot:  '#2a1060',
    platforms: [
      { col:  0, row: 9, cols: 10 },
      { col: 10, row: 9, cols: 10 },
      { col:  1, row: 7, cols:  3 },
      { col:  4, row: 6, cols:  3 },
      { col:  7, row: 5, cols:  3 },
      { col: 11, row: 6, cols:  3 },
      { col: 14, row: 4, cols:  4 },
      { col: 17, row: 3, cols:  4 },
    ],
    enemies: [
      { x: 100, y: 320 },
      { x: 380, y: 320 },
      { x: 180, y: 200 },
      { x: 460, y: 200 },
      { x: 560, y: 120 },
    ],
    coins: [
      { x:  70, y: 250 },
      { x: 190, y: 185 },
      { x: 310, y: 155 },
      { x: 570, y: 105 },
      { x: 670, y:  75 },
    ],
    flagX: 680,
    flagY:  50,
  },
  {
    bgTop:  '#0a1f0a',
    bgBot:  '#102810',
    platforms: [
      { col:  0, row: 9, cols:  8 },
      { col:  8, row: 9, cols:  8 },
      { col: 16, row: 9, cols:  6 },
      { col:  2, row: 7, cols:  3 },
      { col:  5, row: 6, cols:  3 },
      { col:  9, row: 5, cols:  3 },
      { col: 13, row: 6, cols:  3 },
      { col: 12, row: 4, cols:  4 },
      { col: 16, row: 2, cols:  4 },
    ],
    enemies: [
      { x: 130, y: 320 },
      { x: 330, y: 320 },
      { x: 610, y: 320 },
      { x: 200, y: 200 },
      { x: 520, y: 200 },
      { x: 490, y: 120 },
    ],
    coins: [
      { x:  90, y: 245 },
      { x: 380, y: 165 },
      { x: 535, y: 215 },
      { x: 490, y: 110 },
      { x: 650, y:  50 },
    ],
    flagX: 660,
    flagY:  20,
  },
];

/**
 * Construye un objeto de nivel listo para usar por el motor.
 * Convierte las coordenadas TILE a píxeles y añade las preguntas.
 *
 * @param {number} levelIndex - 0, 1 ó 2
 * @returns {Object} nivel con { platforms, enemies, coins, flagX, flagY, qs, bgTop, bgBot }
 */
function buildLevel(levelIndex) {
  const T   = CONFIG.TILE;
  const raw = LEVEL_DATA[levelIndex] || LEVEL_DATA[0];
  const qs  = getQuestions(levelIndex);

  /* Plataformas */
  const platforms = raw.platforms.map(p => ({
    x: p.col * T,
    y: p.row * T,
    w: p.cols * T,
    h: T,
  }));

  /* Enemigos — velocidad y dirección aleatoria por nivel */
  const baseSpeed = 0.7 + levelIndex * 0.35;
  const enemies = raw.enemies.map((e, i) => ({
    x:     e.x,
    y:     e.y,
    w:     32,
    h:     32,
    alive: true,
    qIdx:  i % qs.length,
    dir:   Math.random() < 0.5 ? 1 : -1,
    speed: baseSpeed + Math.random() * 0.3,
  }));

  /* Monedas */
  const coins = raw.coins.map(c => ({
    x:         c.x,
    y:         c.y,
    r:         12,
    collected: false,
  }));

  return {
    platforms,
    enemies,
    coins,
    flagX:  raw.flagX,
    flagY:  raw.flagY,
    qs,
    bgTop:  raw.bgTop,
    bgBot:  raw.bgBot,
  };
}
