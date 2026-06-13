/* ─────────────────────────────────────────
   js/quiz.js — Módulo de preguntas interactivas
   Gestiona el overlay del quiz, muestra la pregunta
   y devuelve el resultado al módulo Game vía callbacks.
───────────────────────────────────────── */

const Quiz = (() => {

  /* Referencias al DOM */
  const overlay  = document.getElementById('quiz-overlay');
  const qText    = document.getElementById('quiz-q');
  const optsWrap = document.getElementById('quiz-opts');
  const feedback = document.getElementById('quiz-fb');

  let _answered = false;
  let _onResult  = null;   /* callback(correct: boolean) */

  /**
   * Abre el overlay con la pregunta del enemigo indicado.
   *
   * @param {Object}   enemy    - enemigo que activó el quiz
   * @param {Array}    qs       - banco de preguntas del nivel
   * @param {Function} onResult - callback(correct: boolean)
   */
  function open(enemy, qs, onResult) {
    _answered  = false;
    _onResult  = onResult;

    const q = qs[enemy.qIdx % qs.length];
    qText.textContent    = q.q;
    feedback.textContent = '';
    optsWrap.innerHTML   = '';

    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className   = 'quiz-opt';
      btn.textContent = opt;
      btn.addEventListener('click', () => _checkAnswer(i, q));
      optsWrap.appendChild(btn);
    });

    overlay.classList.remove('hidden');
  }

  /**
   * Evalúa la opción elegida.
   */
  function _checkAnswer(chosen, q) {
    if (_answered) return;
    _answered = true;

    const correct = chosen === q.ans;
    const allBtns = optsWrap.querySelectorAll('.quiz-opt');

    /* Resaltar respuesta correcta */
    allBtns[q.ans].classList.add('correct');

    if (!correct) {
      allBtns[chosen].classList.add('wrong');
      feedback.innerHTML = '<span class="feedback-fail">❌ Incorrecto — pierdes una vida</span>';
    } else {
      feedback.innerHTML = '<span class="feedback-ok">✅ ¡Correcto! +' + CONFIG.PTS_QUIZ + ' puntos</span>';
    }

    /* Cierra el overlay tras un breve instante y notifica */
    setTimeout(() => {
      overlay.classList.add('hidden');
      if (typeof _onResult === 'function') _onResult(correct);
    }, 1300);
  }

  /** Cierra el overlay de forma forzada (ej. al reiniciar). */
  function forceClose() {
    overlay.classList.add('hidden');
    _answered = false;
    _onResult = null;
  }

  return { open, forceClose };
})();
