/* ============================================================
   views/etymology.js — «Происхождение иероглифов» 🀄.
   Картинка-emoji плавно перетекает в иероглиф (CN.fx.morphHanzi),
   рядом — пиньинь, перевод, короткая история и озвучка.
   Данные: CN.etymology (js/data/reference.js).
   ============================================================ */
window.CN = window.CN || {};
CN.views = CN.views || {};

CN.views.etymology = function () {
  const { el } = CN.u, icon = CN.icon;
  const wrap = el('div', { class: 'view view-etym' });
  wrap.append(el('button', { class: 'back-link', onclick: () => CN.router.go('#/home') }, [ icon('arrowLeft'), 'на главную' ]));
  wrap.append(el('h1', { class: 'view-h' }, 'Откуда взялись иероглифы 🀄'));
  wrap.append(el('p', { class: 'view-lead' }, 'Многие иероглифы — это бывшие картинки. Нажми на любой, чтобы увидеть, как рисунок превратился в знак.'));

  const data = CN.etymology || [];
  const grid = el('div', { class: 'etym-grid' });

  data.forEach((item, i) => {
    const box = el('div', { class: 'etym-box', role: 'button', tabindex: '0', 'aria-label': 'Показать происхождение ' + item.hanzi });
    const play = () => { CN.fx.morphHanzi(box, item); CN.audio.speak(item.hanzi); };
    box.addEventListener('click', play);
    box.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });

    const card = el('div', { class: 'etym-card' }, [
      box,
      el('div', { class: 'etym-info' }, [
        el('div', { class: 'etym-head' }, [
          el('b', { class: 'etym-pin' }, item.pinyin),
          el('span', { class: 'etym-ru' }, item.ru),
          el('button', { class: 'icon-btn', 'aria-label': 'Послушать', onclick: (e) => { e.stopPropagation(); CN.audio.speak(item.hanzi); } }, icon('speaker')),
        ]),
        el('p', { class: 'etym-story' }, item.story),
        el('button', { class: 'btn btn-ghost btn-sm', onclick: play }, [ icon('repeat'), 'Показать снова' ]),
      ]),
    ]);
    grid.append(card);

    // первичная отрисовка статична; лёгкий авто-морф по очереди при заходе
    CN.fx.morphHanzi(box, item);
    if (!CN.fx.reduced()) setTimeout(() => CN.fx.morphHanzi(box, item), 400 + i * 260);
  });

  wrap.append(grid);
  return wrap;
};
