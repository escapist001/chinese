/* ============================================================
   views/personalize.js — персонализация (Фаза 6):
   • favorites — «Мои слова» (избранное + заметки/мнемоника)
   • decks     — свои колоды (создать, наполнить, учить)
   • CN.checkSurprise — тёплые сообщения на рубежах
   • CN.applyPrefs    — гибкие настройки (пиньинь, размер иероглифов)
   ============================================================ */
window.CN = window.CN || {};
CN.views = CN.views || {};

/* применяем пользовательские настройки отображения к <html> */
CN.applyPrefs = function () {
  const s = CN.store.settings();
  const r = document.documentElement;
  r.setAttribute('data-pinyin', s.showPinyin === false ? 'off' : 'on');
  r.setAttribute('data-zi', s.hanziSize === 'l' ? 'l' : 'm');
};

/* показать один невиданный достигнутый сюрприз */
CN.checkSurprise = function () {
  if (!CN.surprises) return;
  for (const s of CN.surprises) {
    if (CN.store.surpriseSeen(s.id)) continue;
    let ok = false; try { ok = s.test(); } catch (e) {}
    if (!ok) continue;
    CN.store.markSurprise(s.id);
    showSurprise(s.text);
    break;
  }
};
function showSurprise(text) {
  const { el } = CN.u;
  const overlay = el('div', { class: 'modal-overlay', onclick: (e) => { if (e.target === overlay) overlay.remove(); } }, [
    el('div', { class: 'modal surprise' }, [
      el('div', { class: 'surprise-heart' }, '❤'),
      el('div', { class: 'surprise-zi' }, '加油'),
      el('p', { class: 'surprise-text' }, text),
      el('button', { class: 'btn btn-primary', onclick: () => overlay.remove() }, 'Спасибо ❤'),
    ]),
  ]);
  document.body.append(overlay);
  CN.fx.inkBurst({ count: 22, y: window.innerHeight * 0.4, colors: ['#d23c2c', '#e87a6b', '#c0291a'] });
}

/* ── МОИ СЛОВА (избранное + заметки) ──────────────────── */
CN.views.favorites = function () {
  const { el } = CN.u, icon = CN.icon, c = CN.c;
  const words = CN.allWords.filter(w => CN.store.isFav(w.hanzi));

  const wrap = el('div', { class: 'view view-favorites' });
  wrap.append(CN._back('#/home', 'на главную'), el('h1', { class: 'view-h' }, 'Мои слова'));

  if (!words.length) {
    wrap.append(el('div', { class: 'empty' }, [
      el('div', { class: 'empty-zi' }, '收藏'),
      el('p', {}, 'Здесь будут твои избранные слова. Нажми на звёздочку у любого слова — и оно появится тут. Можно добавить свою заметку или подсказку.'),
      el('button', { class: 'btn btn-primary', onclick: () => CN.router.go('#/search') }, 'К словарю'),
    ]));
    return wrap;
  }

  wrap.append(el('div', { class: 'fav-actions' }, [
    el('button', { class: 'btn btn-primary', onclick: studyCards }, [ icon('cards'), 'Учить карточками' ]),
    el('p', { class: 'tip', style: 'margin:8px 0 0' }, `Слов в избранном: ${words.length}. Добавь к слову свою мнемонику.`),
  ]));

  const list = el('div', { class: 'fav-list' });
  words.forEach(w => {
    const note = el('textarea', { class: 'fav-note', rows: '1', placeholder: 'Заметка или мнемоника…' }, CN.store.getNote(w.hanzi));
    note.value = CN.store.getNote(w.hanzi);
    note.addEventListener('input', () => CN.store.setNote(w.hanzi, note.value));
    list.append(el('div', { class: 'fav-item' }, [ c.wordRow(w), note ]));
  });
  wrap.append(list);
  return wrap;

  function studyCards() {
    const box = el('div', { class: 'cards-grid' }, words.map(w => c.flashcard(w)));
    wrap.innerHTML = '';
    wrap.append(CN._back('#/home', 'на главную'), el('h1', { class: 'view-h' }, 'Мои слова · карточки'),
      el('p', { class: 'tip' }, 'Кликни карточку, чтобы перевернуть.'), box);
  }
};

