/* ============================================================
   views/garden.js — «Сад знаний» 🌳.
   Живой прогресс: дерево растёт с уровнем, цветёт по выученным
   словам (1 цветок = 1 закреплённое слово), листья — открытые слова.
   Всё рисуется SVG, раскладка детерминированная (стабильна между
   перерисовками). На главной — компактный предпросмотр.
   ============================================================ */
window.CN = window.CN || {};
CN.views = CN.views || {};

CN.garden = (function () {
  const TAU = Math.PI * 2;

  // строим SVG-сад. opts.mini — компактный предпросмотр (без подписей)
  function svg(opts) {
    opts = opts || {};
    const st = CN.store;
    const seen = st.seenCount();
    const mastered = st.masteredCount();
    const level = st.level();
    const W = 400, H = 360, groundY = 322, cx = 200;

    const parts = [];
    // небо/земля
    parts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="none"/>`);
    parts.push(`<path d="M0 ${groundY} Q${cx} ${groundY - 16} ${W} ${groundY} L${W} ${H} L0 ${H} Z" class="g-soil"/>`);
    parts.push(`<ellipse cx="${cx}" cy="${groundY + 6}" rx="120" ry="14" class="g-grass"/>`);
    // солнце/луна
    parts.push(`<circle cx="334" cy="58" r="22" class="g-sun"/>`);

    if (seen === 0) {
      // семечко в земле
      parts.push(`<ellipse cx="${cx}" cy="${groundY - 6}" rx="7" ry="9" class="g-seed"/>`);
      parts.push(`<path d="M${cx} ${groundY - 12} q6 -10 14 -10" class="g-sprout"/>`);
      return wrapSvg(W, H, parts.join(''));
    }

    // ствол: высота растёт с уровнем и числом слов
    const treeH = clamp(70 + level * 20 + Math.min(seen, 45) * 1.8, 70, 232);
    const topY = groundY - treeH;
    const trunkW = clamp(10 + level * 1.2, 10, 22);
    parts.push(`<path d="M${cx - trunkW / 2} ${groundY} C${cx - trunkW / 2 - 4} ${groundY - treeH * 0.5} ${cx - 3} ${topY + 30} ${cx - 2} ${topY + 14}
      L${cx + 2} ${topY + 14} C${cx + 3} ${topY + 30} ${cx + trunkW / 2 + 4} ${groundY - treeH * 0.5} ${cx + trunkW / 2} ${groundY} Z" class="g-trunk"/>`);
    // пара веток
    parts.push(`<path d="M${cx} ${topY + 70} q-34 -8 -52 -34" class="g-branch"/>`);
    parts.push(`<path d="M${cx} ${topY + 96} q36 -6 56 -30" class="g-branch"/>`);

    // крона: несколько кругов зелени, размер от числа слов
    const cR = clamp(58 + Math.sqrt(seen) * 9, 58, 120);
    const canopyY = topY + 6;
    const blobs = [[0, 0, cR], [-cR * 0.62, cR * 0.22, cR * 0.72], [cR * 0.62, cR * 0.2, cR * 0.72], [0, -cR * 0.5, cR * 0.7]];
    blobs.forEach(([dx, dy, r]) => parts.push(`<circle cx="${cx + dx}" cy="${canopyY + dy}" r="${r}" class="g-leaf"/>`));

    // цветы: 1 на закреплённое слово, золотой-угол раскладка внутри кроны
    const flowers = Math.min(mastered, 90);
    const fr = cR * 0.92;
    for (let i = 0; i < flowers; i++) {
      const a = i * 2.399963;                       // золотой угол
      const rad = fr * Math.sqrt((i + 0.5) / Math.max(flowers, 1));
      const fx = cx + Math.cos(a) * rad;
      const fy = canopyY - cR * 0.16 + Math.sin(a) * rad * 0.82;
      parts.push(flower(fx, fy, i));
    }

    // если выученного нет — намёк на бутоны
    if (mastered === 0) parts.push(`<circle cx="${cx}" cy="${canopyY}" r="4" class="g-bud"/>`);

    // бабочка как награда за серию
    if (st.get().streak.count >= 3) parts.push(butterfly(cx + cR * 0.8, canopyY - cR * 0.5));

    return wrapSvg(W, H, parts.join(''));
  }

  function flower(x, y, i) {
    const hue = i % 3;                              // чередуем оттенки лепестков
    const cls = hue === 0 ? 'g-petal' : hue === 1 ? 'g-petal alt' : 'g-petal alt2';
    // ВНЕШНЯЯ группа — позиция (SVG transform), ВНУТРЕННЯЯ — анимация scale (CSS).
    // Иначе CSS-transform анимации перетёр бы translate и цветы улетели бы в (0,0).
    let s = `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g class="g-flower">`;
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * TAU;
      s += `<ellipse class="${cls}" cx="${(Math.cos(a) * 3.4).toFixed(1)}" cy="${(Math.sin(a) * 3.4).toFixed(1)}" rx="2.6" ry="1.7" transform="rotate(${(a * 180 / Math.PI).toFixed(0)} ${(Math.cos(a) * 3.4).toFixed(1)} ${(Math.sin(a) * 3.4).toFixed(1)})"/>`;
    }
    s += `<circle class="g-core" cx="0" cy="0" r="1.7"/></g></g>`;
    return s;
  }

  function butterfly(x, y) {
    return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><g class="g-butterfly">
      <ellipse class="g-wing" cx="-4" cy="0" rx="4" ry="6"/>
      <ellipse class="g-wing" cx="4" cy="0" rx="4" ry="6"/>
      <line x1="0" y1="-5" x2="0" y2="5" class="g-body"/></g></g>`;
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function wrapSvg(W, H, inner) {
    return `<svg viewBox="0 0 ${W} ${H}" class="garden-svg" role="img" aria-label="Сад прогресса">${inner}</svg>`;
  }

  // полноэкранный вид
  function view() {
    const { el } = CN.u, st = CN.store, icon = CN.icon;
    const wrap = el('div', { class: 'view view-garden' });
    wrap.append(CN.u.el('button', { class: 'back-link', onclick: () => CN.router.go('#/home') }, [ icon('arrowLeft'), 'на главную' ]));
    wrap.append(el('h1', { class: 'view-h' }, 'Твой сад знаний 🌳'));
    wrap.append(el('p', { class: 'view-lead' }, 'Дерево растёт с уровнем, а каждый выученный иероглиф распускается цветком. Занимайся — и сад расцветёт.'));

    const stage = el('div', { class: 'garden-stage' });
    stage.innerHTML = svg();
    wrap.append(stage);

    wrap.append(el('div', { class: 'garden-stats' }, [
      gstat('book', st.seenCount(), 'слов открыто'),
      gstat('star', st.masteredCount(), 'цветов (выучено)'),
      gstat('flame', st.get().streak.count, 'дней подряд'),
    ]));
    wrap.append(el('div', { class: 'garden-cta' }, [
      el('button', { class: 'btn btn-primary', onclick: () => CN.router.go('#/quiz') }, [ icon('target'), 'Вырастить ещё (квиз)' ]),
      el('button', { class: 'btn btn-ghost', onclick: () => CN.router.go('#/review') }, [ icon('repeat'), 'Повторить' ]),
    ]));

    // лёгкие лепестки при заходе, если уже что-то цветёт
    if (st.masteredCount() > 0) requestAnimationFrame(() => CN.fx.petals({ count: 16, dur: 2600 }));
    return wrap;

    function gstat(ic, val, label) {
      return el('div', { class: 'gstat' }, [ el('div', { class: 'gstat-ic' }, icon(ic, 20)), el('b', {}, String(val)), el('span', {}, label) ]);
    }
  }

  return { svg, view };
})();

CN.views.garden = CN.garden.view;
