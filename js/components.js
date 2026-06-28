/* ============================================================
   components.js — переиспользуемые кусочки интерфейса.
   Чтобы экраны (views) были короткими и читаемыми.
   ============================================================ */
window.CN = window.CN || {};
CN.c = (function () {
  const { el } = CN.u;
  const icon = CN.icon;

  // кнопка-динамик: произнести текст
  function speak(text) {
    return el('button', { class: 'icon-btn', 'aria-label': 'Послушать произношение',
      onclick: (e) => { e.stopPropagation(); CN.audio.speak(text); } }, icon('speaker'));
  }

  // маленькое кольцо прогресса (SVG)
  function ring(pct, size = 56) {
    const r = (size - 8) / 2, c = 2 * Math.PI * r;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', size); svg.setAttribute('height', size);
    svg.setAttribute('class', 'ring');
    svg.innerHTML =
      `<circle cx="${size/2}" cy="${size/2}" r="${r}" class="ring-bg"/>
       <circle cx="${size/2}" cy="${size/2}" r="${r}" class="ring-fg"
         stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct/100)}"
         transform="rotate(-90 ${size/2} ${size/2})"/>
       <text x="50%" y="52%" class="ring-txt">${pct}%</text>`;
    return svg;
  }

  // строка слова: иероглиф · пиньинь · перевод + аудио + порядок черт
  function wordRow(w) {
    const row = el('div', { class: 'word-row', onclick: () => { CN.audio.speak(w.hanzi); CN.store.markSeen(w.hanzi); } }, [
      el('div', { class: 'wr-hanzi' }, w.hanzi),
      el('div', { class: 'wr-mid' }, [
        el('div', { class: 'wr-pin' }, w.pinyin),
        el('div', { class: 'wr-ru' }, w.ru),
      ]),
      el('div', { class: 'wr-actions' }, [
        speak(w.hanzi),
        favBtn(w.hanzi),
        el('button', { class: 'icon-btn', 'aria-label': 'Показать порядок черт',
          onclick: (e) => { e.stopPropagation(); strokeModal(w.hanzi); } }, icon('brush')),
        // распознавание речи — только там, где оно поддерживается (не iPhone)
        CN.speech && CN.speech.supported()
          ? el('button', { class: 'icon-btn mic-btn', 'aria-label': 'Сказать и проверить',
              onclick: (e) => { e.stopPropagation(); micCheck(e.currentTarget, w); } }, icon('mic'))
          : null,
      ]),
    ]);
    return row;
  }

  // карточка-перевёртыш (для режима «учу»)
  function flashcard(w) {
    const inner = el('div', { class: 'flip-inner' }, [
      el('div', { class: 'flip-face flip-front' }, [
        el('div', { class: 'zi' }, w.hanzi),
        el('div', { class: 'pin' }, w.pinyin),
        el('div', { class: 'flip-hint' }, 'нажми — перевод'),
      ]),
      el('div', { class: 'flip-face flip-back' }, [
        el('div', { class: 'ru' }, w.ru),
        el('div', { class: 'pin2' }, w.pinyin),
      ]),
    ]);
    const card = el('div', { class: 'flip', tabindex: '0', role: 'button', 'aria-label': 'Карточка ' + w.ru + '. Пробел — перевернуть' }, [
      el('button', { class: 'icon-btn speak-abs', 'aria-label': 'Послушать',
        onclick: (e) => { e.stopPropagation(); CN.audio.speak(w.hanzi); } }, icon('speaker')),
      inner,
    ]);
    const flip = () => { card.classList.toggle('flipped'); CN.store.markSeen(w.hanzi); };
    inner.addEventListener('click', flip);
    card.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } });
    return card;
  }

  // модалка с анимацией порядка черт (Hanzi Writer, грузится с CDN)
  function strokeModal(char) {
    const single = [...char][0]; // берём первый иероглиф
    const cs = getComputedStyle(document.documentElement);
    const stroke = cs.getPropertyValue('--vermilion').trim() || '#d23c2c';
    const radical = cs.getPropertyValue('--celadon').trim() || '#2c7d6b';
    const box = el('div', { class: 'stroke-box', id: 'strokeTarget' });
    const overlay = el('div', { class: 'modal-overlay', onclick: (e) => { if (e.target === overlay) overlay.remove(); } }, [
      el('div', { class: 'modal' }, [
        el('button', { class: 'modal-close', 'aria-label': 'Закрыть', onclick: () => overlay.remove() }, icon('close')),
        el('h3', { class: 'modal-title' }, `Порядок черт: ${single}`),
        box,
        el('div', { class: 'modal-actions' }, [
          el('button', { class: 'btn btn-ghost', id: 'strokeReplay' }, [ icon('repeat'), 'Показать снова' ]),
          el('button', { class: 'icon-btn', 'aria-label': 'Послушать', onclick: () => CN.audio.speak(single) }, icon('speaker')),
        ]),
      ]),
    ]);
    document.body.append(overlay);
    if (window.HanziWriter) {
      const w = HanziWriter.create(box, single, {
        width: 240, height: 240, padding: 8, showOutline: true,
        strokeColor: stroke, radicalColor: radical, delayBetweenStrokes: 240,
      });
      w.animateCharacter();
      CN.u.$('#strokeReplay', overlay).addEventListener('click', () => w.animateCharacter());
    } else {
      box.append(el('div', { class: 'stroke-fallback' }, single));
    }
  }

  // сказать слово и проверить распознаванием речи (где поддерживается)
  function micCheck(btn, w) {
    if (btn.classList.contains('listening')) return;
    btn.classList.add('listening');
    CN.speech.recognize({ lang: 'zh-CN' })
      .then(alts => {
        if (CN.speech.matches(alts, w.hanzi)) toast('Верно: ' + w.hanzi + ' — ' + w.ru, 'gold');
        else toast('Услышали «' + (alts[0] || '…') + '». Цель: ' + w.hanzi);
      })
      .catch(() => toast('Не расслышали — попробуй ещё'))
      .finally(() => btn.classList.remove('listening'));
  }

  // кнопка «в избранное» (звёздочка)
  function favBtn(hanzi) {
    const on = CN.store.isFav(hanzi);
    const b = el('button', { class: 'icon-btn fav-btn' + (on ? ' on' : ''),
      'aria-label': on ? 'Убрать из избранного' : 'В избранное',
      onclick: (e) => { e.stopPropagation(); const now = CN.store.toggleFav(hanzi); b.classList.toggle('on', now);
        if (now) CN.c.toast('Добавлено в избранное', 'gold'); } }, icon('star'));
    return b;
  }

  function pill(text, cls = '') { return el('span', { class: 'pill ' + cls }, text); }

  // всплывающее уведомление (например, +XP)
  function toast(text, kind = '') {
    let wrap = CN.u.$('.toast-wrap');
    if (!wrap) { wrap = el('div', { class: 'toast-wrap' }); document.body.append(wrap); }
    const t = el('div', { class: 'toast ' + kind }, [ icon(kind === 'gold' ? 'seal' : 'sparkle'), text ]);
    wrap.append(t);
    setTimeout(() => { t.style.transition = 'opacity .3s'; t.style.opacity = '0';
      setTimeout(() => t.remove(), 300); }, 2400);
  }

  return { speak, ring, wordRow, flashcard, strokeModal, pill, toast, el, icon };
})();