/* ── КОЛОДЫ ───────────────────────────────────────────── */
CN.views.decks = function () {
  const { el } = CN.u, icon = CN.icon, c = CN.c;
  let current = null;

  const wrap = el('div', { class: 'view view-decks' });
  render();
  return wrap;

  function render() {
    wrap.innerHTML = '';
    wrap.append(CN._back('#/home', 'на главную'));
    if (current) return renderDeck();

    wrap.append(el('h1', { class: 'view-h' }, 'Мои колоды'),
      el('p', { class: 'view-lead' }, 'Собирай свои наборы слов и учи их карточками.'));
    const input = el('input', { class: 'search-input', type: 'text', placeholder: 'Название новой колоды…' });
    const add = el('button', { class: 'btn btn-primary', onclick: () => { const n = input.value.trim(); if (n) { CN.store.addDeck(n); render(); } } }, [ icon('plus'), 'Создать' ]);
    wrap.append(el('div', { class: 'deck-new' }, [ input, add ]));

    const decks = CN.store.decksList();
    if (!decks.length) { wrap.append(el('p', { class: 'tip' }, 'Колод пока нет — создай первую.')); return; }
    wrap.append(el('div', { class: 'deck-list' }, decks.map(d =>
      el('div', { class: 'deck-card' }, [
        el('button', { class: 'deck-open', onclick: () => { current = d.id; render(); } }, [
          el('div', { class: 'deck-name' }, d.name),
          el('div', { class: 'deck-count' }, `${d.words.length} слов`),
        ]),
        el('button', { class: 'icon-btn', 'aria-label': 'Удалить колоду', onclick: () => { if (confirm('Удалить колоду «' + d.name + '»?')) { CN.store.removeDeck(d.id); render(); } } }, icon('trash')),
      ]))));
  }

  function renderDeck() {
    const d = CN.store.decksList().find(x => x.id === current);
    if (!d) { current = null; return render(); }
    wrap.append(el('button', { class: 'back-link', onclick: () => { current = null; render(); } }, [ icon('arrowLeft'), 'все колоды' ]));
    wrap.append(el('h1', { class: 'view-h' }, d.name));
    const words = CN.allWords.filter(w => d.words.includes(w.hanzi));
    wrap.append(el('div', { class: 'deck-tools' }, [
      words.length ? el('button', { class: 'btn btn-primary', onclick: () => studyDeck(words) }, [ icon('cards'), 'Учить карточками' ]) : null,
      el('button', { class: 'btn btn-ghost', onclick: picker }, [ icon('plus'), 'Добавить слова' ]),
    ]));
    if (!words.length) { wrap.append(el('p', { class: 'tip' }, 'В колоде пока нет слов. Нажми «Добавить слова».')); return; }
    wrap.append(el('div', { class: 'words-list' }, words.map(w => c.wordRow(w))));
  }

  function picker() {
    const d = CN.store.decksList().find(x => x.id === current);
    wrap.innerHTML = '';
    wrap.append(el('button', { class: 'back-link', onclick: render }, [ icon('arrowLeft'), 'к колоде' ]),
      el('h1', { class: 'view-h' }, 'Добавить в «' + d.name + '»'));
    const input = el('input', { class: 'search-input', type: 'text', placeholder: 'Поиск слова…' });
    const list = el('div', { class: 'words-list' });
    wrap.append(el('div', { class: 'search-wrap' }, [ icon('search'), input ]), list);
    function run(q) {
      q = q.trim().toLowerCase();
      const res = (!q ? CN.allWords : CN.allWords.filter(w => w.hanzi.includes(q) || w.pinyin.toLowerCase().includes(q) || w.ru.toLowerCase().includes(q))).slice(0, 80);
      list.innerHTML = '';
      res.forEach(w => {
        const has = CN.store.deckHas(current, w.hanzi);
        const btn = el('button', { class: 'icon-btn' + (has ? ' on' : ''), 'aria-label': 'В колоду',
          onclick: () => { CN.store.deckToggle(current, w.hanzi); btn.classList.toggle('on'); } }, icon(CN.store.deckHas(current, w.hanzi) ? 'check' : 'plus'));
        const row = el('div', { class: 'word-row' }, [
          el('div', { class: 'wr-hanzi' }, w.hanzi),
          el('div', { class: 'wr-mid' }, [ el('div', { class: 'wr-pin' }, w.pinyin), el('div', { class: 'wr-ru' }, w.ru) ]),
          el('div', { class: 'wr-actions' }, btn),
        ]);
        list.append(row);
      });
    }
    input.addEventListener('input', () => run(input.value));
    run('');
  }

  function studyDeck(words) {
    wrap.innerHTML = '';
    wrap.append(el('button', { class: 'back-link', onclick: render }, [ icon('arrowLeft'), 'к колоде' ]),
      el('h1', { class: 'view-h' }, 'Карточки'), el('p', { class: 'tip' }, 'Кликни карточку, чтобы перевернуть.'),
      el('div', { class: 'cards-grid' }, words.map(w => c.flashcard(w))));
  }
};
