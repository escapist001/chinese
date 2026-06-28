/* ============================================================
   views/games.js — режимы Фазы 3:
   • match     — соедини иероглиф и перевод на скорость
   • cloze     — вставь пропущенное слово в предложение
   • blitz      — блиц: успей за 60 секунд (с комбо)
   • read      — чтение с подсказками (тап по слову = перевод)
   • listening — аудирование: послушай диалог → ответь на вопрос
   • endless   — бесконечная практика
   ============================================================ */
window.CN = window.CN || {};
CN.views = CN.views || {};

CN._back = function (href, label) {
  return CN.u.el('button', { class: 'back-link', onclick: () => CN.router.go(href) }, [ CN.icon('arrowLeft'), label ]);
};

/* ── СОЕДИНИ ПАРЫ ─────────────────────────────────────── */
CN.views.match = function () {
  const { el, pick, shuffle } = CN.u, icon = CN.icon;
  const words = pick(CN.allWords.filter(w => w.hanzi && w.ru), 6);
  let sel = null, matched = 0, t0 = null, done = false;

  const wrap = el('div', { class: 'view view-match' });
  wrap.append(CN._back('#/home', 'на главную'), el('h1', { class: 'view-h' }, 'Соедини пары'),
    el('p', { class: 'view-lead' }, 'Нажми иероглиф, затем его перевод. Собери все пары как можно быстрее.'));
  const timeEl = el('div', { class: 'mp-score' }, 'Время: 0.0 с');
  const board = el('div', { class: 'match-board' }, [
    el('div', { class: 'match-col' }, shuffle(words).map(w => chip(w, 'h'))),
    el('div', { class: 'match-col' }, shuffle(words).map(w => chip(w, 'r'))),
  ]);
  wrap.append(timeEl, board);
  tick();

  function chip(w, type) {
    const b = el('button', { class: 'match-chip ' + type, 'data-h': w.hanzi }, type === 'h' ? w.hanzi : w.ru);
    b.onclick = () => onPick(b, w, type);
    return b;
  }
  function onPick(b, w, type) {
    if (done || b.classList.contains('done')) return;
    if (t0 === null) t0 = performance.now();
    if (!sel) { sel = { b, w, type }; b.classList.add('sel'); return; }
    if (sel.b === b) { b.classList.remove('sel'); sel = null; return; }
    if (sel.type === type) { sel.b.classList.remove('sel'); sel = { b, w, type }; b.classList.add('sel'); return; }
    if (sel.w.hanzi === w.hanzi) {
      [sel.b, b].forEach(x => { x.classList.remove('sel'); x.classList.add('done'); x.disabled = true; });
      CN.audio.speak(w.hanzi); matched++; sel = null;
      if (matched === words.length) finish();
    } else {
      const a = sel.b; a.classList.add('bad'); b.classList.add('bad');
      setTimeout(() => { a.classList.remove('bad', 'sel'); b.classList.remove('bad'); }, 420);
      sel = null;
    }
  }
  function tick() {
    if (!document.body.contains(wrap) || done) return;
    if (t0 !== null) timeEl.textContent = 'Время: ' + ((performance.now() - t0) / 1000).toFixed(1) + ' с';
    requestAnimationFrame(tick);
  }
  function finish() {
    done = true;
    const sec = ((performance.now() - t0) / 1000).toFixed(1);
    CN.store.addXp(8); CN.fx.inkBurst({ count: 24, y: window.innerHeight * 0.4 });
    board.replaceWith(el('div', { class: 'q-result' }, [
      el('div', { class: 'seal-stamp seal-pop', style: 'margin-bottom:14px' }, '快'),
      el('div', { class: 'q-msg' }, 'Все пары собраны за ' + sec + ' с!'),
      el('div', { class: 'q-result-actions' }, [
        el('button', { class: 'btn btn-primary', onclick: () => CN.router.go('#/match') }, [ icon('repeat'), 'Ещё раз' ]),
        el('button', { class: 'btn btn-ghost', onclick: () => CN.router.go('#/home') }, 'На главную'),
      ]),
    ]));
  }
  return wrap;
};

