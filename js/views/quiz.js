/* views/quiz.js — тренажёр-квиз с разными типами заданий.
   Режимы: иероглиф→перевод, перевод→иероглиф, на слух→перевод.
   Отвечать можно мышью или клавишами 1–4. */
window.CN = window.CN || {};
CN.views = CN.views || {};

CN.views.quiz = function ({ id }) {
  const { el, shuffle, pick, sample } = CN.u, st = CN.store, icon = CN.icon;

  // источник слов: контрольная юнита / конкретный урок / весь курс
  let pool, title, isCheckpoint = false;
  if (id && id.indexOf('unit:') === 0) {
    const u = CN.units.find(x => x.id === id.slice(5));
    pool = u ? u.lessons.flatMap(l => l.words) : CN.allWords.slice();
    title = u ? 'Контрольная: ' + u.title : 'Контрольная';
    isCheckpoint = true;
  } else if (id) {
    const f = cnFindLesson(id);
    pool = f ? f.lesson.words.slice() : CN.allWords.slice();
    title = f ? f.lesson.title : 'Квиз';
  } else {
    pool = CN.allWords.slice(); title = 'Общий тренажёр';
  }
  if (pool.length < 4) pool = CN.allWords.slice();

  const N = Math.min(isCheckpoint ? 12 : 10, pool.length);
  const questions = pick(pool, N).map(w => ({ w, mode: sample(['h2r', 'r2h', 'audio']) }));
  let idx = 0, correct = 0, locked = false, currentOpts = [], combo = 0, maxCombo = 0;

  const wrap = el('div', { class: 'view view-quiz' });
  wrap.append(el('button', { class: 'back-link', onclick: () => history.back() }, [ icon('arrowLeft'), 'назад' ]));
  wrap.append(el('h1', { class: 'view-h' }, title));

  const bar = el('div', { class: 'qbar' }, el('i', {}));
  const stage = el('div', { class: 'qstage' });
  wrap.append(bar, stage);

  // клавиатура 1–4 — отвечаем с клавиш; снимаем слушатель, когда экран ушёл
  function onKey(e) {
    if (!document.body.contains(wrap)) { document.removeEventListener('keydown', onKey); return; }
    if (locked) return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= currentOpts.length) {
      const btn = CN.u.$$('.q-opt', stage)[n - 1];
      if (btn) btn.click();
    }
  }
  document.addEventListener('keydown', onKey);

  renderQ();

  function renderQ() {
    if (idx >= questions.length) return finish();
    locked = false;
    const { w, mode } = questions[idx];
    CN.u.$('i', bar).style.width = (idx / questions.length * 100) + '%';
    stage.innerHTML = '';

    // правильный + 3 неправильных
    const distract = pick(CN.allWords.filter(x => x.ru !== w.ru), 3);
    const opts = shuffle([w, ...distract]);
    currentOpts = opts;

    let prompt, optlabel;
    if (mode === 'h2r') {
      prompt = el('div', { class: 'q-prompt' }, [
        el('div', { class: 'zi-grid' }, el('div', { class: 'q-zi' }, w.hanzi)),
        el('div', { class: 'q-pin' }, w.pinyin),
      ]);
      optlabel = o => o.ru;
      CN.audio.speak(w.hanzi);
    } else if (mode === 'r2h') {
      prompt = el('div', { class: 'q-prompt' }, [ el('div', { class: 'q-ru-big' }, w.ru), el('div', { class: 'q-tag' }, 'выбери иероглиф') ]);
      optlabel = o => o.hanzi;
    } else { // audio
      prompt = el('div', { class: 'q-prompt' }, [
        el('button', { class: 'q-audio', 'aria-label': 'Повторить звук', onclick: () => CN.audio.speak(w.hanzi) }, icon('speaker')),
        el('div', { class: 'q-tag' }, 'послушай и выбери перевод'),
      ]);
      optlabel = o => o.ru;
      CN.audio.speak(w.hanzi);
    }

    const optBox = el('div', { class: 'q-options' }, opts.map((o, i) =>
      el('button', { class: 'q-opt', onclick: (e) => answer(e.currentTarget, o, w, optBox) }, [
        el('span', { class: 'opt-key' }, String(i + 1)),
        optlabelize(optlabel(o), mode),
      ])));
    const fb = el('div', { class: 'q-feedback' });
    stage.append(prompt, optBox, fb);
  }

  function optlabelize(text, mode) {
    if (mode === 'r2h') return CN.u.el('span', { class: 'opt-zi' }, text);
    return CN.u.el('span', {}, text);
  }

  function answer(btn, chosen, w, box) {
    if (locked) return;
    locked = true;
    CN.u.$$('.q-opt', box).forEach(b => b.disabled = true);
    const ok = chosen.hanzi === w.hanzi && chosen.ru === w.ru;
    CN.store.srsAnswer(w.hanzi, ok);
    const fb = CN.u.$('.q-feedback', stage);
    if (ok) {
      btn.classList.add('correct'); correct++; combo++; maxCombo = Math.max(maxCombo, combo);
      fb.className = 'q-feedback ok'; fb.append(icon('check'), 'Верно!');
      if (combo >= 2) fb.append(CN.u.el('span', { class: 'combo-badge' }, '×' + combo + ' комбо'));
    } else {
      combo = 0;
      btn.classList.add('wrong');
      CN.u.$$('.q-opt', box).find(b => b.textContent.includes(w.ru) || b.textContent.includes(w.hanzi))?.classList.add('correct');
      fb.className = 'q-feedback no'; fb.append(icon('close'), CN.u.el('span', {}, [ 'Правильно: ', CN.u.el('b', {}, `${w.hanzi} — ${w.ru}`) ]));
      stage.classList.add('shake');
      setTimeout(() => stage.classList.remove('shake'), 450);
    }
    setTimeout(() => { idx++; renderQ(); }, ok ? 750 : 1550);
  }

  function finish() {
    document.removeEventListener('keydown', onKey);
    CN.u.$('i', bar).style.width = '100%';
    CN.store.recordQuiz(correct, questions.length);
    const xp = correct * 4;
    if (xp > 0) CN.c.toast(`+${xp} XP`, 'gold');
    const pct = Math.round(correct / questions.length * 100);
    const msg = pct === 100 ? '完美! Идеально!' : pct >= 70 ? '很好! Отлично!' : '加油! Ещё повторим!';
    stage.innerHTML = '';
    stage.append(el('div', { class: 'q-result' }, [
      el('div', { class: 'seal-stamp seal-pop', style: 'margin-bottom:14px' }, pct >= 70 ? '优' : '继'),
      el('div', { class: 'q-score' }, `${correct}/${questions.length}`),
      el('div', { class: 'q-msg' }, msg),
      maxCombo >= 3 ? el('div', { class: 'q-combo' }, [ icon('flame'), `Лучшее комбо: ×${maxCombo}` ]) : null,
      el('div', { class: 'q-xp' }, [ icon('bolt'), `+${xp} XP` ]),
      el('div', { class: 'q-result-actions' }, [
        el('button', { class: 'btn btn-primary', onclick: () => CN.views.quiz.rerun(wrap, id) }, [ icon('repeat'), 'Ещё раз' ]),
        el('button', { class: 'btn btn-ghost', onclick: () => CN.router.go('#/home') }, 'На главную'),
      ]),
    ]));
    CN.fx.countUp(CN.u.$('.q-score', stage), correct, { suffix: `/${questions.length}` });
    if (pct >= 70) CN.fx.inkBurst({ count: 30, y: window.innerHeight * 0.42 });
  }

  return wrap;
};
// перезапуск квиза без смены адреса
CN.views.quiz.rerun = function (oldWrap, id) {
  const fresh = CN.views.quiz({ id });
  oldWrap.replaceWith(fresh);
};
