/* views/minpairs.js — игра «минимальные пары»: звучит слог, выбери какой.
   Тренирует слух на похожие инициали/финали и тоны. */
window.CN = window.CN || {};
CN.views = CN.views || {};

CN.views.minpairs = function () {
  const { el, sample, shuffle } = CN.u, icon = CN.icon;
  const groups = CN.minimalPairs || [];
  let score = 0, round = 0, first = true;

  const wrap = el('div', { class: 'view view-minpairs' });
  wrap.append(el('button', { class: 'back-link', onclick: () => CN.router.go('#/pinyin') }, [ icon('arrowLeft'), 'к фонетике' ]));
  wrap.append(el('h1', { class: 'view-h' }, 'Минимальные пары'));
  wrap.append(el('p', { class: 'view-lead' }, 'Нажми «Слушать» и выбери, что прозвучало. Тренируем слух на похожие слоги и тоны.'));

  const scoreEl = el('div', { class: 'mp-score' });
  const stage = el('div', { class: 'mp-stage' });
  wrap.append(scoreEl, stage);
  next();

  function next() {
    round++;
    const g = sample(groups);
    const correct = sample(g.options);
    stage.innerHTML = '';
    scoreEl.textContent = `Счёт: ${score} · вопрос ${round}`;
    const opts = el('div', { class: 'mp-options' }, shuffle(g.options).map(o =>
      el('button', { class: 'mp-opt', onclick: (e) => choose(e.currentTarget, o, correct, opts) }, [
        el('span', { class: 'mp-zi' }, o.hanzi),
        el('span', { class: 'mp-pin' }, o.pinyin),
        el('span', { class: 'mp-ru' }, o.ru),
      ])));
    stage.append(
      el('div', { class: 'mp-focus' }, g.focus),
      el('button', { class: 'btn btn-primary mp-play', onclick: () => CN.audio.speak(correct.hanzi) }, [ icon('speaker'), 'Слушать ещё раз' ]),
      opts,
      el('div', { class: 'mp-fb' }),
    );
    if (!first) CN.audio.speak(correct.hanzi);  // на первом вопросе ждём нажатия (автоплей зарезан)
    first = false;
  }

  function choose(btn, o, correct, box) {
    CN.u.$$('.mp-opt', box).forEach(b => b.disabled = true);
    const fb = CN.u.$('.mp-fb', stage);
    if (o.hanzi === correct.hanzi) {
      btn.classList.add('correct'); score++;
      fb.className = 'mp-fb ok'; fb.append(icon('check'), 'Верно!');
    } else {
      btn.classList.add('wrong');
      CN.u.$$('.mp-opt', box).find(b => b.querySelector('.mp-zi').textContent === correct.hanzi)?.classList.add('correct');
      fb.className = 'mp-fb no'; fb.append(icon('close'), CN.u.el('span', {}, `Прозвучало: ${correct.hanzi} (${correct.pinyin})`));
    }
    stage.append(el('button', { class: 'btn btn-ghost mp-next', onclick: next }, [ icon('repeat'), 'Дальше' ]));
  }

  return wrap;
};
