/* ============================================================
   views/profile.js — профиль и достижения (Фаза 5):
   ранг · календарь активности · графики · стена печатей · сертификат.
   ============================================================ */
window.CN = window.CN || {};
CN.views = CN.views || {};

CN.views.profile = function () {
  const { el } = CN.u, st = CN.store, icon = CN.icon, c = CN.c;
  const data = st.get();
  const lp = st.levelProgress();
  const rank = st.rank();

  const wrap = el('div', { class: 'view view-profile' });
  wrap.append(CN._back('#/home', 'на главную'), el('h1', { class: 'view-h' }, 'Профиль и достижения'));

  // ── ранг ──
  wrap.append(el('section', { class: 'rank-card' }, [
    el('div', { class: 'rank-zi' }, rank.zi),
    el('div', { class: 'rank-info' }, [
      el('div', { class: 'rank-ru' }, rank.ru),
      el('div', { class: 'rank-lvl' }, `Уровень ${lp.lvl} · ${data.xp} XP`),
      el('div', { class: 'bar' }, el('i', { style: `width:${lp.pct}%` })),
      el('div', { class: 'rank-next' }, `До следующего уровня: ${lp.need - lp.cur} XP`),
    ]),
  ]));

  // ── статы-полоска ──
  wrap.append(el('section', { class: 'prof-stats' }, [
    miniStat('book', st.seenCount(), 'слов открыто'),
    miniStat('trophy', st.masteredCount(), 'выучено'),
    miniStat('target', st.accuracy() + '%', 'точность'),
    miniStat('flame', data.streak.count, 'дней подряд'),
  ]));

  // ── график: новые слова за 14 дней ──
  wrap.append(el('h2', { class: 'section-h' }, 'Слова за 14 дней'));
  wrap.append(barsChart());

  // ── календарь активности ──
  wrap.append(el('h2', { class: 'section-h' }, 'Календарь активности'));
  wrap.append(calendar());

  // ── стена печатей ──
  wrap.append(el('h2', { class: 'section-h' }, 'Стена печатей'));
  wrap.append(achievements());

  // ── сертификат ──
  wrap.append(el('h2', { class: 'section-h' }, 'Сертификат'));
  wrap.append(el('div', { class: 'cert-box' }, [
    el('p', { class: 'tip' }, `Красивый именной сертификат уровня «${CN.courseLevel || 'HSK 1'}» — можно скачать картинкой и распечатать.`),
    el('button', { class: 'btn btn-primary', onclick: makeCertificate }, [ icon('seal'), 'Скачать сертификат' ]),
  ]));

  return wrap;

  function miniStat(ic, val, label) {
    return el('div', { class: 'mini-stat' }, [
      el('div', { class: 'ms-ic' }, icon(ic, 22)),
      el('div', { class: 'ms-val' }, String(val)),
      el('div', { class: 'ms-label' }, label),
    ]);
  }

  // даты последних n дней (YYYY-MM-DD)
  function lastDays(n) {
    const out = [], now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      out.push(d.toISOString().slice(0, 10));
    }
    return out;
  }

  function barsChart() {
    const days = lastDays(14);
    const act = data.activity || {};
    const vals = days.map(d => act[d] || 0);
    const max = Math.max(1, ...vals);
    const W = 320, H = 120, pad = 4, bw = (W - pad * 2) / days.length;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'bars');
    svg.setAttribute('preserveAspectRatio', 'none');
    let html = '';
    vals.forEach((v, i) => {
      const h = v ? Math.max(3, (v / max) * (H - 24)) : 2;
      const x = pad + i * bw + 2, y = H - 18 - h;
      html += `<rect x="${x}" y="${y}" width="${bw - 4}" height="${h}" rx="3" class="bar-rect${v ? ' on' : ''}"/>`;
      if (v) html += `<text x="${x + (bw - 4) / 2}" y="${y - 3}" class="bar-val">${v}</text>`;
    });
    svg.innerHTML = html;
    return el('div', { class: 'chart-card' }, svg);
  }

  function calendar() {
    const act = data.activity || {};
    const days = lastDays(84);                  // 12 недель
    const grid = el('div', { class: 'cal-grid' });
    days.forEach(d => {
      const v = act[d] || 0;
      const lvl = v === 0 ? 0 : v <= 2 ? 1 : v <= 5 ? 2 : v <= 9 ? 3 : 4;
      grid.append(el('div', { class: 'cal-cell', 'data-lvl': lvl, title: `${d}: ${v} слов` }));
    });
    return el('div', { class: 'chart-card' }, [
      grid,
      el('div', { class: 'cal-legend' }, [ el('span', {}, 'меньше'),
        ...[0, 1, 2, 3, 4].map(l => el('span', { class: 'cal-cell', 'data-lvl': l })),
        el('span', {}, 'больше') ]),
    ]);
  }

  function achievements() {
    const seen = st.seenCount(), mast = st.masteredCount(), acc = st.accuracy(),
      streak = data.streak.count, lvl = lp.lvl, q = data.quiz.total,
      anyLesson = CN.units.some(u => u.lessons.some(l => st.lessonPct(l) === 100)),
      perfect = !!(data.flags && data.flags.perfect);
    const list = [
      { zi: '初', t: 'Первый шаг', d: 'открыть первое слово', ok: seen >= 1 },
      { zi: '十', t: 'Десятка', d: '10 слов', ok: seen >= 10 },
      { zi: '半', t: 'Полста', d: '50 слов', ok: seen >= 50 },
      { zi: '海', t: 'Море слов', d: '100 слов', ok: seen >= 100 },
      { zi: '课', t: 'Урок пройден', d: 'завершить урок на 100%', ok: anyLesson },
      { zi: '七', t: 'Неделя подряд', d: 'серия 7 дней', ok: streak >= 7 },
      { zi: '通', t: 'Мастер слов', d: 'выучить 20 слов', ok: mast >= 20 },
      { zi: '射', t: 'Меткий', d: 'точность 90%+', ok: acc >= 90 && q >= 20 },
      { zi: '满', t: 'Идеал', d: 'квиз на 100%', ok: perfect },
      { zi: '师', t: 'Уровень 5', d: 'достичь 5 уровня', ok: lvl >= 5 },
    ];
    return el('div', { class: 'seal-wall' }, list.map(a =>
      el('div', { class: 'seal-item' + (a.ok ? ' on' : '') }, [
        el('div', { class: 'seal-mark' }, a.ok ? a.zi : icon('seal', 26)),
        el('div', { class: 'seal-t' }, a.t),
        el('div', { class: 'seal-d' }, a.d),
      ])));
  }

  function makeCertificate() {
    const cv = document.createElement('canvas');
    cv.width = 1000; cv.height = 680;
    const x = cv.getContext('2d');
    // фон-бумага
    x.fillStyle = '#f4f1e9'; x.fillRect(0, 0, 1000, 680);
    x.strokeStyle = '#c0291a'; x.lineWidth = 8; x.strokeRect(28, 28, 944, 624);
    x.strokeStyle = 'rgba(192,41,26,.4)'; x.lineWidth = 2; x.strokeRect(44, 44, 912, 592);
    // водяной знак
    x.fillStyle = 'rgba(192,41,26,.05)'; x.font = '900 360px "Noto Serif SC", serif';
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('学', 500, 360);
    // тексты
    x.fillStyle = '#23211c'; x.textAlign = 'center';
    x.font = '700 30px Spectral, Georgia, serif'; x.fillText('СЕРТИФИКАТ', 500, 130);
    x.fillStyle = '#c0291a'; x.font = '900 92px "Noto Serif SC", serif'; x.fillText('中文', 500, 250);
    x.fillStyle = '#6c655a'; x.font = '22px Manrope, sans-serif'; x.fillText('настоящим подтверждается, что', 500, 330);
    x.fillStyle = '#23211c'; x.font = '700 56px Spectral, Georgia, serif'; x.fillText('Женя', 500, 400);
    x.fillStyle = '#23211c'; x.font = '24px Manrope, sans-serif';
    x.fillText(`проходит курс китайского · уровень ${rank.ru} · ${CN.courseLevel || 'HSK 1'}`, 500, 450);
    x.fillText(`Уровень ${lp.lvl} · ${st.seenCount()} слов · ${st.masteredCount()} выучено`, 500, 488);
    const d = new Date();
    x.fillStyle = '#6c655a'; x.font = '20px Manrope, sans-serif';
    x.fillText(d.toISOString().slice(0, 10).split('-').reverse().join('.'), 500, 560);
    // печать
    x.save(); x.translate(820, 540); x.rotate(-0.12);
    x.strokeStyle = '#c0291a'; x.lineWidth = 5; x.strokeRect(-46, -46, 92, 92);
    x.fillStyle = '#c0291a'; x.font = '900 52px "Noto Serif SC", serif'; x.textBaseline = 'middle';
    x.fillText('学', 0, 4); x.restore();
    x.fillStyle = '#8a7c6e'; x.font = 'italic 18px Spectral, Georgia, serif';
    x.fillText('сделано с ❤ для Жени', 500, 610);

    const a = document.createElement('a');
    a.href = cv.toDataURL('image/png'); a.download = 'sertifikat-chinese.png';
    document.body.append(a); a.click(); a.remove();
    CN.c.toast('Сертификат скачан', 'gold');
  }
};
