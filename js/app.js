/* app.js — точка входа: регистрируем маршруты и запускаем приложение. */
(function () {
  const R = CN.router, { el } = CN.u;
  R.add('home', 'home');
  R.add('pinyin', 'pinyin');
  R.add('minpairs', 'minpairs');
  R.add('lesson/:id', 'lesson');
  R.add('quiz/:id', 'quiz');
  R.add('quiz', 'quiz');
  R.add('review', 'review');
  R.add('tonegame', 'tonegame');
  R.add('dictation', 'dictation');
  R.add('mistakes', 'mistakes');
  R.add('build/:id', 'build');
  R.add('build', 'build');
  R.add('match', 'match');
  R.add('cloze', 'cloze');
  R.add('blitz', 'blitz');
  R.add('read', 'read');
  R.add('listening', 'listening');
  R.add('endless', 'endless');
  R.add('grammar', 'grammar');
  R.add('radicals', 'radicals');
  R.add('pinyintable', 'pinyintable');
  R.add('measure', 'measure');
  R.add('placement', 'placement');
  R.add('hsktest', 'hsktest');
  R.add('profile', 'profile');
  R.add('favorites', 'favorites');
  R.add('decks', 'decks');
  R.add('garden', 'garden');
  R.add('etymology', 'etymology');
  R.add('search', 'search');
  R.add('settings', 'settings');

  // навигация в шапке: [href, текст, секция, иконка?]
  const links = [
    ['#/home', 'Главная', 'home', 'book'],
    ['#/pinyin', '拼 Фонетика', 'pinyin', null],
    ['#/review', 'Повторение', 'review', 'repeat'],
    ['#/profile', 'Профиль', 'profile', 'trophy'],
    ['#/search', 'Словарь', 'search', 'search'],
    ['#/settings', '', 'settings', 'gear'],
  ];
  const nav = CN.u.$('#nav');
  links.forEach(([href, text, sec, ic]) => {
    const kids = [];
    if (ic) kids.push(CN.icon(ic));
    if (text) kids.push(text);
    nav.append(el('a', { href, class: 'nav-link', 'data-section': sec,
      'aria-label': text || 'Настройки' }, kids));
  });

  // нижняя навигация (телефон): 5 главных разделов
  const bnav = CN.u.$('#bottomNav');
  if (bnav) {
    [
      ['#/home', 'Главная', 'home', 'home'],
      ['#/review', 'Повтор', 'review', 'repeat'],
      ['#/profile', 'Профиль', 'profile', 'trophy'],
      ['#/search', 'Словарь', 'search', 'search'],
      ['#/settings', 'Ещё', 'settings', 'gear'],
    ].forEach(([href, text, sec, ic]) => {
      bnav.append(el('a', { href, class: 'nav-link bnav-link', 'data-section': sec, 'aria-label': text },
        [ CN.icon(ic), el('span', { class: 'bnav-t' }, text) ]));
    });
  }

  // тема (день/ночь) и пользовательские настройки отображения
  CN.theme.init();
  if (CN.applyPrefs) CN.applyPrefs();
  if (CN.mascot) CN.mascot.init();           // питомец-компаньон 🐼

  // повышение уровня — лепестки + тост-поздравление
  document.addEventListener('cn:levelup', (e) => {
    if (CN.fx) CN.fx.petals({ count: 30 });
    if (CN.c) CN.c.toast('Новый уровень: ' + (e.detail.level || '') + '! 🎉', 'gold');
  });

  // мягкое появление секций при заходе на экран
  document.addEventListener('cn:rendered', () => {
    if (CN.fx && CN.fx.reduced && CN.fx.reduced()) return;
    const secs = CN.u.$$('#app .view > section, #app .view > .name-card');
    secs.forEach((s, i) => { s.classList.add('reveal'); setTimeout(() => s.classList.add('reveal-in'), 40 + i * 70); });
  });

  // бейдж серии дней в шапке — обновляем после каждой отрисовки
  function refreshStreak() {
    const badge = CN.u.$('#streakBadge');
    if (!badge) return;
    const n = CN.store.get().streak.count;
    badge.innerHTML = '';
    if (n > 0) { badge.hidden = false; badge.append(CN.icon('flame'), String(n)); }
    else badge.hidden = true;
  }
  document.addEventListener('cn:rendered', refreshStreak);
  document.addEventListener('cn:rendered', () => { if (CN.checkSurprise) CN.checkSurprise(); });
  refreshStreak();

  R.start();
})();
