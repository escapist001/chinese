/* ============================================================
   views/methodology.js — методика и структура (Фаза 4):
   • grammar     — справочник грамматики (поиск)
   • radicals    — ключи иероглифов (部首)
   • pinyintable — слоговая таблица пиньиня
   • measure     — счётные слова (量词)
   • placement   — вводный тест (с чего начать)
   • hsktest     — пробный тест HSK 1
   ============================================================ */
window.CN = window.CN || {};
CN.views = CN.views || {};

/* ── СПРАВОЧНИК ГРАММАТИКИ ─────────────────────────────── */
CN.views.grammar = function () {
  const { el } = CN.u, icon = CN.icon;
  const items = [];
  CN.units.forEach(u => u.lessons.forEach(l => { if (l.grammar) items.push({ ...l.grammar, lesson: l.title, unit: u.title, id: l.id }); }));

  const wrap = el('div', { class: 'view view-grammar' });
  wrap.append(CN._back('#/home', 'на главную'), el('h1', { class: 'view-h' }, 'Грамматика'),
    el('p', { class: 'view-lead' }, 'Все правила курса в одном месте. Используй поиск.'));
  const input = el('input', { class: 'search-input', type: 'text', placeholder: 'Поиск по правилам…' });
  const list = el('div', { class: 'gram-list' });
  wrap.append(el('div', { class: 'search-wrap' }, [ icon('search'), input ]), list);

  function run(q) {
    q = q.trim().toLowerCase();
    list.innerHTML = '';
    items.filter(g => !q || g.title.toLowerCase().includes(q) || g.body.toLowerCase().includes(q))
      .forEach(g => list.append(el('div', { class: 'gram-card' }, [
        el('div', { class: 'gram-meta' }, `${g.unit} · ${g.lesson}`),
        el('h3', {}, g.title),
        el('p', {}, g.body),
        el('button', { class: 'btn btn-ghost', onclick: () => CN.router.go('#/lesson/' + g.id) }, 'К уроку →'),
      ])));
    if (!list.children.length) list.append(el('p', { class: 'tip' }, 'Ничего не найдено.'));
  }
  input.addEventListener('input', () => run(input.value));
  run('');
  return wrap;
};

/* ── РАДИКАЛЫ (部首) ───────────────────────────────────── */
CN.views.radicals = function () {
  const { el } = CN.u, icon = CN.icon;
  const wrap = el('div', { class: 'view view-radicals' });
  wrap.append(CN._back('#/home', 'на главную'), el('h1', { class: 'view-h' }, 'Ключи иероглифов (部首)'),
    el('p', { class: 'view-lead' }, 'Иероглифы состоят из «кирпичиков» — ключей. Зная их, легче запоминать и понимать смысл. Нажми на пример, чтобы услышать.'));
  wrap.append(el('div', { class: 'rad-grid' }, CN.radicals.map(r =>
    el('div', { class: 'rad-card' }, [
      el('button', { class: 'rad-char', onclick: () => CN.audio.speak(r.char) }, r.char + (r.alt ? ' ' + r.alt : '')),
      el('div', { class: 'rad-pin' }, r.pinyin),
      el('div', { class: 'rad-mean' }, r.meaning),
      el('div', { class: 'rad-ex' }, r.examples.map(c =>
        el('button', { class: 'rad-ex-c', onclick: () => CN.audio.speak(c) }, c))),
    ]))));
  return wrap;
};

/* ── ТАБЛИЦА ПИНЬИНЯ ──────────────────────────────────── */
CN.views.pinyintable = function () {
  const { el } = CN.u;
  const inits = ['', ...CN.initials.map(x => x.p)];
  const fins = CN.finals.map(x => x.p);
  const wrap = el('div', { class: 'view view-pintable' });
  wrap.append(CN._back('#/pinyin', 'к фонетике'), el('h1', { class: 'view-h' }, 'Слоговая таблица'),
    el('p', { class: 'view-lead' }, 'Слог = инициаль + финаль. Нажми на ячейку, чтобы услышать (системный голос). Не все сочетания существуют в языке.'));

  const table = el('table', { class: 'pin-table' });
  const head = el('tr', {}, [ el('th', {}, '') , ...fins.map(f => el('th', {}, f)) ]);
  table.append(head);
  inits.forEach(ini => {
    const row = el('tr', {}, [ el('th', {}, ini || '∅') ]);
    fins.forEach(f => {
      const syl = (ini + f);
      row.append(el('td', {}, el('button', { class: 'pt-cell', onclick: () => CN.audio.speak(syl) }, syl)));
    });
    table.append(row);
  });
  wrap.append(el('div', { class: 'pt-wrap' }, table));
  return wrap;
};

