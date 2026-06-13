/* ─────────────────────────────────────────
   js/physics.js — Motor de física
   · Gravedad y salto del jugador
   · Colisiones AABB (jugador ↔ plataforma)
   · Movimiento de enemigos sobre plataformas
───────────────────────────────────────── */

/**
 * Detecta superposición entre dos rectángulos.
 * @param {{x,y,w,h}} a
 * @param {{x,y,w,h}} b
 * @returns {boolean}
 */
function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/**
 * Aplica gravedad, movimiento horizontal y resuelve colisiones
 * del jugador contra todas las plataformas.
 *
 * @param {Object} player  - estado mutable del jugador
 * @param {Array}  platforms
 * @param {Object} keys    - teclas pulsadas { ArrowLeft, ArrowRight, ArrowUp, … }
 * @returns {boolean} true si el jugador cayó por debajo del canvas
 */
function updatePlayer(player, platforms, keys) {
  const { GRAVITY, JUMP_FORCE, MOVE_SPEED, FRICTION, HEIGHT, WIDTH } = CONFIG;

  /* ── Movimiento horizontal ── */
  if (keys['ArrowLeft']  || keys['KeyA']) { player.vx = -MOVE_SPEED; player.facing = -1; }
  else if (keys['ArrowRight'] || keys['KeyD']) { player.vx =  MOVE_SPEED; player.facing =  1; }
  else { player.vx *= FRICTION; }

  /* ── Salto ── */
  if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && player.onGround) {
    player.vy       = JUMP_FORCE;
    player.onGround = false;
  }

  /* ── Gravedad ── */
  player.vy += GRAVITY;

  /* ── Integración ── */
  player.x += player.vx;
  player.y += player.vy;

  /* ── Límite izquierdo del mapa ── */
  if (player.x < 0) { player.x = 0; player.vx = 0; }

  /* ── Resolver colisiones con plataformas ── */
  player.onGround = false;

  for (const pl of platforms) {
    const pRect = { x: player.x, y: player.y, w: player.w, h: player.h };
    if (!rectsOverlap(pRect, pl)) continue;

    const overlapX =
      Math.min(player.x + player.w, pl.x + pl.w) - Math.max(player.x, pl.x);
    const overlapY =
      Math.min(player.y + player.h, pl.y + pl.h) - Math.max(player.y, pl.y);

    if (overlapY < overlapX) {
      /* Colisión vertical */
      if (player.vy >= 0 && player.y + player.h - player.vy <= pl.y + 4) {
        player.y        = pl.y - player.h;
        player.vy       = 0;
        player.onGround = true;
      } else if (player.vy < 0) {
        player.y  = pl.y + pl.h;
        player.vy = 0;
      }
    } else {
      /* Colisión horizontal */
      if (player.vx > 0) player.x = pl.x - player.w;
      else                player.x = pl.x + pl.w;
      player.vx = 0;
    }
  }

  /* ── Cayó fuera del mundo ── */
  return player.y > HEIGHT + 100;
}

/**
 * Mueve a un enemigo horizontalmente y lo hace rebotar en los
 * bordes de la plataforma sobre la que camina.
 *
 * @param {Object} enemy
 * @param {Array}  platforms
 */
function updateEnemy(enemy, platforms) {
  enemy.x += enemy.dir * enemy.speed;

  /* ¿Tiene plataforma bajo sus pies? */
  let supportPlatform = null;
  for (const pl of platforms) {
    const abovePlatform =
      enemy.x + enemy.w > pl.x &&
      enemy.x           < pl.x + pl.w &&
      Math.abs((enemy.y + enemy.h) - pl.y) < 6;

    if (abovePlatform) { supportPlatform = pl; break; }
  }

  /* Si no hay suelo adelante, dar vuelta */
  if (!supportPlatform) {
    enemy.dir *= -1;
    enemy.x   += enemy.dir * enemy.speed * 2;
    return;
  }

  /* Rebotar en los bordes de la plataforma */
  if (enemy.dir > 0 && enemy.x + enemy.w >= supportPlatform.x + supportPlatform.w) {
    enemy.dir = -1;
  }
  if (enemy.dir < 0 && enemy.x <= supportPlatform.x) {
    enemy.dir = 1;
  }
}
