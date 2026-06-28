/* views/pinyin.js — фонетика: тоны + инициали + финали (всё кликабельно и звучит). */
window.CN = window.CN || {};
CN.views = CN.views || {};

CN.views.pinyin = function () {
  const { el } = CN.u, icon = CN.icon;
  const wrap = el('div', { class: 'view view-pinyin' });
  wrap.append(el('button', { class: 'back-link', onclick: () => CN.router.go('#/home') }, [ icon('arrowLeft'), 'к программе' ]));
  wrap.append(el('h1', { class: 'view-h' }, '拼音 · Фонетика'));
  wrap.append(el('p', { class: 'view-lead' }, 'Звук китайского = инициаль + финаль + тон. Нажимай — всё произносится.'));

  // студия тонов (микрофон + сравнение формы тона)
  wrap.append(CN.toneStudio());

  // переход в игру «минимальные пары»
  wrap.append(el('div', { class: 'pin-cta' }, [
    el('button', { class: 'btn btn-gold', onclick: () => CN.router.go('#/minpairs') },
      [ icon('ear'), 'Игра: минимальные пары на слух' ]),
  ]));

  // ── ТОНЫ ──
  wrap.append(el('h2', { class: 'section-h' }, 'Четыре тона + нейтральный'));
  wrap.append(el('div', { class: 'tones-grid' }, CN.tones.map(t =>
    el('div', { class: 'tone-card tone-' + t.contour, onclick: () => CN.audio.speak(t.hanzi) }, [
      el('div', { class: 'tone-num' }, t.num === 5 ? 'лёгкий' : t.num + ' тон'),
      el('div', { class: 'tone-curve' }, toneCurve(t.contour)),
      el('div', { class: 'tone-zi' }, t.hanzi),
      el('div', { class: 'tone-pinyin' }, t.sample),
      el('div', { class: 'tone-ru' }, t.ru),
      el('div', { class: 'tone-desc' }, t.desc),
    ]))));

  // ── ИНИЦИАЛИ ──
  wrap.append(el('h2', { class: 'section-h' }, 'Инициали (声母) — начало слога'));
  wrap.append(el('div', { class: 'pin-grid' }, CN.initials.map(x =>
    el('button', { class: 'pin-cell', onclick: () => CN.audio.speak(x.p + 'a') }, [
      el('span', { class: 'pin-p' }, x.p),
      el('span', { class: 'pin-hint' }, x.hint),
    ]))));

  // ── ФИНАЛИ ──
  wrap.append(el('h2', { class: 'section-h' }, 'Финали (韵母) — гласная часть'));
  wrap.append(el('div', { class: 'pin-grid' }, CN.finals.map(x =>
    el('button', { class: 'pin-cell alt', onclick: () => CN.audio.speak(x.p) }, [
      el('span', { class: 'pin-p' }, x.p),
      el('span', { class: 'pin-hint' }, x.hint),
    ]))));

  // ── ТОН-САНДХИ (изменения тонов) ──
  wrap.append(el('h2', { class: 'section-h' }, 'Изменения тонов (тон-сандхи)'));
  wrap.append(el('p', { class: 'tip' }, 'В живой речи тоны иногда меняются. Нажми на пример — услышишь правильное звучание.'));
  wrap.append(el('div', { class: 'sandhi-grid' }, (CN.toneSandhi || []).map(r =>
    el('div', { class: 'sandhi-card' }, [
      el('div', { class: 'sandhi-rule' }, r.rule),
      el('h3', { class: 'sandhi-title' }, r.title),
      el('p', { class: 'sandhi-explain' }, r.explain),
      el('div', { class: 'sandhi-ex' }, r.examples.map(e =>
        el('button', { class: 'sandhi-item', onclick: () => CN.audio.speak(e.hanzi) }, [
          el('span', { class: 'si-zi' }, e.hanzi),
          el('span', { class: 'si-pin' }, e.pinyin),
          el('span', { class: 'si-ru' }, e.ru),
          CN.icon('speaker'),
        ]))),
    ]))));

  return wrap;

  // маленькая визуализация мелодии тона
  function toneCurve(kind) {
    const map = {
      'flat-high': 'M4,8 L40,8', 'rising': 'M4,30 L40,6',
      'dip': 'M4,12 Q22,38 40,8', 'falling': 'M4,6 L40,30', 'neutral': 'M4,20 L40,20',
    };
    const ns = 'http://www.w3.org/2000/svg';
    const s = document.createElementNS(ns, 'svg');
    s.setAttribute('viewBox', '0 0 44 38'); s.setAttribute('class', 'curve');
    s.innerHTML = `<path d="${map[kind]}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`;
    return s;
  }
};
