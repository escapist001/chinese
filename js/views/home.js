/* views/home.js — дашборд (опыт, серия, цель дня) + карта курса. */
window.CN = window.CN || {};
CN.views = CN.views || {};

CN.views.home = function () {
  const { el } = CN.u, st = CN.store, c = CN.c, icon = CN.icon;
  const counters = [];   // узлы счётчиков для анимации после монтирования
  const lp = st.levelProgress();
  const goal = st.settings().dailyGoal;
  const today = st.get().learnedToday;
  const todayCount = today.date === CN.u.todayStr() ? today.count : 0;
  const due = st.dueCards().length;

  // найти урок, который стоит продолжить (первый незавершённый по всему курсу)
  let next = null;
  for (const u of CN.units) {
    const l = u.lessons.find(x => st.lessonPct(x) < 100);
    if (l) { next = l; break; }
  }

  const wrap = el('div', { class: 'view view-home' });

  // ── герой: 你好 «рисуется» кистью в клетке 田字格 ──
  const cell1 = el('div', { class: 'zi-grid' }, el('span', { class: 'zi' }, '你'));
  const cell2 = el('div', { class: 'zi-grid' }, el('span', { class: 'zi' }, '好'));
  wrap.append(el('section', { class: 'hero' }, [
    el('div', { class: 'hero-grids' }, [ cell1, cell2 ]),
    el('div', { class: 'hero-kicker' }, [ icon('sparkle'), 'Сделано с любовью для Жени' ]),
    el('h1', { class: 'hero-title' }, [ 'Привет, Женя! Готова ', el('span', {}, 'учить китайский'), '?' ]),
    el('p', { class: 'hero-sub' }, 'Твой личный тренажёр, Женечка. Маленький шаг каждый день — и иероглифы станут родными. 加油！'),
    el('div', { class: 'hero-cta' }, [
      next
        ? el('button', { class: 'btn btn-primary', onclick: () => CN.router.go('#/lesson/' + next.id) },
            [ icon('play'), `Продолжить: ${next.title}` ])
        : el('button', { class: 'btn btn-primary', onclick: () => CN.router.go('#/review') },
            [ icon('repeat'), 'Курс пройден — повторять' ]),
      el('button', { class: 'btn btn-ghost', onclick: () => CN.router.go('#/pinyin') }, '拼 Фонетика'),
      due ? el('button', { class: 'btn btn-gold', onclick: () => CN.router.go('#/review') },
              [ icon('repeat'), `Повторить (${due})` ]) : null,
    ]),
  ]));

  // ── панель статистики ──
  const lvlBar = el('i', { style: 'width:0%' });
  const lvlCard = el('div', { class: 'stat-card' }, [
    el('div', { class: 'stat-top' }, [ el('b', {}, 'Уровень ' + lp.lvl), el('span', {}, `${lp.cur}/${lp.need} XP`) ]),
    el('div', { class: 'bar' }, lvlBar),
  ]);
  const goalCard = el('div', { class: 'stat-card center' }, [
    c.ring(CN.u.clamp(Math.round(todayCount / goal * 100), 0, 100)),
    el('div', { class: 'stat-label' }, `Цель дня · ${todayCount}/${goal} слов`),
  ]);
  const numbers = el('div', { class: 'stat-numbers' }, [
    miniStat('flame', st.get().streak.count, 'дней подряд'),
    miniStat('book', st.seenCount(), 'слов открыто'),
    miniStat('trophy', st.masteredCount(), 'выучено'),
    miniStat('target', st.accuracy(), 'точность', '%'),
  ]);
  wrap.append(el('section', { class: 'stats-grid' }, [ lvlCard, goalCard, numbers ]));

  // ── слово дня (одно и то же в течение дня) ──
  const wod = (function () {
    const d = CN.u.todayStr(); let h = 0;
    for (const ch of d) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return CN.allWords[h % CN.allWords.length];
  })();
  wrap.append(el('section', { class: 'wod-card' }, [
    el('div', { class: 'wod-label' }, [ icon('sparkle', 15), 'Слово дня' ]),
    el('button', { class: 'wod-zi', onclick: () => CN.audio.speak(wod.hanzi) }, wod.hanzi),
    el('div', { class: 'wod-mid' }, [ el('div', { class: 'wod-pin' }, wod.pinyin), el('div', { class: 'wod-ru' }, wod.ru) ]),
    c.speak(wod.hanzi),
  ]));

  // ── хаб тренировок ──
  const mc = st.mistakeWords().length;
  const drills = [
    ['target', 'Квиз', '#/quiz'],
    ['cards', 'Соедини пары', '#/match'],
    ['bolt', 'Блиц 60 сек', '#/blitz'],
    ['book', 'Вставь слово', '#/cloze'],
    ['sparkle', 'Тренажёр тонов', '#/tonegame'],
    ['ear', 'Минимальные пары', '#/minpairs'],
    ['seal', 'Собрать фразы', '#/build'],
    ['speaker', 'Диктант', '#/dictation'],
    ['doc', 'Чтение', '#/read'],
    ['play', 'Аудирование', '#/listening'],
    ['chart', 'Без конца', '#/endless'],
    ['repeat', 'Над ошибками', '#/mistakes'],
    ['star', 'Избранное', '#/favorites'],
    ['cards', 'Мои колоды', '#/decks'],
  ];
  const hub = el('section', { class: 'drill-hub' }, [ el('h2', { class: 'section-h' }, 'Тренировки') ]);
  hub.append(el('div', { class: 'drill-grid' }, drills.map(([ic, label, href]) =>
    el('button', { class: 'drill-card', onclick: () => CN.router.go(href) }, [
      el('div', { class: 'drill-ic' }, icon(ic, 22)),
      el('div', { class: 'drill-label' }, label),
      (href === '#/mistakes' && mc) ? el('span', { class: 'drill-badge' }, String(mc)) : null,
    ]))));
  wrap.append(hub);

  // ── материалы и тесты ──
  const mats = [
    ['target', 'Вводный тест', '#/placement'],
    ['trophy', 'Пробный HSK', '#/hsktest'],
    ['doc', 'Грамматика', '#/grammar'],
    ['seal', 'Радикалы 部首', '#/radicals'],
    ['chart', 'Таблица пиньиня', '#/pinyintable'],
    ['book', 'Счётные слова', '#/measure'],
  ];
  const matSec = el('section', { class: 'drill-hub' }, [ el('h2', { class: 'section-h' }, 'Материалы и тесты') ]);
  matSec.append(el('div', { class: 'drill-grid' }, mats.map(([ic, label, href]) =>
    el('button', { class: 'drill-card', onclick: () => CN.router.go(href) }, [
      el('div', { class: 'drill-ic' }, icon(ic, 22)),
      el('div', { class: 'drill-label' }, label),
    ]))));
  wrap.append(matSec);

  // ── карта курса: юниты и уроки ──
  const map = el('section', { class: 'course-map' }, [
    el('h2', { class: 'section-h' }, [ 'Программа курса', el('span', { class: 'hsk-badge' }, CN.courseLevel || 'HSK 1') ]),
  ]);
  CN.units.forEach((u, ui) => {
    const upct = st.unitPct(u);
    const lessons = el('div', { class: 'lessons-row' },
      u.lessons.map(l => {
        const pct = st.lessonPct(l);
        return el('button', { class: 'lesson-chip' + (pct === 100 ? ' done' : ''),
          onclick: () => CN.router.go('#/lesson/' + l.id) }, [
          el('span', { class: 'lc-emoji' }, l.emoji),
          el('span', { class: 'lc-name' }, l.title),
          el('span', { class: 'lc-bar' }, el('i', { style: `width:${pct}%` })),
        ]);
      }));
    map.append(el('div', { class: 'unit-block' }, [
      el('div', { class: 'unit-head' }, [
        el('div', { class: 'unit-no' }, String(ui + 1).padStart(2, '0')),
        el('div', { class: 'unit-title' }, [ el('span', { class: 'unit-emoji' }, u.emoji), `${u.title}` ]),
        el('div', { class: 'unit-sub' }, u.subtitle),
        el('div', { class: 'unit-pct' }, upct + '%'),
      ]),
      lessons,
      el('button', { class: 'unit-check', onclick: () => CN.router.go('#/quiz/unit:' + u.id) },
        [ icon('target', 16), 'Контрольная по юниту' ]),
    ]));
  });
  wrap.append(map);

  // ── анимации после монтирования ──
  function miniStat(ic, val, label, suffix) {
    const v = el('div', { class: 'ms-val' }, '0' + (suffix || ''));
    counters.push({ node: v, to: val, suffix: suffix || '' });
    return el('div', { class: 'mini-stat' }, [
      el('div', { class: 'ms-ic' }, icon(ic, 22)),
      v,
      el('div', { class: 'ms-label' }, label),
    ]);
  }
  requestAnimationFrame(() => {
    CN.fx.brushWrite(cell1, '你');
    setTimeout(() => CN.fx.brushWrite(cell2, '好'), 380);
    lvlBar.style.width = lp.pct + '%';
    counters.forEach(c => CN.fx.countUp(c.node, c.to, { suffix: c.suffix }));
  });

  return wrap;
};