/* ── ПРОПУСК В ПРЕДЛОЖЕНИИ (CLOZE) ────────────────────── */
CN.views.cloze = function () {
  const { el, pick, sample, shuffle } = CN.u, icon = CN.icon;
  const all = []; CN.units.forEach(u => u.lessons.forEach(l => (l.sentences || []).forEach(s => all.push(s))));
  const usable = all.filter(s => CN.segment(s.hanzi).length >= 3);
  const queue = pick(usable, Math.min(8, usable.length));
  const dictset = new Set(CN.allWords.map(w => w.hanzi));
  let i = 0, correct = 0;

  const wrap = el('div', { class: 'view view-cloze' });
  wrap.append(CN._back('#/home', 'на главную'), el('h1', { class: 'view-h' }, 'Вставь слово'),
    el('p', { class: 'view-lead' }, 'Выбери слово, которое пропущено в предложении.'));
  const bar = el('div', { class: 'qbar' }, el('i', {}));
  const stage = el('div', { class: 'qstage' });
  wrap.append(bar, stage);
  render();

  function render() {
    if (i >= queue.length) return finish();
    const s = queue[i];
    CN.u.$('i', bar).style.width = (i / queue.length * 100) + '%';
    const tokens = CN.segment(s.hanzi);
    let cand = tokens.map((t, idx) => ({ t, idx })).filter(o => dictset.has(o.t) && o.idx > 0);
    if (!cand.length) cand = tokens.map((t, idx) => ({ t, idx })).filter(o => o.idx > 0);
    if (!cand.length) cand = tokens.map((t, idx) => ({ t, idx }));
    const blank = sample(cand);
    const distract = pick([...new Set(CN.allWords.map(w => w.hanzi))].filter(h => h !== blank.t), 3);
    const opts = shuffle([blank.t, ...distract]);

    stage.innerHTML = '';
    const slot = el('span', { class: 'cloze-slot' }, '____');
    const line = el('div', { class: 'cloze-line' }, tokens.map((t, idx) =>
      idx === blank.idx ? slot : el('span', { class: 'cloze-w' }, t)));
    const fb = el('div', { class: 'q-feedback' });
    const optBox = el('div', { class: 'q-options' }, opts.map(o =>
      el('button', { class: 'q-opt', onclick: (e) => answer(e.currentTarget, o, blank.t, slot, s) }, el('span', { class: 'opt-zi' }, o))));
    stage.append(line, el('div', { class: 'cloze-ru' }, s.ru), optBox, fb);
  }
  function answer(btn, chosen, right, slot, s) {
    CN.u.$$('.q-opt', stage).forEach(b => b.disabled = true);
    const fb = CN.u.$('.q-feedback', stage);
    slot.textContent = right; slot.classList.add('filled');
    if (chosen === right) { btn.classList.add('correct'); correct++; fb.className = 'q-feedback ok'; fb.append(icon('check'), 'Верно!'); CN.audio.speak(s.hanzi.replace(/[—\-]/g, ' ')); }
    else { btn.classList.add('wrong'); CN.u.$$('.q-opt', stage).find(b => b.textContent === right)?.classList.add('correct'); fb.className = 'q-feedback no'; fb.append(icon('close'), 'Правильно: ' + right); }
    stage.append(el('button', { class: 'btn btn-primary mp-next', onclick: () => { i++; render(); } }, [ icon('repeat'), 'Дальше' ]));
  }
  function finish() {
    CN.u.$('i', bar).style.width = '100%';
    const xp = correct * 3; if (xp) { CN.store.addXp(xp); CN.c.toast(`+${xp} XP`, 'gold'); }
    stage.innerHTML = '';
    stage.append(el('div', { class: 'q-result' }, [
      el('div', { class: 'seal-stamp seal-pop', style: 'margin-bottom:14px' }, correct >= queue.length * 0.7 ? '优' : '继'),
      el('div', { class: 'q-score' }, `${correct}/${queue.length}`),
      el('div', { class: 'q-msg' }, 'Готово!'),
      el('div', { class: 'q-result-actions' }, [
        el('button', { class: 'btn btn-primary', onclick: () => CN.router.go('#/cloze') }, [ icon('repeat'), 'Ещё раз' ]),
        el('button', { class: 'btn btn-ghost', onclick: () => CN.router.go('#/home') }, 'На главную'),
      ]),
    ]));
    if (correct >= queue.length * 0.7) CN.fx.inkBurst({ count: 24, y: window.innerHeight * 0.42 });
  }
  return wrap;
};