/* ── СЧЁТНЫЕ СЛОВА (量词) ──────────────────────────────── */
CN.views.measure = function () {
  const { el } = CN.u, icon = CN.icon;
  const wrap = el('div', { class: 'view view-measure' });
  wrap.append(CN._back('#/home', 'на главную'), el('h1', { class: 'view-h' }, 'Счётные слова (量词)'),
    el('p', { class: 'view-lead' }, 'В китайском между числом и предметом ставят счётное слово: «一 个 人». Вот самые частые.'));
  wrap.append(el('div', { class: 'meas-list' }, CN.measureWords.map(m =>
    el('div', { class: 'meas-card' }, [
      el('button', { class: 'meas-char', onclick: () => CN.audio.speak(m.char) }, m.char),
      el('div', { class: 'meas-mid' }, [
        el('div', { class: 'meas-pin' }, m.pinyin),
        el('div', { class: 'meas-use' }, m.use),
      ]),
      el('button', { class: 'meas-ex', onclick: () => CN.audio.speak(m.example.hanzi) }, [
        el('span', { class: 'me-zi' }, m.example.hanzi),
        el('span', { class: 'me-ru' }, m.example.ru),
        icon('speaker'),
      ]),
    ]))));
  return wrap;
};

/* ── ВВОДНЫЙ ТЕСТ ─────────────────────────────────────── */
CN.views.placement = function () {
  const { el, pick, shuffle } = CN.u, icon = CN.icon;
  const N = 8;
  const qs = pick(CN.allWords, N);
  let i = 0, correct = 0;

  const wrap = el('div', { class: 'view view-placement' });
  wrap.append(CN._back('#/home', 'на главную'), el('h1', { class: 'view-h' }, 'Вводный тест'),
    el('p', { class: 'view-lead' }, 'Несколько слов, чтобы понять, с чего тебе удобнее начать. Выбери перевод.'));
  const bar = el('div', { class: 'qbar' }, el('i', {}));
  const stage = el('div', { class: 'qstage' });
  wrap.append(bar, stage);
  render();

  function render() {
    if (i >= qs.length) return finish();
    const w = qs[i];
    CN.u.$('i', bar).style.width = (i / qs.length * 100) + '%';
    const opts = shuffle([w, ...pick(CN.allWords.filter(x => x.ru !== w.ru), 3)]);
    stage.innerHTML = '';
    stage.append(
      el('div', { class: 'q-prompt' }, [ el('div', { class: 'zi-grid' }, el('div', { class: 'q-zi' }, w.hanzi)), el('div', { class: 'q-pin' }, w.pinyin) ]),
      el('div', { class: 'q-options' }, opts.map(o => el('button', { class: 'q-opt', onclick: () => { if (o.ru === w.ru) correct++; i++; render(); } }, o.ru))),
    );
  }
  function finish() {
    CN.u.$('i', bar).style.width = '100%';
    let msg, startHref, startLabel;
    if (correct >= 7) { msg = 'Ты уже знаешь много слов! Повторяй и иди в конец курса.'; startHref = '#/review'; startLabel = 'К повторению'; }
    else if (correct >= 4) { msg = 'Хорошая база. Начни с середины курса — юниты 2–3.'; startHref = '#/lesson/' + (CN.units[1] ? CN.units[1].lessons[0].id : CN.units[0].lessons[0].id); startLabel = 'Начать с юнита 2'; }
    else { msg = 'Идеально начать с самого начала — с первого урока.'; startHref = '#/lesson/' + CN.units[0].lessons[0].id; startLabel = 'Начать с урока 1'; }
    stage.innerHTML = '';
    stage.append(el('div', { class: 'q-result' }, [
      el('div', { class: 'seal-stamp seal-pop', style: 'margin-bottom:14px' }, '始'),
      el('div', { class: 'q-score' }, `${correct}/${qs.length}`),
      el('div', { class: 'q-msg' }, msg),
      el('div', { class: 'q-result-actions' }, [
        el('button', { class: 'btn btn-primary', onclick: () => CN.router.go(startHref) }, [ icon('play'), startLabel ]),
        el('button', { class: 'btn btn-ghost', onclick: () => CN.router.go('#/home') }, 'На главную'),
      ]),
    ]));
  }
  return wrap;
};

