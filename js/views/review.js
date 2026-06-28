/* views/review.js — умное повторение (SRS): карточки, которым «пора». */
window.CN = window.CN || {};
CN.views = CN.views || {};

CN.views.review = function () {
  const { el } = CN.u, st = CN.store, icon = CN.icon;
  const dueHanzi = st.dueCards();
  const queue = CN.allWords.filter(w => dueHanzi.includes(w.hanzi));

  const wrap = el('div', { class: 'view view-review' });
  wrap.append(el('button', { class: 'back-link', onclick: () => CN.router.go('#/home') }, [ icon('arrowLeft'), 'к программе' ]));
  wrap.append(el('h1', { class: 'view-h' }, 'Повторение'));

  if (!queue.length) {
    wrap.append(el('div', { class: 'empty' }, [
      el('div', { class: 'empty-zi' }, '休息'),
      el('p', {}, 'На сегодня всё повторено. Открывай новые слова в уроках — и они вернутся сюда по расписанию.'),
      el('button', { class: 'btn btn-primary', onclick: () => CN.router.go('#/home') }, 'К урокам'),
    ]));
    return wrap;
  }

  let i = 0, know = 0;
  wrap.append(el('p', { class: 'view-lead' }, `Слов к повторению: ${queue.length}. Вспомни перевод, переверни и оцени себя честно.`));
  const stage = el('div', { class: 'review-stage' });
  wrap.append(stage);
  renderCard();

  function renderCard() {
    if (i >= queue.length) return done();
    const w = queue[i];
    stage.innerHTML = '';
    const card = CN.c.flashcard(w);
    const rate = el('div', { class: 'rate-row' }, [
      el('button', { class: 'btn btn-danger', onclick: () => grade(false) }, [ icon('close'), 'Не помню' ]),
      el('button', { class: 'btn btn-gold', onclick: () => grade(true) }, [ icon('check'), 'Помню' ]),
    ]);
    stage.append(
      el('div', { class: 'review-count' }, `${i + 1} / ${queue.length}`),
      card, rate,
    );
    function grade(ok) { CN.store.srsAnswer(w.hanzi, ok); if (ok) know++; i++; renderCard(); }
  }

  function done() {
    stage.innerHTML = '';
    stage.append(el('div', { class: 'q-result' }, [
      el('div', { class: 'q-score' }, `${know}/${queue.length}`),
      el('div', { class: 'q-msg' }, 'Повторение завершено!'),
      el('button', { class: 'btn btn-primary', onclick: () => CN.router.go('#/home') }, 'На главную'),
    ]));
  }
  return wrap;
};