/* ── БЛИЦ (60 СЕКУНД) ─────────────────────────────────── */
CN.views.blitz = function () {
  const { el, pick, shuffle, sample } = CN.u, icon = CN.icon;
  const DUR = 60;
  let score = 0, combo = 0, best = 0, t0 = performance.now(), done = false;

  const wrap = el('div', { class: 'view view-blitz' });
  wrap.append(CN._back('#/home', 'на главную'), el('h1', { class: 'view-h' }, 'Блиц · 60 секунд'));
  const hud = el('div', { class: 'blitz-hud' });
  const bar = el('div', { class: 'qbar' }, el('i', { style: 'width:100%' }));
  const stage = el('div', { class: 'qstage' });
  wrap.append(hud, bar, stage);
  updateHud();
  question();
  tick();

  function updateHud() { hud.textContent = `Очки: ${score}  ·  Комбо: ${combo}`; }
  function tick() {
    if (!document.body.contains(wrap) || done) return;
    const left = Math.max(0, DUR - (performance.now() - t0) / 1000);
    CN.u.$('i', bar).style.width = (left / DUR * 100) + '%';
    if (left <= 0) return finish();
    requestAnimationFrame(tick);
  }
  function question() {
    if (done) return;
    const w = sample(CN.allWords);
    const distract = pick(CN.allWords.filter(x => x.ru !== w.ru), 3);
    const opts = shuffle([w, ...distract]);
    stage.innerHTML = '';
    const optBox = el('div', { class: 'q-options' }, opts.map(o =>
      el('button', { class: 'q-opt', onclick: () => answer(o, w) }, o.ru)));
    stage.append(el('div', { class: 'q-prompt' }, el('div', { class: 'zi-grid' }, el('div', { class: 'q-zi' }, w.hanzi))), optBox);
  }
  function answer(o, w) {
    if (done) return;
    const ok = o.hanzi === w.hanzi && o.ru === w.ru;
    if (ok) { score++; combo++; best = Math.max(best, combo); }
    else { combo = 0; }
    updateHud();
    question();
  }
  function finish() {
    done = true;
    CN.u.$('i', bar).style.width = '0%';
    if (score) { CN.store.addXp(score * 2); CN.c.toast(`+${score * 2} XP`, 'gold'); }
    stage.innerHTML = '';
    stage.append(el('div', { class: 'q-result' }, [
      el('div', { class: 'seal-stamp seal-pop', style: 'margin-bottom:14px' }, '速'),
      el('div', { class: 'q-score' }, String(score)),
      el('div', { class: 'q-msg' }, `Очков за минуту · лучшее комбо ${best}`),
      el('div', { class: 'q-result-actions' }, [
        el('button', { class: 'btn btn-primary', onclick: () => CN.router.go('#/blitz') }, [ icon('repeat'), 'Ещё раз' ]),
        el('button', { class: 'btn btn-ghost', onclick: () => CN.router.go('#/home') }, 'На главную'),
      ]),
    ]));
    CN.fx.inkBurst({ count: 28, y: window.innerHeight * 0.42 });
  }
  return wrap;
};

