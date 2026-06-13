/* ─────────────────────────────────────────
   js/questions.js — Banco de preguntas por nivel
   Cada pregunta: { q, opts:[a,b,c,d], ans (índice 0-3) }
───────────────────────────────────────── */

const QUESTIONS = [
  /* ── Nivel 1 · Aritmética básica ── */
  [
    { q: '¿Cuánto es 5 + 7?',   opts: [12, 10, 13, 11], ans: 0 },
    { q: '¿Cuánto es 9 − 4?',   opts: [ 5,  3,  6,  4], ans: 0 },
    { q: '¿Cuánto es 3 × 4?',   opts: [12,  9, 15,  8], ans: 0 },
    { q: '¿Cuánto es 15 ÷ 3?',  opts: [ 5,  4,  6,  3], ans: 0 },
    { q: '¿Cuánto es 8 + 6?',   opts: [14, 12, 15, 13], ans: 0 },
    { q: '¿Cuánto es 7 × 2?',   opts: [14, 12, 16, 13], ans: 0 },
    { q: '¿Cuánto es 20 − 8?',  opts: [12, 10, 14, 11], ans: 0 },
    { q: '¿Cuánto es 6 × 6?',   opts: [36, 30, 42, 32], ans: 0 },
    { q: '¿Cuánto es 18 ÷ 6?',  opts: [ 3,  2,  4,  6], ans: 0 },
    { q: '¿Cuánto es 11 + 9?',  opts: [20, 18, 22, 19], ans: 0 },
  ],

  /* ── Nivel 2 · Aritmética intermedia ── */
  [
    { q: '¿Cuánto es 12 × 7?',      opts: [ 84,  72,  96,  78], ans: 0 },
    { q: '¿Cuánto es 56 ÷ 8?',      opts: [  7,   6,   8,   9], ans: 0 },
    { q: '¿Cuánto es 25 + 38?',     opts: [ 63,  61,  65,  67], ans: 0 },
    { q: '¿Cuánto es 100 − 37?',    opts: [ 63,  73,  53,  67], ans: 0 },
    { q: '¿Cuánto es 9 × 9?',       opts: [ 81,  72,  90,  78], ans: 0 },
    { q: '¿Cuánto es 144 ÷ 12?',    opts: [ 12,  11,  13,  14], ans: 0 },
    { q: '¿Cuánto es 45 + 57?',     opts: [102,  92, 112,  98], ans: 0 },
    { q: '¿Cuánto es 200 − 84?',    opts: [116, 126, 106, 118], ans: 0 },
    { q: '¿Cuánto es 13 × 4?',      opts: [ 52,  48,  56,  42], ans: 0 },
    { q: '¿Cuánto es 72 ÷ 9?',      opts: [  8,   7,   9,   6], ans: 0 },
  ],

  /* ── Nivel 3 · Álgebra y conceptos avanzados ── */
  [
    { q: '¿Cuánto es 15% de 200?',         opts: [ 30,  20,  40,  25], ans: 0 },
    { q: 'Si x + 5 = 12, ¿x = ?',          opts: [  7,   5,   6,   8], ans: 0 },
    { q: '¿Cuánto es 2³?',                  opts: [  8,   6,   9,  12], ans: 0 },
    { q: '¿Cuánto es √81?',                 opts: [  9,   7,   8,  10], ans: 0 },
    { q: '¿Cuánto es 3² + 4²?',            opts: [ 25,  20,  18,  30], ans: 0 },
    { q: '¿Cuánto es 0.5 × 120?',          opts: [ 60,  50,  70,  40], ans: 0 },
    { q: 'Si 2x = 18, ¿x = ?',             opts: [  9,   8,  10,   6], ans: 0 },
    { q: '¿Cuánto es 25% de 80?',           opts: [ 20,  15,  25,  40], ans: 0 },
    { q: '¿Cuánto es 5! (factorial)?',      opts: [120,  60,  24, 100], ans: 0 },
    { q: '¿Cuánto es √144?',                opts: [ 12,  11,  13,  10], ans: 0 },
  ],
];

/**
 * Devuelve copia aleatoria de las preguntas de un nivel.
 * @param {number} levelIndex
 * @returns {Array}
 */
function getQuestions(levelIndex) {
  const bank = QUESTIONS[levelIndex] || QUESTIONS[0];
  return [...bank].sort(() => Math.random() - 0.5);
}
