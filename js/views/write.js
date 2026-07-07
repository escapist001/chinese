/* ============================================================
   views/write.js — «Пропись 书法»: интерактивное письмо иероглифов.
   Пользователь сам обводит знак пальцем/мышью в клетке 田字格,
   Hanzi Writer проверяет каждую черту, подсказывает после ошибок,
   а за чистую пропись — чернильные брызги и лепестки.
   Данные — уникальные иероглифы курса (CN.allWords). CDN: hanzi-writer.
   ============================================================ */
window.CN = window.CN || {};
CN.views = CN.views || {};

CN.views.write = function (params) {
  const { el } = CN.u, icon = CN.icon, c = CN.c;

  // ── собрать уникальные одиночные иероглифы курса (+ слово-контекст) ──
  const isHan = (ch) => /[一-鿿]/.test(ch);
  const seen = new Set(), chars = [];
  (CN.allWords || []).forEach(w => {
    for (const ch of w.hanzi) {
      if (isHan(ch) && !seen.has(ch)) { seen.add(ch); chars.push({ ch, word: w }); }
    }
  });

  let idx = 0;
  if (params && params.char) {
    const p = chars.findIndex(x => x.ch === params.char);
    if (p >= 0) idx = p;
  }

  const wrap = el('div', { class: 'view view-write' });
  wrap.append(el('button', { class: 'back-link', onclick: () => CN.router.go('#/home') }, [ icon('arrowLeft'), 'на главную' ]));
  wrap.append(el('h1', { class: 'view-h' }, [ 'Пропись ', el('span', { class: 'wr-zi-h' }, '书法') ]));
  wrap.append(el('p', { class: 'view-lead' }, 'Напиши иероглиф сам — веди пальцем или мышью по клетке. Каждая черта проверяется, а после пары ошибок появится подсказка. Порядок черт — половина успеха в китайском.'));

  if (!chars.length) { wrap.append(el('p', { class: 'tip' }, 'Нет иероглифов для прописи.')); return wrap; }

  // ── табло: сколько сделано / индикатор ошибок текущего знака ──
  const counter = el('span', { class: 'wr-counter' });
  const scoreEl = el('span', { class: 'wr-score' });
  const progressBar = el('i', { style: 'width:0%' });
  const doneSet = new Set();

  // ── клетка для письма (田字格 фоном) ──
  const cell = el('div', { class: 'write-cell zi-grid', id: 'writeTarget' });
  const pinEl = el('div', { class: 'wr-pin' });
  const ruEl = el('div', { class: 'wr-ru' });
  const ctxEl = el('div', { class: 'wr-ctx' });

  const board = el('section', { class: 'write-board' }, [
    el('div', { class: 'wr-stage' }, [
      cell,
      el('div', { class: 'wr-meta' }, [ pinEl, ruEl, ctxEl ]),
    ]),
    el('div', { class: 'wr-side' }, [
      el('div', { class: 'wr-top' }, [ counter, scoreEl ]),
      el('div', { class: 'bar wr-bar' }, progressBar),
      el('div', { class: 'wr-controls' }, [
        el('button', { class: 'btn btn-primary wr-again', onclick: () => restart() }, [ icon('repeat'), 'Заново' ]),
        el('button', { class: 'btn btn-ghost', onclick: () => demo() }, [ icon('play'), 'Показать образец' ]),
        el('button', { class: 'btn btn-ghost', onclick: () => hint() }, [ icon('sparkle'), 'Подсказать черту' ]),
        el('button', { class: 'icon-btn', 'aria-label': 'Послушать', onclick: () => CN.audio.speak(chars[idx].ch) }, icon('speaker')),
      ]),
      el('div', { class: 'wr-nav' }, [
        el('button', { class: 'btn btn-ghost btn-sm', onclick: () => load(idx - 1) }, [ icon('arrowLeft'), 'Назад' ]),
        el('button', { class: 'btn btn-gold btn-sm wr-next', onclick: () => load(idx + 1) }, [ 'Дальше', icon('repeat') ]),
      ]),
    ]),
  ]);
  wrap.append(board);

  // ── лента выбора иероглифов ──
  const strip = el('div', { class: 'wr-strip' });
  chars.forEach((x, i) => {
    strip.append(el('button', { class: 'wr-chip', 'data-i': String(i), title: x.word.ru,
      onclick: () => load(i) }, x.ch));
  });
  wrap.append(el('section', {}, [ el('h2', { class: 'section-h' }, 'Все иероглифы курса'), strip ]));

  // ── движок ──
  let writer = null, mistakes = 0, completed = false;

  function sizeFor() {
    const w = cell.clientWidth || 300;
    return Math.max(180, Math.min(320, Math.round(w)));
  }

  function setMeta() {
    const cur = chars[idx];
    pinEl.textContent = cur.word.pinyin;
    ruEl.textContent = cur.word.ru;
    ctxEl.innerHTML = '';
    ctxEl.append('в слове ', el('b', {}, cur.word.hanzi));
    counter.textContent = `${idx + 1} / ${chars.length}`;
    scoreEl.innerHTML = '';
    scoreEl.append(icon('check', 15), `освоено: ${doneSet.size}`);
    progressBar.style.width = Math.round(doneSet.size / chars.length * 100) + '%';
    CN.u.$$('.wr-chip', strip).forEach(ch => {
      const i = +ch.dataset.i;
      ch.classList.toggle('cur', i === idx);
      ch.classList.toggle('done', doneSet.has(chars[i].ch));
    });
    const active = CN.u.$('.wr-chip.cur', strip);
    if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: CN.fx.reduced() ? 'auto' : 'smooth' });
  }

  function load(i) {
    idx = (i % chars.length + chars.length) % chars.length;
    completed = false; mistakes = 0;
    setMeta();
    cell.innerHTML = '';
    const cur = chars[idx];
    const cs = getComputedStyle(document.documentElement);
    const stroke = cs.getPropertyValue('--vermilion').trim() || '#d23c2c';
    const radical = cs.getPropertyValue('--celadon').trim() || '#2c7d6b';
    const outline = cs.getPropertyValue('--line-strong').trim() || 'rgba(0,0,0,.2)';

    if (!window.HanziWriter) { fallback('Загрузка модуля прописи…'); return; }
    const size = sizeFor();
    writer = HanziWriter.create(cell, cur.ch, {
      width: size, height: size, padding: Math.round(size * 0.06),
      showCharacter: false, showOutline: true,
      strokeColor: stroke, radicalColor: radical, outlineColor: outline,
      drawingColor: stroke, drawingWidth: 26, strokeAnimationSpeed: 1.2, delayBetweenStrokes: 120,
      onLoadCharDataError: () => fallback('Нет соединения — пропись загружается из интернета. Подключись и попробуй снова.'),
    });
    startQuiz();
  }

  function startQuiz() {
    if (!writer) return;
    mistakes = 0; completed = false;
    writer.quiz({
      showHintAfterMisses: 3,
      onMistake: () => { mistakes++; },
      onComplete: (s) => complete(s ? s.totalMistakes : mistakes),
    });
  }

  function complete(totalMistakes) {
    if (completed) return; completed = true;
    const cur = chars[idx];
    doneSet.add(cur.ch);
    setMeta();
    const r = cell.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (totalMistakes === 0) {
      CN.fx.inkBurst({ count: 22, x: cx, y: cy });
      CN.fx.petals({ count: 16, dur: 2400 });
      c.toast('Идеально! ' + cur.ch + ' — без ошибок 🎉', 'gold');
    } else {
      CN.fx.inkBurst({ count: 12, x: cx, y: cy, colors: ['#d23c2c', '#e8b04b'] });
      c.toast('Готово: ' + cur.ch + ' — ' + cur.word.ru);
    }
    const next = CN.u.$('.wr-next', board);
    if (next) { next.classList.add('pulse'); setTimeout(() => next.classList.remove('pulse'), 1600); }
  }

  function restart() { if (writer) { cell.innerHTML = ''; load(idx); } }
  function demo() {
    if (!writer) return;
    writer.hideCharacter();
    writer.animateCharacter({ onComplete: () => startQuiz() });
  }
  function hint() {
    // мигнём образцом на секунду — как «подсмотреть» следующий шаг
    if (!writer) return;
    writer.showOutline();
    writer.animateCharacter({ onComplete: () => startQuiz() });
  }
  function fallback(msg) {
    cell.innerHTML = '';
    cell.append(
      el('div', { class: 'wr-fallback zi' }, chars[idx].ch),
      el('div', { class: 'wr-fallback-msg' }, msg || '')
    );
  }

  // старт после монтирования (нужен реальный размер клетки)
  requestAnimationFrame(() => load(idx));
  return wrap;
};
