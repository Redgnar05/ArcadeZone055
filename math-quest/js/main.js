/* ─────────────────────────────────────────
   js/main.js — Punto de entrada
   · Bucle principal (requestAnimationFrame)
   · Bindings de botones de pantalla
───────────────────────────────────────── */

(function () {
  'use strict';

  const canvas = document.getElementById('game-canvas');
  const ctx    = canvas.getContext('2d');

  /* ══════════════════════════════════════
     BUCLE PRINCIPAL
  ══════════════════════════════════════ */
  let lastTime   = 0;
  let loopActive = false;

  function loop(timestamp) {
    if (!loopActive) return;

    const elapsed = timestamp - lastTime;

    /* Limitar a ~60 fps; tolera multiples capas de throttle */
    if (elapsed >= 14) {
      lastTime = timestamp;
      Game.update();
      Renderer.drawFrame(ctx, Game.getState());
    }

    requestAnimationFrame(loop);
  }

  function startLoop() {
    loopActive = true;
    lastTime   = performance.now();
    requestAnimationFrame(loop);
  }

  /* ══════════════════════════════════════
     FUNCIONES DE TRANSICIÓN DE PANTALLA
  ══════════════════════════════════════ */
  function hideAllScreens() {
    ['screen-start', 'screen-gameover', 'screen-win'].forEach(id =>
      document.getElementById(id).classList.add('hidden')
    );
  }

  function startGame() {
    hideAllScreens();
    Game.init();
    Game.showHUD();
    /* Arranca el loop sólo la primera vez */
    if (!loopActive) startLoop();
  }

  function restartGame() {
    hideAllScreens();
    Game.init();
    Game.showHUD();
  }

  function goToMenu() {
    hideAllScreens();
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('screen-start').classList.remove('hidden');
  }

  /* ══════════════════════════════════════
     BOTONES
  ══════════════════════════════════════ */
  document.getElementById('btn-start').addEventListener('click', startGame);

  document.getElementById('btn-retry').addEventListener('click', restartGame);
  document.getElementById('btn-menu-go').addEventListener('click', goToMenu);

  document.getElementById('btn-play-again').addEventListener('click', restartGame);
  document.getElementById('btn-menu-win').addEventListener('click', goToMenu);

})();