/* ── ЧТЕНИЕ С ПОДСКАЗКАМИ ─────────────────────────────── */
CN.views.read = function () {
  const { el, sample } = CN.u, icon = CN.icon;
  const lessons = []; CN.units.forEach(u => u.lessons.forEach(l => { if (l.sentences && l.sentences.length) lessons.push({ u, l }); }));
  const dict = {}; CN.allWords.forEach(w => { if (!dict[w.hanzi]) dict[w.hanzi] = w; });
  let cur = sample(lessons);

  const wrap = el('div', { class: 'view view-read' });
  wrap.append(CN._back('#/home', 'на главную'), el('h1', { class: 'view-h' }, 'Чтение'));
  const sub = el('p', { class: 'view-lead' });
  const passage = el('div', { class: 'read-passage' });
  const gloss = el('div', { class: 'read-gloss' }, 'Нажми на слово, чтобы увидеть перевод');
  let showRu = false;
  const ctrl = el('div', { class: 'read-ctrl' }, [
    el('button', { class: 'btn btn-primary', onclick: () => CN.audio.speakSeq(cur.l.sentences.map(s => s.hanzi.replace(/[—\-]/g, ' '))) }, [ icon('play'), 'Озвучить текст' ]),
    el('button', { class: 'btn btn-ghost', onclick: (e) => { showRu = !showRu; passage.classList.toggle('show-ru', showRu); e.currentTarget.classList.toggle('on', showRu); } }, [ icon('book'), 'Перевод' ]),
    el('button', { class: 'btn btn-gold', onclick: () => { cur = sample(lessons); build(); } }, [ icon('repeat'), 'Другой текст' ]),
  ]);
  wrap.append(sub, ctrl, gloss, passage);
  build();

  function build() {
    sub.textContent = `Текст урока «${cur.l.title}». ${cur.u.title}.`;
    passage.innerHTML = '';
    cur.l.sentences.forEach(s => {
      const line = el('div', { class: 'read-line' });
      CN.segment(s.hanzi).forEach(tok => {
        if (/[一-鿿]/.test(tok)) line.append(el('span', { class: 'read-w', onclick: () => showGloss(tok) }, tok));
        else line.append(el('span', { class: 'read-p' }, tok));
      });
      line.append(el('button', { class: 'icon-btn read-say', 'aria-label': 'Озвучить', onclick: () => CN.audio.speak(s.hanzi.replace(/[—\-]/g, ' ')) }, icon('speaker')));
      passage.append(line, el('div', { class: 'read-ru' }, s.ru));
    });
  }
  function showGloss(tok) {
    const w = dict[tok];
    gloss.innerHTML = '';
    gloss.append(
      el('span', { class: 'g-zi' }, tok),
      el('span', { class: 'g-pin' }, w ? w.pinyin : '—'),
      el('span', { class: 'g-ru' }, w ? w.ru : 'нет в словаре'),
      el('button', { class: 'icon-btn', 'aria-label': 'Озвучить', onclick: () => CN.audio.speak(tok) }, icon('speaker')),
    );
    CN.audio.speak(tok);
  }
  return wrap;
};

/* ── АУДИРОВАНИЕ ──────────────────────────────────────── */
CN.views.listening = function () {
  const { el, sample } = CN.u, icon = CN.icon;
  let d = sample(CN.listening || []);

  const wrap = el('div', { class: 'view view-listening' });
  wrap.append(CN._back('#/home', 'на главную'), el('h1', { class: 'view-h' }, 'Аудирование'));
  wrap.append(el('p', { class: 'view-lead' }, 'Послушай диалог и ответь на вопрос. Текст откроется после ответа.'));
  const stage = el('div', { class: 'qstage' });
  wrap.append(stage);
  build();

  function build() {
    stage.innerHTML = '';
    const fb = el('div', { class: 'q-feedback' });
    const transcript = el('div', { class: 'listen-transcript' });
    const optBox = el('div', { class: 'q-options', style: 'grid-template-columns:1fr' },
      d.options.map((o, idx) => el('button', { class: 'q-opt', onclick: (e) => answer(e.currentTarget, idx, fb, transcript) }, o)));
    stage.append(
      el('div', { class: 'listen-controls' }, [
        el('button', { class: 'btn btn-primary', onclick: () => CN.audio.speakSeq(d.lines.map(l => l.hanzi)) }, [ icon('play'), 'Прослушать диалог' ]),
        el('button', { class: 'btn btn-gold', onclick: () => { d = sample(CN.listening); build(); } }, [ icon('repeat'), 'Другой диалог' ]),
      ]),
      el('div', { class: 'listen-q' }, d.q),
      optBox, fb, transcript,
    );
  }
  function answer(btn, idx, fb, transcript) {
    CN.u.$$('.q-opt', stage).forEach(b => b.disabled = true);
    if (idx === d.answer) { btn.classList.add('correct'); fb.className = 'q-feedback ok'; fb.append(icon('check'), 'Верно!'); CN.store.addXp(4); }
    else { btn.classList.add('wrong'); CN.u.$$('.q-opt', stage)[d.answer].classList.add('correct'); fb.className = 'q-feedback no'; fb.append(icon('close'), 'Правильный ответ выделен'); }
    transcript.append(el('div', { class: 'lt-title' }, 'Текст диалога:'));
    d.lines.forEach(l => transcript.append(el('div', { class: 'lt-line', onclick: () => CN.audio.speak(l.hanzi) }, [
      el('span', { class: 'lt-zi' }, l.hanzi), el('span', { class: 'lt-pin' }, l.pinyin), el('span', { class: 'lt-ru' }, l.ru),
    ])));
  }
  return wrap;
};

