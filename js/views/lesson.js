/* views/lesson.js — экран урока с вкладками: Слова · Карточки · Примеры · Грамматика. */
window.CN = window.CN || {};
CN.views = CN.views || {};

function cnFindLesson(id) {
  for (const u of CN.units) { const l = u.lessons.find(x => x.id === id); if (l) return { unit: u, lesson: l }; }
  return null;
}

CN.views.lesson = function ({ id }) {
  const { el } = CN.u, c = CN.c, st = CN.store, icon = CN.icon;
  const found = cnFindLesson(id);
  if (!found) return el('div', { class: 'view' }, 'Урок не найден');
  const { unit, lesson } = found;

  const wrap = el('div', { class: 'view view-lesson' });
  wrap.append(el('button', { class: 'back-link', onclick: () => CN.router.go('#/home') }, [ icon('arrowLeft'), 'к программе' ]));
  wrap.append(el('div', { class: 'lesson-head' }, [
    el('div', { class: 'lh-emoji' }, lesson.emoji),
    el('div', {}, [
      el('div', { class: 'lh-unit' }, unit.title),
      el('h1', { class: 'lh-title' }, lesson.title),
      el('p', { class: 'lh-intro' }, lesson.intro),
    ]),
  ]));

  // ── цели урока (что ты сможешь) ──
  const pct0 = st.lessonPct(lesson);
  wrap.append(el('div', { class: 'lesson-goals' + (pct0 === 100 ? ' done' : '') }, [
    el('div', { class: 'lg-title' }, [ icon('target'), 'После урока ты сможешь' ]),
    el('ul', { class: 'lg-list' }, [
      el('li', {}, `узнавать и произносить ${lesson.words.length} новых слов по теме «${lesson.title}»`),
      lesson.grammar ? el('li', {}, `применять правило: ${lesson.grammar.title}`) : null,
      el('li', {}, 'писать ключевые иероглифы и составлять простые фразы'),
    ]),
    pct0 === 100 ? el('div', { class: 'lg-done' }, [ icon('check'), 'Урок пройден' ]) : null,
  ]));

  // вкладки
  const tabs = ['Слова', 'Карточки', 'Письмо', 'Примеры', 'Грамматика'];
  const tabBar = el('div', { class: 'tabbar' });
  const body = el('div', { class: 'tab-body' });
  tabs.forEach((t, i) => {
    const b = el('button', { class: 'tab' + (i === 0 ? ' on' : ''), onclick: () => select(i) }, t);
    tabBar.append(b);
  });
  wrap.append(tabBar, body);

  function select(i) {
    CN.u.$$('.tab', tabBar).forEach((b, j) => b.classList.toggle('on', i === j));
    body.innerHTML = '';
    body.append([renderWords, renderCards, renderWrite, renderSentences, renderGrammar][i]());
  }

  function renderWords() {
    const box = el('div', { class: 'words-list' }, lesson.words.map(c.wordRow));
    return el('div', {}, [ tip('Нажми на слово — услышишь; кнопка с кистью покажет порядок черт.'), box ]);
  }

  function renderCards() {
    const grid = el('div', { class: 'cards-grid' }, lesson.words.map(w => c.flashcard(w)));
    return el('div', {}, [ tip('Кликни карточку, чтобы перевернуть. Открытые слова идут в твой прогресс.'), grid ]);
  }

  function renderSentences() {
    const list = el('div', { class: 'sent-list' }, lesson.sentences.map(s =>
      el('div', { class: 'sent', onclick: () => CN.audio.speak(s.hanzi.replace(/[—\-]/g, ' ')) }, [
        el('div', { class: 'sent-hanzi' }, s.hanzi),
        el('div', { class: 'sent-pin' }, s.pinyin),
        el('div', { class: 'sent-ru' }, s.ru),
        c.speak(s.hanzi.replace(/[—\-]/g, ' ')),
      ])));
    return el('div', {}, [ tip('Примеры с этими словами — нажми, чтобы прослушать.'), list ]);
  }

  function renderWrite() {
    // уникальные одиночные иероглифы из слов урока
    const chars = [];
    lesson.words.forEach(w => [...w.hanzi].forEach(ch => {
      if (/[一-鿿]/.test(ch) && !chars.includes(ch)) chars.push(ch);
    }));
    const grid = el('div', { class: 'write-grid' });
    const inits = [];
    chars.forEach(ch => {
      const target = el('div', { class: 'zi-grid write-box' });
      const status = el('div', { class: 'write-status' }, 'обведи иероглиф');
      const hintBtn = el('button', { class: 'icon-btn', 'aria-label': 'Подсказать', disabled: true }, icon('brush'));
      const againBtn = el('button', { class: 'icon-btn', 'aria-label': 'Заново', disabled: true }, icon('repeat'));
      const card = el('div', { class: 'write-card' }, [
        target, status,
        el('div', { class: 'write-actions' }, [
          hintBtn, againBtn,
          el('button', { class: 'icon-btn', 'aria-label': 'Послушать', onclick: () => CN.audio.speak(ch) }, icon('speaker')),
        ]),
      ]);
      grid.append(card);
      inits.push({ ch, target, status, hintBtn, againBtn });
    });

    requestAnimationFrame(() => {
      if (!window.HanziWriter) { return; }
      const cs = getComputedStyle(document.documentElement);
      const outline = cs.getPropertyValue('--line-strong').trim() || '#bbb';
      const draw = cs.getPropertyValue('--vermilion').trim() || '#d23c2c';
      inits.forEach(it => {
        const size = it.target.clientWidth || 150;
        let writer;
        try {
          writer = HanziWriter.create(it.target, it.ch, {
            width: size, height: size, padding: Math.round(size * 0.08),
            showCharacter: false, showOutline: true, showHintAfterMisses: 3,
            strokeColor: draw, outlineColor: outline, drawingColor: draw,
            onLoadCharDataError: () => { it.status.textContent = 'нет данных для этого иероглифа'; },
          });
        } catch (e) { it.status.textContent = 'письмо недоступно'; return; }
        const startQuiz = () => writer.quiz({
          leniency: 1.2,
          onComplete: () => {
            it.status.textContent = 'готово ✓';
            it.status.className = 'write-status done';
            CN.store.markSeen(it.ch);
            CN.fx.inkBurst({ count: 12, y: window.innerHeight * 0.45 });
          },
        });
        it.hintBtn.disabled = false; it.againBtn.disabled = false;
        it.hintBtn.addEventListener('click', () => { writer.animateCharacter({ onComplete: startQuiz }); });
        it.againBtn.addEventListener('click', () => { it.status.textContent = 'обведи иероглиф'; it.status.className = 'write-status'; startQuiz(); });
        startQuiz();
      });
    });

    return el('div', {}, [ tip('Обведи каждый иероглиф по чертам пальцем или мышкой. Кисть — подсказать, ↻ — заново.'), grid ]);
  }

  function renderGrammar() {
    const g = lesson.grammar;
    return el('div', { class: 'grammar' }, [
      el('div', { class: 'grammar-card' }, [
        el('div', { class: 'g-badge' }, '语法 · грамматика'),
        el('h3', {}, g.title),
        el('p', {}, g.body),
      ]),
    ]);
  }

  // нижняя панель: квиз по уроку
  wrap.append(el('div', { class: 'lesson-foot' }, [
    el('button', { class: 'btn btn-primary',
      onclick: () => CN.router.go('#/quiz/' + lesson.id) }, [ icon('target'), 'Пройти квиз по уроку' ]),
    (lesson.sentences && lesson.sentences.length)
      ? el('button', { class: 'btn btn-gold', onclick: () => CN.router.go('#/build/' + lesson.id) }, [ icon('sparkle'), 'Собрать предложения' ])
      : null,
    el('button', { class: 'btn btn-ghost', onclick: markLearned }, [ icon('check'), 'Отметить урок выученным' ]),
  ]));

  // отметить весь урок выученным: печать-награда + переход
  function markLearned() {
    const fresh = lesson.words.filter(w => !CN.store.get().seen[w.hanzi]).length;
    lesson.words.forEach(w => CN.store.markSeen(w.hanzi));
    const overlay = el('div', { class: 'modal-overlay' }, [
      el('div', { class: 'modal' }, [
        el('div', { class: 'seal-stamp seal-pop' }, '学'),
        el('h3', { class: 'modal-title', style: 'margin-top:16px' }, 'Урок пройден!'),
        el('p', { class: 'tip', style: 'margin:0' }, `Открыто новых слов: ${fresh}. 加油！`),
        el('div', { class: 'modal-actions' }, [
          el('button', { class: 'btn btn-primary', onclick: () => CN.router.go('#/home') }, 'К программе'),
        ]),
      ]),
    ]);
    document.body.append(overlay);
    CN.fx.inkBurst({ count: 28, y: window.innerHeight * 0.4 });
  }

  select(0);
  return wrap;

  function tip(t) { return el('p', { class: 'tip' }, t); }
};
