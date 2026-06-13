/* ─────────────────────────────────────────
   js/renderer.js — Funciones de dibujado
   Todas reciben el contexto 2D y el estado del juego.
───────────────────────────────────────── */

const Renderer = (() => {

  /* ── Fondo con gradiente y estrellas parpadeantes ── */
  function drawBackground(ctx, lv, camera, W, H) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, lv.bgTop);
    grad.addColorStop(1, lv.bgBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    /* Estrellas */
    const starPos = [
      [50, 30], [120, 60], [200, 20], [300, 45],
      [450, 25], [530, 50], [620, 35], [160, 80], [380, 70],
    ];
    starPos.forEach(([sx, sy]) => {
      const alpha = Math.sin(Date.now() / 500 + sx) * 0.4 + 0.6;
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = 'rgba(255,255,255,0.8)';
      ctx.fillRect(sx, sy, 2, 2);
    });
    ctx.globalAlpha = 1;

    /* Nubes simplificadas (paralaje lento) */
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let i = 0; i < 3; i++) {
      const cx = (50 + i * 200 - (camera * 0.2) % 200) % W + 50;
      ctx.fillRect(cx, H - 80 - i * 20, 80 + i * 20, 20 + i * 10);
    }
  }

  /* ── Plataforma con textura ── */
  function drawPlatform(ctx, pl, camera) {
    const C = CONFIG.COLORS;
    const x = pl.x - camera;

    /* Cuerpo */
    ctx.fillStyle = C.platform;
    ctx.fillRect(x, pl.y, pl.w, pl.h);

    /* Hierba */
    ctx.fillStyle = C.grass;
    ctx.fillRect(x, pl.y, pl.w, 8);

    /* Borde superior (línea oscura) */
    ctx.fillStyle = C.groundTop;
    ctx.fillRect(x, pl.y, pl.w, 3);

    /* Sombra inferior */
    ctx.fillStyle = C.platformShade;
    ctx.fillRect(x, pl.y + pl.h - 6, pl.w, 6);

    /* Líneas verticales de "ladrillos" */
    ctx.fillStyle = C.platformSide;
    for (let bx = 0; bx < pl.w; bx += 20) {
      ctx.fillRect(x + bx, pl.y + 10, 1, pl.h - 10);
    }
  }

  /* ── Moneda animada ── */
  function drawCoin(ctx, co, camera) {
    if (co.collected) return;
    const C   = CONFIG.COLORS;
    const x   = co.x - camera;
    const pulse = Math.sin(Date.now() / 300) * 2;

    ctx.fillStyle = C.coin;
    ctx.beginPath();
    ctx.arc(x, co.y, co.r + pulse, 0, Math.PI * 2);
    ctx.fill();

    /* Brillo */
    ctx.fillStyle = C.coinHighlight;
    ctx.beginPath();
    ctx.arc(x - 3, co.y - 3, 4, 0, Math.PI * 2);
    ctx.fill();

    /* Etiqueta */
    ctx.fillStyle   = C.coinBorder;
    ctx.font        = 'bold 11px Courier New';
    ctx.textAlign   = 'center';
    ctx.fillText('+10', x, co.y + co.r + 14);
  }

  /* ── Bandera de meta ── */
  function drawFlag(ctx, lv, camera) {
    const C = CONFIG.COLORS;
    const x = lv.flagX - camera;
    const y = lv.flagY;

    /* Asta */
    ctx.fillStyle = C.flagPole;
    ctx.fillRect(x, y, 6, 70);

    /* Banderín triangular */
    ctx.fillStyle = C.flagColor;
    ctx.beginPath();
    ctx.moveTo(x + 6, y);
    ctx.lineTo(x + 30, y + 12);
    ctx.lineTo(x + 6, y + 24);
    ctx.closePath();
    ctx.fill();

    /* Base */
    ctx.fillStyle = C.flagPole;
    ctx.fillRect(x - 4, y + 68, 14, 6);
  }

  /* ── Enemigo tipo "bloque monstruoso" ── */
  function drawEnemy(ctx, en, camera) {
    const C = CONFIG.COLORS;
    const x = en.x - camera;
    const y = en.y;

    /* Cuerpo */
    ctx.fillStyle = C.enemy;
    ctx.fillRect(x, y, en.w, en.h);

    /* Bordes pixelados */
    ctx.fillStyle = C.enemyDark;
    ctx.fillRect(x + 2, y, en.w - 4, 5);
    ctx.fillRect(x, y + 2, 4, en.h - 4);
    ctx.fillRect(x + en.w - 4, y + 2, 4, en.h - 4);

    /* Ojos */
    ctx.fillStyle = C.enemyEye;
    ctx.fillRect(x + 5,        y + 8, 7, 7);
    ctx.fillRect(x + en.w - 12, y + 8, 7, 7);

    /* Pupilas */
    ctx.fillStyle = C.enemyPupil;
    ctx.fillRect(x + 7,        y + 10, 3, 3);
    ctx.fillRect(x + en.w - 10, y + 10, 3, 3);

    /* Patas */
    ctx.fillStyle = C.enemyPupil;
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(x + 4 + i * 7, y + en.h - 6, 5, 6);
    }

    /* Signo de interrogación flotante */
    ctx.fillStyle   = CONFIG.COLORS.coin;
    ctx.font        = 'bold 12px Courier New';
    ctx.textAlign   = 'center';
    ctx.fillText('?', x + en.w / 2, y - 4);
  }

  /* ── Personaje del jugador (pixel art en canvas) ── */
  function drawPlayer(ctx, player, camera, blink) {
    /* Parpadeo de invencibilidad */
    if (blink && Math.floor(Date.now() / 100) % 2 === 0) return;

    const C  = CONFIG.COLORS;
    const cx = player.x - camera + player.w / 2;
    const cy = player.y;

    ctx.save();
    ctx.translate(cx, cy + player.h / 2);
    if (player.facing < 0) ctx.scale(-1, 1);

    /* Piernas */
    ctx.fillStyle = C.playerPants;
    ctx.fillRect(-9, 12, 18, 10);

    /* Pies */
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-2, 22, 5, 10);
    ctx.fillRect( 6, 22, 5, 10);

    /* Cuerpo */
    ctx.fillStyle = C.playerBody;
    ctx.fillRect(-9, 0, 18, 14);

    /* Cabeza */
    ctx.fillStyle = C.playerSkin;
    ctx.fillRect(-8, -18, 16, 18);

    /* Cabello */
    ctx.fillStyle = C.playerHair;
    ctx.fillRect(-8, -20, 16, 4);
    ctx.fillRect(-10, -18, 4, 8);

    /* Ojo */
    ctx.fillStyle = C.playerEye;
    ctx.fillRect(2, -14, 4, 4);

    ctx.restore();
  }

  /* ── Renderizado completo de un frame ── */
  function drawFrame(ctx, state) {
    const { lv, player, camera, invincible } = state;
    const W = CONFIG.WIDTH;
    const H = CONFIG.HEIGHT;

    ctx.clearRect(0, 0, W, H);

    drawBackground(ctx, lv, camera, W, H);

    lv.platforms.forEach(pl  => drawPlatform(ctx, pl,  camera));
    lv.coins.forEach(co      => drawCoin(ctx,     co,  camera));
    drawFlag(ctx, lv, camera);
    lv.enemies.filter(e => e.alive).forEach(en => drawEnemy(ctx, en, camera));

    drawPlayer(ctx, player, camera, invincible > 0);

    /* Barra de suelo inferior */
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, H - 8, W, 8);
  }

  /* API pública */
  return { drawFrame };
})();
