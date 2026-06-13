/* ─────────────────────────────────────────
   js/game.js — Máquina de estados y lógica principal
   Estados: IDLE → PLAYING → QUIZ → LEVEL_TRANSITION
            → GAMEOVER | WIN
───────────────────────────────────────── */

const Game = (() => {

  /* ── Estado global ── */
  let state = {};

  /* ── Referencias DOM ── */
  const hudEl    = document.getElementById('hud');
  const scoreEl  = document.getElementById('hud-score');
  const levelEl  = document.getElementById('hud-level');
  const livesEl  = document.getElementById('hud-lives');

  /* ── Teclado ── */
  const keys = {};
  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (['ArrowUp', 'Space', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  /* ══════════════════════════════════════
     INICIALIZACIÓN
  ══════════════════════════════════════ */
  function init() {
    state = {
      score:      0,
      lives:      3,
      level:      0,
      camera:     0,
      quizActive: false,
      invincible: 0,
      paused:     false,
    };
    state.lv = buildLevel(0);
    _spawnPlayer();
    _updateHUD();
  }

  function _spawnPlayer() {
    const firstPlatform = state.lv.platforms[0];
    state.player = {
      x:        CONFIG.PLAYER_START_X,
      y:        firstPlatform.y - CONFIG.PLAYER_H,
      w:        CONFIG.PLAYER_W,
      h:        CONFIG.PLAYER_H,
      vx:       0,
      vy:       0,
      onGround: false,
      facing:   1,
    };
  }

  /* ══════════════════════════════════════
     UPDATE (llamado cada frame)
  ══════════════════════════════════════ */
  function update() {
    if (state.quizActive || state.paused) return;

    const { player, lv } = state;

    /* ── Invencibilidad temporal ── */
    if (state.invincible > 0) state.invincible--;

    /* ── Física del jugador ── */
    const fell = updatePlayer(player, lv.platforms, keys);
    if (fell) { _loseLife(); return; }

    /* ── Cámara (scroll horizontal) ── */
    state.camera = Math.max(0, player.x - CONFIG.WIDTH / 3);

    /* ── Recoger monedas ── */
    lv.coins.forEach(co => {
      if (co.collected) return;
      if (rectsOverlap(
        { x: player.x, y: player.y, w: player.w, h: player.h },
        { x: co.x - co.r, y: co.y - co.r, w: co.r * 2, h: co.r * 2 }
      )) {
        co.collected = true;
        state.score += CONFIG.PTS_COIN;
        _updateHUD();
      }
    });

    /* ── Colisión con enemigos ── */
    if (state.invincible === 0) {
      lv.enemies.forEach(en => {
        if (!en.alive) return;
        if (rectsOverlap(
          { x: player.x, y: player.y, w: player.w, h: player.h },
          { x: en.x,     y: en.y,     w: en.w,     h: en.h     }
        )) {
          _startQuiz(en);
        }
      });
    }

    /* ── Enemigos: IA de patrulla ── */
    lv.enemies.forEach(en => {
      if (en.alive) updateEnemy(en, lv.platforms);
    });

    /* ── ¿Llegó a la bandera? ── */
    if (rectsOverlap(
      { x: player.x, y: player.y, w: player.w, h: player.h },
      { x: lv.flagX, y: lv.flagY, w: 20, h: 70 }
    )) {
      _nextLevel();
    }
  }

  /* ══════════════════════════════════════
     QUIZ
  ══════════════════════════════════════ */
  function _startQuiz(enemy) {
    state.quizActive = true;

    Quiz.open(enemy, state.lv.qs, correct => {
      state.quizActive = false;

      if (correct) {
        enemy.alive   = false;
        state.score  += CONFIG.PTS_QUIZ;
        state.invincible = CONFIG.INVINCIBLE_QUIZ;
        _updateHUD();
      } else {
        _loseLife();
      }
    });
  }

  /* ══════════════════════════════════════
     VIDAS / NIVELES / FIN
  ══════════════════════════════════════ */
  function _loseLife() {
    state.lives--;
    _updateHUD();

    if (state.lives <= 0) {
      _endGame(false);
    } else {
      _spawnPlayer();
      state.invincible = CONFIG.INVINCIBLE_HIT;
    }
  }

  function _nextLevel() {
    state.score += CONFIG.PTS_LEVEL;
    state.level++;

    if (state.level >= CONFIG.TOTAL_LEVELS) {
      _endGame(true);
      return;
    }

    state.lv     = buildLevel(state.level);
    state.camera = 0;
    _spawnPlayer();
    _updateHUD();
  }

  function _endGame(won) {
    state.paused = true;
    Quiz.forceClose();
    hudEl.classList.add('hidden');

    const stars =
      state.score >= CONFIG.STARS_3 ? '⭐⭐⭐' :
      state.score >= CONFIG.STARS_2 ? '⭐⭐'  : '⭐';

    if (won) {
      document.getElementById('win-score').textContent = state.score;
      document.getElementById('win-stars').textContent = stars;
      document.getElementById('win-msg').textContent   =
        state.score >= CONFIG.STARS_3 ? '¡Maestro Matemático!' :
        state.score >= CONFIG.STARS_2 ? '¡Buen trabajo!'       : '¡Sigue practicando!';
      document.getElementById('screen-win').classList.remove('hidden');
    } else {
      document.getElementById('go-score').textContent = state.score;
      document.getElementById('go-stars').textContent = stars;
      document.getElementById('screen-gameover').classList.remove('hidden');
    }
  }

  /* ══════════════════════════════════════
     HUD
  ══════════════════════════════════════ */
  function _updateHUD() {
    scoreEl.textContent = 'PUNTOS: ' + state.score;
    levelEl.textContent = 'NIVEL: '  + (state.level + 1);
    livesEl.textContent = '❤️'.repeat(Math.max(0, state.lives));
  }

  /* ── Mostrar HUD al comenzar ── */
  function showHUD() {
    hudEl.classList.remove('hidden');
  }

  /* ── Acceso de sólo lectura al estado para el renderer ── */
  function getState() { return state; }

  return { init, update, showHUD, getState };
})();