/* ── БЕСКОНЕЧНАЯ ПРАКТИКА ─────────────────────────────── */
CN.views.endless = function () {
  const { el, pick, shuffle, sample } = CN.u, icon = CN.icon;
  let score = 0, answered = 0;

  const wrap = el('div', { class: 'view view-endless' });
  wrap.append(CN._back('#/home', 'на главную'), el('h1', { class: 'view-h' }, 'Бесконечная практика'));
  const hud = el('div', { class: 'mp-score' });
  const stage = el('div', { class: 'qstage' });
  wrap.append(hud, stage,
    el('div', { style: 'text-align:center;margin-top:18px' },
      el('button', { class: 'btn btn-ghost', onclick: finish }, [ icon('check'), 'Закончить' ])));
  next();

  function next() {
    const w = sample(CN.allWords);
    const distract = pick(CN.allWords.filter(x => x.ru !== w.ru), 3);
    const opts = shuffle([w, ...distract]);
    hud.textContent = `Верно: ${score} из ${answered}`;
    stage.innerHTML = '';
    const fb = el('div', { class: 'q-feedback' });
    const optBox = el('div', { class: 'q-options' }, opts.map(o =>
      el('button', { class: 'q-opt', onclick: (e) => answer(e.currentTarget, o, w, fb) }, o.ru)));
    stage.append(el('div', { class: 'q-prompt' }, [
      el('div', { class: 'zi-grid' }, el('div', { class: 'q-zi' }, w.hanzi)),
      el('div', { class: 'q-pin' }, w.pinyin),
    ]), optBox, fb);
    CN.audio.speak(w.hanzi);
  }
  function answer(btn, o, w, fb) {
    CN.u.$$('.q-opt', stage).forEach(b => b.disabled = true);
    const ok = o.hanzi === w.hanzi && o.ru === w.ru;
    answered++;
    CN.store.srsAnswer(w.hanzi, ok);
    if (ok) { score++; btn.classList.add('correct'); fb.className = 'q-feedback ok'; fb.append(icon('check'), 'Верно!'); }
    else { btn.classList.add('wrong'); CN.u.$$('.q-opt', stage).find(b => b.textContent === w.ru)?.classList.add('correct'); fb.className = 'q-feedback no'; fb.append(icon('close'), `${w.hanzi} — ${w.ru}`); }
    setTimeout(next, ok ? 600 : 1200);
  }
  function finish() {
    stage.innerHTML = '';
    const xp = score * 2; if (xp) { CN.store.addXp(xp); CN.c.toast(`+${xp} XP`, 'gold'); }
    stage.append(el('div', { class: 'q-result' }, [
      el('div', { class: 'q-score' }, `${score}/${answered}`),
      el('div', { class: 'q-msg' }, 'Хорошая работа!'),
      el('div', { class: 'q-result-actions' }, [
        el('button', { class: 'btn btn-ghost', onclick: () => CN.router.go('#/home') }, 'На главную'),
      ]),
    ]));
  }
  return wrap;
};