/* ── ПРОБНЫЙ ТЕСТ HSK 1 ───────────────────────────────── */
CN.views.hsktest = function () {
  const { el, pick, shuffle, sample } = CN.u, icon = CN.icon;
  const N = 15;
  const qs = pick(CN.allWords, Math.min(N, CN.allWords.length)).map(w => ({ w, mode: sample(['h2r', 'r2h', 'audio']) }));
  let i = 0, correct = 0;

  const wrap = el('div', { class: 'view view-hsktest' });
  wrap.append(CN._back('#/home', 'на главную'), el('h1', { class: 'view-h' }, 'Пробный тест · ' + (CN.courseLevel || 'HSK 1')),
    el('p', { class: 'view-lead' }, '15 заданий в формате экзамена: чтение, перевод и на слух. Проверь свою готовность.'));
  const bar = el('div', { class: 'qbar' }, el('i', {}));
  const stage = el('div', { class: 'qstage' });
  wrap.append(bar, stage);
  render();

  function render() {
    if (i >= qs.length) return finish();
    const { w, mode } = qs[i];
    CN.u.$('i', bar).style.width = (i / qs.length * 100) + '%';
    const opts = shuffle([w, ...pick(CN.allWords.filter(x => x.ru !== w.ru), 3)]);
    stage.innerHTML = '';
    let prompt, label;
    if (mode === 'h2r') { prompt = el('div', { class: 'q-prompt' }, el('div', { class: 'zi-grid' }, el('div', { class: 'q-zi' }, w.hanzi))); label = o => o.ru; }
    else if (mode === 'r2h') { prompt = el('div', { class: 'q-prompt' }, [ el('div', { class: 'q-ru-big' }, w.ru), el('div', { class: 'q-tag' }, 'выбери иероглиф') ]); label = o => o.hanzi; }
    else { prompt = el('div', { class: 'q-prompt' }, [ el('button', { class: 'q-audio', 'aria-label': 'Повторить', onclick: () => CN.audio.speak(w.hanzi) }, icon('speaker')), el('div', { class: 'q-tag' }, 'на слух' ) ]); label = o => o.ru; CN.audio.speak(w.hanzi); }
    stage.append(prompt, el('div', { class: 'q-options' }, opts.map(o =>
      el('button', { class: 'q-opt', onclick: () => { if (o.hanzi === w.hanzi && o.ru === w.ru) correct++; i++; render(); } },
        mode === 'r2h' ? el('span', { class: 'opt-zi' }, label(o)) : el('span', {}, label(o))))));
  }
  function finish() {
    CN.u.$('i', bar).style.width = '100%';
    const pct = Math.round(correct / qs.length * 100);
    CN.store.recordQuiz(correct, qs.length);
    const pass = pct >= 80;
    stage.innerHTML = '';
    stage.append(el('div', { class: 'q-result' }, [
      el('div', { class: 'seal-stamp seal-pop', style: 'margin-bottom:14px' }, pass ? '合格' : '加油'),
      el('div', { class: 'q-score' }, pct + '%'),
      el('div', { class: 'q-msg' }, pass ? 'Поздравляю — уровень сдан!' : 'Почти! Повтори слова и попробуй ещё.'),
      el('div', { class: 'q-xp' }, [ icon('chart'), `${correct} из ${qs.length} верно` ]),
      el('div', { class: 'q-result-actions' }, [
        el('button', { class: 'btn btn-primary', onclick: () => CN.router.go('#/hsktest') }, [ icon('repeat'), 'Ещё раз' ]),
        el('button', { class: 'btn btn-ghost', onclick: () => CN.router.go('#/home') }, 'На главную'),
      ]),
    ]));
    if (pass) CN.fx.inkBurst({ count: 30, y: window.innerHeight * 0.42 });
  }
  return wrap;
};
