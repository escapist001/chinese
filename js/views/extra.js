/* views/extra.js — поиск по словам и настройки. */
window.CN = window.CN || {};
CN.views = CN.views || {};

/* ── ПОИСК ─────────────────────────────────────────────── */
CN.views.search = function () {
  const { el } = CN.u, icon = CN.icon;
  const wrap = el('div', { class: 'view view-search' });
  wrap.append(el('button', { class: 'back-link', onclick: () => CN.router.go('#/home') }, [ icon('arrowLeft'), 'к программе' ]));
  wrap.append(el('h1', { class: 'view-h' }, 'Словарь курса'));

  const input = el('input', { class: 'search-input', placeholder: 'Иероглиф, пиньинь или перевод…', type: 'text', 'aria-label': 'Поиск по словарю' });
  const results = el('div', { class: 'words-list' });
  wrap.append(
    el('div', { class: 'search-wrap' }, [ icon('search'), input ]),
    el('div', { class: 'search-meta', id: 'smeta' }, `Всего слов: ${CN.allWords.length}`),
    results,
  );

  function run(q) {
    q = q.trim().toLowerCase();
    const list = !q ? CN.allWords
      : CN.allWords.filter(w =>
          w.hanzi.includes(q) || w.pinyin.toLowerCase().includes(q) || w.ru.toLowerCase().includes(q));
    results.innerHTML = '';
    list.slice(0, 120).forEach(w => results.append(CN.c.wordRow(w)));
    CN.u.$('#smeta', wrap).textContent = `Найдено: ${list.length}`;
  }
  input.addEventListener('input', () => run(input.value));
  run('');
  setTimeout(() => input.focus(), 50);
  return wrap;
};

/* ── НАСТРОЙКИ ─────────────────────────────────────────── */
CN.views.settings = function () {
  const { el } = CN.u, st = CN.store, icon = CN.icon;
  const s = st.settings();
  const wrap = el('div', { class: 'view view-settings' });
  wrap.append(el('button', { class: 'back-link', onclick: () => CN.router.go('#/home') }, [ icon('arrowLeft'), 'к программе' ]));
  wrap.append(el('h1', { class: 'view-h' }, 'Настройки'));

  // скорость озвучки
  const rate = el('input', { type: 'range', min: '0.5', max: '1.2', step: '0.05', value: s.rate, 'aria-label': 'Скорость озвучки' });
  rate.addEventListener('input', () => { st.setSetting('rate', +rate.value); rateVal.textContent = rate.value; });
  const rateVal = el('span', { class: 'set-val' }, String(s.rate));
  const preset = (label, val) => el('button', { class: 'btn btn-ghost set-preset', onclick: () => {
    st.setSetting('rate', val); rate.value = val; rateVal.textContent = val; CN.audio.speak('你好'); } }, label);
  const presets = el('div', { class: 'set-presets' }, [ preset('Медленно', 0.6), preset('Обычно', 0.85), preset('Быстро', 1.1) ]);

  // цель дня
  const goal = el('input', { type: 'number', min: '5', max: '50', value: s.dailyGoal, class: 'set-num', 'aria-label': 'Цель на день' });
  goal.addEventListener('change', () => st.setSetting('dailyGoal', CN.u.clamp(+goal.value, 5, 50)));

  // тема
  const themeBtn = el('button', { class: 'btn btn-ghost', onclick: () => { CN.theme.toggle(); CN.router.go('#/settings'); } },
    [ icon(CN.theme.current() === 'dark' ? 'sun' : 'moon'), CN.theme.current() === 'dark' ? 'Дневная 昼' : 'Ночная 夜' ]);

  // показывать пиньинь
  const pinBtn = el('button', { class: 'btn btn-ghost', onclick: (e) => {
    const v = !(s.showPinyin !== false); st.setSetting('showPinyin', v); CN.applyPrefs();
    e.currentTarget.textContent = ''; e.currentTarget.append(icon(v ? 'check' : 'close'), v ? 'Показан' : 'Скрыт'); } },
    [ icon(s.showPinyin === false ? 'close' : 'check'), s.showPinyin === false ? 'Скрыт' : 'Показан' ]);

  // размер иероглифов
  const sizeBtn = el('button', { class: 'btn btn-ghost', onclick: (e) => {
    const v = s.hanziSize === 'l' ? 'm' : 'l'; s.hanziSize = v; st.setSetting('hanziSize', v); CN.applyPrefs();
    e.currentTarget.textContent = ''; e.currentTarget.append(icon('book'), v === 'l' ? 'Крупные' : 'Обычные'); } },
    [ icon('book'), s.hanziSize === 'l' ? 'Крупные' : 'Обычные' ]);

  // питомцы-компаньоны 🐱🐶
  const PET_ORDER = ['both', 'lusya', 'rada', 'panda', 'off'];
  const PET_LABEL = { both: 'Люся и Рада 🐱🐶', lusya: 'Люся 🐱', rada: 'Рада 🐶', panda: 'Панда 🐼', off: 'Выключены' };
  const petCur = () => s.pet === false ? 'off' : (s.petChar || 'both');
  const petBtn = el('button', { class: 'btn btn-ghost' }, PET_LABEL[petCur()]);
  petBtn.addEventListener('click', () => {
    const next = PET_ORDER[(PET_ORDER.indexOf(petCur()) + 1) % PET_ORDER.length];
    if (next === 'off') st.setSetting('pet', false);
    else { st.setSetting('pet', true); st.setSetting('petChar', next); }
    petBtn.textContent = PET_LABEL[next];
    if (CN.mascot) CN.mascot.refresh();
  });

  wrap.append(el('div', { class: 'settings-list' }, [
    row('speaker', 'Скорость озвучки', el('div', { class: 'set-speed' }, [ presets,
      el('div', { class: 'set-inline' }, [ rate, rateVal ]) ])),
    row('target', 'Цель на день (слов)', goal),
    row('moon', 'Оформление', themeBtn),
    row('book', 'Пиньинь под словами', pinBtn),
    row('book', 'Размер иероглифов', sizeBtn),
    row('star', 'Кто рядом с тобой', petBtn),
    row('speaker', 'Живой голос', el('span', {}, CN.audio.voiceCount
      ? `${CN.audio.voiceCount} фраз озвучены носителем` + (CN.audio.available() ? '' : '')
      : (CN.audio.available() ? 'системный голос' : 'недоступна'))),
  ]));

  wrap.append(el('div', { class: 'danger-zone' }, [
    el('button', { class: 'btn btn-danger', onclick: () => {
      if (confirm('Сбросить весь прогресс и настройки?')) { st.reset(); CN.theme.set('light'); CN.router.go('#/home'); }
    } }, 'Сбросить весь прогресс'),
  ]));
  return wrap;

  function row(ic, label, control) {
    return el('div', { class: 'set-row' }, [
      el('div', { class: 'set-label' }, [ icon(ic), label ]),
      control,
    ]);
  }
};
