/* ============================================================
   views/practice.js — дополнительные режимы тренировки (Фаза 2):
   • tonegame  — услышал слог → выбери тон 1–4
   • dictation — услышал → набери пиньинь
   • build     — собери предложение в правильном порядке
   • mistakes  — работа над ошибками (слова, где ошибалась)
   ============================================================ */
window.CN = window.CN || {};
CN.views = CN.views || {};

/* нормализация пиньиня: убрать тоновые знаки/пробелы для сравнения */
CN._noTone = function (p) {
  return String(p).normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[\s'·]/g, '').toLowerCase().replace(/ü/g, 'v').replace(/u:/g, 'v');
};
/* тон слога по диакритике */
CN._toneOf = function (p) {
  const sets = { 1: 'āēīōūǖ', 2: 'áéíóúǘ', 3: 'ǎěǐǒǔǚ', 4: 'àèìòùǜ' };
  for (const ch of String(p)) for (const t in sets) if (sets[t].includes(ch)) return +t;
  return 5;
};
/* сегментация фразы на слова по словарю (жадно, самое длинное совпадение) */
CN.segment = function (hanzi) {
  const clean = [...String(hanzi).replace(/[，。！？、,.!?\s—-]/g, '')];
  const dict = CN.allWords.map(w => w.hanzi).sort((a, b) => [...b].length - [...a].length);
  const out = []; let p = 0;
  while (p < clean.length) {
    let m = null;
    for (const w of dict) { const wl = [...w].length; if (wl <= clean.length - p && clean.slice(p, p + wl).join('') === w) { m = w; break; } }
    if (m) { out.push(m); p += [...m].length; } else { out.push(clean[p]); p++; }
  }
  return out;
};

/* ── ТРЕНАЖЁР ТОНОВ ───────────────────────────────────── */
CN.views.tonegame = function () {
  const { el, sample } = CN.u, icon = CN.icon;
  // односложные слова с явным тоном 1–4
  const pool = CN.allWords.filter(w => [...w.hanzi].length === 1)
    .map(w => ({ ...w, tone: CN._toneOf(w.pinyin) })).filter(w => w.tone <= 4);
  let score = 0, round = 0, cur = null;

  const wrap = el('div', { class: 'view view-tonegame' });
  wrap.append(el('button', { class: 'back-link', onclick: () => CN.router.go('#/home') }, [ icon('arrowLeft'), 'на главную' ]));
  wrap.append(el('h1', { class: 'view-h' }, 'Тренажёр тонов'));
  wrap.append(el('p', { class: 'view-lead' }, 'Послушай слог и определи его тон. Тоны — основа китайского произношения.'));
  const scoreEl = el('div', { class: 'mp-score' });
  const stage = el('div', { class: 'qstage' });
  wrap.append(scoreEl, stage);
  next();

  function next() {
    round++; cur = sample(pool);
    scoreEl.textContent = `Счёт: ${score} · вопрос ${round}`;
    stage.innerHTML = '';
    stage.append(
      el('div', { class: 'q-prompt' }, [
        el('div', { class: 'zi-grid' }, el('div', { class: 'q-zi' }, cur.hanzi)),
        el('button', { class: 'btn btn-ghost', style: 'margin-top:14px', onclick: () => CN.audio.speak(cur.hanzi) }, [ icon('speaker'), 'Послушать ещё' ]),
      ]),
      el('div', { class: 'q-options tone-opts' }, [1, 2, 3, 4].map(t =>
        el('button', { class: 'q-opt', onclick: (e) => answer(e.currentTarget, t) }, [
          el('span', { class: 'opt-key' }, String(t)), `${t} тон`,
        ]))),
      el('div', { class: 'q-feedback' }),
    );
    CN.audio.speak(cur.hanzi);
  }
  function answer(btn, t) {
    CN.u.$$('.q-opt', stage).forEach(b => b.disabled = true);
    const fb = CN.u.$('.q-feedback', stage);
    if (t === cur.tone) { btn.classList.add('correct'); score++; CN.store.addXp(2);
      fb.className = 'q-feedback ok'; fb.append(icon('check'), `Верно — ${cur.pinyin} (${cur.ru})`); }
    else { btn.classList.add('wrong');
      CN.u.$$('.q-opt', stage)[cur.tone - 1].classList.add('correct');
      fb.className = 'q-feedback no'; fb.append(icon('close'), `Это ${cur.tone}-й тон: ${cur.pinyin}`); }
    stage.append(el('button', { class: 'btn btn-primary mp-next', onclick: next }, [ icon('repeat'), 'Дальше' ]));
  }
  return wrap;
};

/* ── ДИКТАНТ (набери пиньинь) ──────────────────────────── */
CN.views.dictation = function () {
  const { el, pick } = CN.u, icon = CN.icon;
  const queue = pick(CN.allWords, Math.min(10, CN.allWords.length));
  let i = 0, correct = 0;

  const wrap = el('div', { class: 'view view-dictation' });
  wrap.append(el('button', { class: 'back-link', onclick: () => CN.router.go('#/home') }, [ icon('arrowLeft'), 'на главную' ]));
  wrap.append(el('h1', { class: 'view-h' }, 'Диктант'));
  wrap.append(el('p', { class: 'view-lead' }, 'Послушай слово и набери его пиньинем (тоны можно не ставить). Например: ni hao.'));
  const bar = el('div', { class: 'qbar' }, el('i', {}));
  const stage = el('div', { class: 'qstage' });
  wrap.append(bar, stage);
  render();

  function render() {
    if (i >= queue.length) return finish();
    const w = queue[i];
    CN.u.$('i', bar).style.width = (i / queue.length * 100) + '%';
    stage.innerHTML = '';
    const input = el('input', { class: 'search-input dict-input', type: 'text', autocomplete: 'off',
      autocapitalize: 'off', spellcheck: 'false', placeholder: 'набери пиньинь…' });
    const fb = el('div', { class: 'q-feedback' });
    const check = () => {
      if (input.disabled) return;
      const ok = CN._noTone(input.value) === CN._noTone(w.pinyin);
      input.disabled = true;
      CN.store.srsAnswer(w.hanzi, ok);
      if (ok) { correct++; fb.className = 'q-feedback ok'; fb.append(icon('check'), `Верно: ${w.hanzi} ${w.pinyin}`); }
      else { fb.className = 'q-feedback no'; fb.append(icon('close'), `${w.hanzi} — ${w.pinyin} (${w.ru})`); }
      btn.textContent = ''; btn.append(icon('repeat'), 'Дальше'); btn.onclick = () => { i++; render(); };
    };
    const btn = el('button', { class: 'btn btn-primary', onclick: check }, 'Проверить');
    input.addEventListener('keydown', e => { if (e.key === 'Enter') (input.disabled ? (i++, render()) : check()); });
    stage.append(
      el('div', { class: 'q-prompt' }, [
        el('button', { class: 'q-audio', 'aria-label': 'Повторить', onclick: () => CN.audio.speak(w.hanzi) }, icon('speaker')),
        el('div', { class: 'q-tag' }, 'слово ' + (i + 1) + ' из ' + queue.length),
      ]),
      input, el('div', { style: 'margin-top:14px' }, btn), fb,
    );
    setTimeout(() => input.focus(), 50);
    CN.audio.speak(w.hanzi);
  }
  function finish() {
    CN.u.$('i', bar).style.width = '100%';
    const xp = correct * 3; if (xp) { CN.store.addXp(xp); CN.c.toast(`+${xp} XP`, 'gold'); }
    stage.innerHTML = '';
    stage.append(el('div', { class: 'q-result' }, [
      el('div', { class: 'seal-stamp seal-pop', style: 'margin-bottom:14px' }, correct >= queue.length * 0.7 ? '优' : '继'),
      el('div', { class: 'q-score' }, `${correct}/${queue.length}`),
      el('div', { class: 'q-msg' }, 'Диктант завершён!'),
      el('div', { class: 'q-result-actions' }, [
        el('button', { class: 'btn btn-primary', onclick: () => CN.router.go('#/dictation') }, [ icon('repeat'), 'Ещё раз' ]),
        el('button', { class: 'btn btn-ghost', onclick: () => CN.router.go('#/home') }, 'На главную'),
      ]),
    ]));
    if (correct >= queue.length * 0.7) CN.fx.inkBurst({ count: 26, y: window.innerHeight * 0.42 });
  }
  return wrap;
};

/* ── СБОРКА ПРЕДЛОЖЕНИЯ ────────────────────────────────── */
CN.views.build = function ({ id } = {}) {
  const { el, shuffle, pick } = CN.u, icon = CN.icon;
  let sentences = [];
  if (id) { const f = cnFindLesson(id); if (f) sentences = f.lesson.sentences.slice(); }
  if (!sentences.length) {
    const all = []; CN.units.forEach(u => u.lessons.forEach(l => all.push(...(l.sentences || []))));
    sentences = pick(all, Math.min(8, all.length));
  }
  let i = 0, correct = 0;

  const wrap = el('div', { class: 'view view-build' });
  wrap.append(el('button', { class: 'back-link', onclick: () => CN.router.go(id ? '#/lesson/' + id : '#/home') }, [ icon('arrowLeft'), 'назад' ]));
  wrap.append(el('h1', { class: 'view-h' }, 'Собери предложение'));
  wrap.append(el('p', { class: 'view-lead' }, 'Нажимай на слова в правильном порядке, чтобы собрать китайскую фразу по переводу.'));
  const bar = el('div', { class: 'qbar' }, el('i', {}));
  const stage = el('div', { class: 'qstage' });
  wrap.append(bar, stage);
  render();

  function render() {
    if (i >= sentences.length) return finish();
    const s = sentences[i];
    CN.u.$('i', bar).style.width = (i / sentences.length * 100) + '%';
    const tokens = CN.segment(s.hanzi);
    stage.innerHTML = '';
    const answer = el('div', { class: 'build-answer' });
    const bank = el('div', { class: 'build-bank' });
    const fb = el('div', { class: 'q-feedback' });
    const placed = [];

    shuffle(tokens.map((t, idx) => ({ t, idx }))).forEach(o => {
      const chip = el('button', { class: 'build-chip', onclick: () => { move(chip, o.t); } }, o.t);
      bank.append(chip);
    });
    function move(chip, t) {
      if (chip.classList.contains('used')) return;
      chip.classList.add('used'); chip.disabled = true;
      const a = el('button', { class: 'build-chip in', onclick: () => { a.remove(); chip.classList.remove('used'); chip.disabled = false; placed.splice(placed.indexOf(t), 1); } }, t);
      answer.append(a); placed.push(t);
    }
    const check = el('button', { class: 'btn btn-primary', onclick: () => {
      const ok = placed.join('') === tokens.join('');
      if (ok) { correct++; fb.className = 'q-feedback ok'; fb.append(icon('check'), 'Верно!'); CN.audio.speak(s.hanzi.replace(/[—\-]/g, ' ')); }
      else { fb.className = 'q-feedback no'; fb.append(icon('close'), CN.u.el('span', {}, `Правильно: ${s.hanzi}`)); }
      CN.u.$$('.build-chip', bank).forEach(b => b.disabled = true);
      check.remove();
      stage.append(el('button', { class: 'btn btn-ghost mp-next', onclick: () => { i++; render(); } }, [ icon('repeat'), 'Дальше' ]));
    } }, [ icon('check'), 'Проверить' ]);

    stage.append(
      el('div', { class: 'build-ru' }, s.ru),
      el('div', { class: 'build-pin' }, s.pinyin),
      answer, el('div', { class: 'build-hr' }), bank,
      el('div', { style: 'margin-top:16px' }, check), fb,
    );
  }
  function finish() {
    CN.u.$('i', bar).style.width = '100%';
    const xp = correct * 4; if (xp) { CN.store.addXp(xp); CN.c.toast(`+${xp} XP`, 'gold'); }
    stage.innerHTML = '';
    stage.append(el('div', { class: 'q-result' }, [
      el('div', { class: 'seal-stamp seal-pop', style: 'margin-bottom:14px' }, '优'),
      el('div', { class: 'q-score' }, `${correct}/${sentences.length}`),
      el('div', { class: 'q-msg' }, 'Готово!'),
      el('div', { class: 'q-result-actions' }, [
        el('button', { class: 'btn btn-ghost', onclick: () => CN.router.go('#/home') }, 'На главную'),
      ]),
    ]));
    CN.fx.inkBurst({ count: 26, y: window.innerHeight * 0.42 });
  }
  return wrap;
};

/* ── РАБОТА НАД ОШИБКАМИ ───────────────────────────────── */
CN.views.mistakes = function () {
  const { el } = CN.u, icon = CN.icon;
  const words = CN.allWords.filter(w => CN.store.mistakeWords().includes(w.hanzi));

  const wrap = el('div', { class: 'view view-mistakes' });
  wrap.append(el('button', { class: 'back-link', onclick: () => CN.router.go('#/home') }, [ icon('arrowLeft'), 'на главную' ]));
  wrap.append(el('h1', { class: 'view-h' }, 'Работа над ошибками'));

  if (!words.length) {
    wrap.append(el('div', { class: 'empty' }, [
      el('div', { class: 'empty-zi' }, '完美'),
      el('p', {}, 'Ошибок нет — отлично! Сюда попадают слова, в которых ты ошиблась в квизах. Отвечай правильно — и они исчезают.'),
      el('button', { class: 'btn btn-primary', onclick: () => CN.router.go('#/home') }, 'К урокам'),
    ]));
    return wrap;
  }

  let i = 0;
  wrap.append(el('p', { class: 'view-lead' }, `Слов с ошибками: ${words.length}. Вспомни перевод, переверни и оцени себя.`));
  const stage = el('div', { class: 'review-stage' });
  wrap.append(stage);
  card();
  function card() {
    if (i >= words.length) return done();
    const w = words[i];
    stage.innerHTML = '';
    stage.append(
      el('div', { class: 'review-count' }, `${i + 1} / ${words.length}`),
      CN.c.flashcard(w),
      el('div', { class: 'rate-row' }, [
        el('button', { class: 'btn btn-danger', onclick: () => grade(false) }, [ icon('close'), 'Ещё путаю' ]),
        el('button', { class: 'btn btn-gold', onclick: () => grade(true) }, [ icon('check'), 'Запомнила' ]),
      ]),
    );
    function grade(ok) { CN.store.srsAnswer(w.hanzi, ok); i++; card(); }
  }
  function done() {
    stage.innerHTML = '';
    stage.append(el('div', { class: 'q-result' }, [
      el('div', { class: 'seal-stamp seal-pop', style: 'margin-bottom:14px' }, '净'),
      el('div', { class: 'q-msg' }, 'Разобрали ошибки!'),
      el('button', { class: 'btn btn-primary', style: 'margin-top:16px', onclick: () => CN.router.go('#/home') }, 'На главную'),
    ]));
    CN.fx.inkBurst({ count: 20, y: window.innerHeight * 0.4 });
  }
  return wrap;
};
