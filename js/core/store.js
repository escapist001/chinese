/* ============================================================
   core/store.js — состояние приложения + сохранение в браузере.
   Хранит: настройки, прогресс по словам, систему повторений (SRS),
   опыт (XP), уровень, серию дней (streak), статистику квизов.
   ============================================================ */
window.CN = window.CN || {};

CN.store = (function () {
  const KEY = 'cn_trainer_v2';
  const todayStr = () => new Date().toISOString().slice(0, 10);

  const fresh = () => ({
    settings: { rate: 0.85, dailyGoal: 15, theme: 'light', showPinyin: true, hanziSize: 'm' },
    seen: {},          // { hanzi: true } — слово открывали
    mastered: {},      // { hanzi: true } — выучено (SRS box >= 4)
    srs: {},           // { hanzi: { box: 1..5, due: 'YYYY-MM-DD' } }
    xp: 0,
    streak: { count: 0, last: null },
    quiz: { total: 0, correct: 0 },
    learnedToday: { date: todayStr(), count: 0 },
    mistakes: {},      // { hanzi: число ошибок } — для «работы над ошибками»
    activity: {},      // { 'YYYY-MM-DD': сколько новых слов } — для календаря/графиков
    flags: {},         // достижения-флаги (напр. идеальный квиз) + показанные сюрпризы
    favorites: {},     // { hanzi: true } — избранные слова
    notes: {},         // { hanzi: 'заметка/мнемоника' }
    decks: [],         // [{ id, name, words:[hanzi] }] — свои наборы
  });

  let s;
  try { s = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {}); }
  catch { s = fresh(); }
  // настройки сливаем глубоко: иначе частично сохранённый settings
  // (напр. только тема) затирает дефолтные dailyGoal / rate.
  s.settings = Object.assign({}, fresh().settings, s.settings || {});

  const save = () => localStorage.setItem(KEY, JSON.stringify(s));
  // лёгкая шина событий: маскот/анимации слушают, ядро не зависит от DOM
  const emit = (name, detail) => { try { document.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); } catch (e) {} };

  // интервалы повторения (Лейтнер): box → через сколько дней
  const BOX_DAYS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 16 };

  const api = {
    get: () => s,
    settings: () => s.settings,
    save,

    /* ── опыт и уровень ── */
    level: () => Math.floor(Math.sqrt(s.xp / 50)) + 1,        // мягкая кривая
    levelProgress() {
      const lvl = api.level();
      const cur = 50 * (lvl - 1) ** 2, next = 50 * lvl ** 2;
      return { lvl, cur: s.xp - cur, need: next - cur, pct: Math.round((s.xp - cur) / (next - cur) * 100) };
    },
    addXp(n) {
      const before = api.level();
      s.xp += n; api.touchStreak(); save();
      const after = api.level();
      if (after > before) emit('cn:levelup', { level: after });
    },

    /* ── серия дней ── */
    touchStreak() {
      const t = todayStr();
      if (s.streak.last === t) return;
      const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      s.streak.count = (s.streak.last === yest) ? s.streak.count + 1 : 1;
      s.streak.last = t;
    },

    /* ── слова ── */
    markSeen(hanzi) {
      if (!s.seen[hanzi]) {
        s.seen[hanzi] = true;
        const t = todayStr();
        if (s.learnedToday.date !== t) s.learnedToday = { date: t, count: 0 };
        s.learnedToday.count++;
        if (!s.activity) s.activity = {};
        s.activity[t] = (s.activity[t] || 0) + 1;
        api.addXp(2);
        emit('cn:seen', { hanzi });
      }
      if (!s.srs[hanzi]) s.srs[hanzi] = { box: 1, due: todayStr() };
      save();
    },
    seenCount: () => Object.keys(s.seen).length,
    masteredCount: () => Object.keys(s.mastered).length,

    /* ── SRS: повторения ── */
    srsAnswer(hanzi, ok) {
      const card = s.srs[hanzi] || { box: 1, due: todayStr() };
      card.box = ok ? Math.min(5, card.box + 1) : 1;
      const d = new Date(); d.setDate(d.getDate() + BOX_DAYS[card.box]);
      card.due = d.toISOString().slice(0, 10);
      s.srs[hanzi] = card;
      if (card.box >= 4) s.mastered[hanzi] = true;
      if (!s.mistakes) s.mistakes = {};
      if (ok) { delete s.mistakes[hanzi]; api.addXp(3); }
      else { s.mistakes[hanzi] = (s.mistakes[hanzi] || 0) + 1; }
      save();
      emit('cn:answer', { ok: !!ok, hanzi });
    },
    mistakeWords: () => Object.keys(s.mistakes || {}),
    dueCards() {
      const t = todayStr();
      return Object.entries(s.srs).filter(([, c]) => c.due <= t).map(([h]) => h);
    },

    /* ── квизы ── */
    recordQuiz(correct, total) {
      s.quiz.total += total; s.quiz.correct += correct;
      if (!s.flags) s.flags = {};
      if (total > 0 && correct === total) s.flags.perfect = true;
      api.addXp(correct * 4); save();
    },
    rank() {
      const lvl = api.level();
      const tiers = [
        { min: 12, zi: '师傅', ru: 'Мастер' },
        { min: 8, zi: '高手', ru: 'Знаток' },
        { min: 5, zi: '弟子', ru: 'Ученик-адепт' },
        { min: 3, zi: '学生', ru: 'Студент' },
        { min: 1, zi: '学徒', ru: 'Новичок' },
      ];
      return tiers.find(t => lvl >= t.min) || tiers[tiers.length - 1];
    },
    accuracy: () => s.quiz.total ? Math.round(s.quiz.correct / s.quiz.total * 100) : 0,

    /* ── прогресс по уроку/юниту ── */
    lessonPct(lesson) {
      const w = lesson.words; if (!w.length) return 0;
      const done = w.filter(x => s.seen[x.hanzi]).length;
      return Math.round(done / w.length * 100);
    },
    unitPct(unit) {
      const all = unit.lessons.flatMap(l => l.words);
      const done = all.filter(x => s.seen[x.hanzi]).length;
      return all.length ? Math.round(done / all.length * 100) : 0;
    },

    /* ── избранное / заметки ── */
    toggleFav(h) { if (!s.favorites) s.favorites = {}; if (s.favorites[h]) delete s.favorites[h]; else s.favorites[h] = true; save(); return !!s.favorites[h]; },
    isFav: (h) => !!(s.favorites && s.favorites[h]),
    favWords: () => Object.keys(s.favorites || {}),
    setNote(h, t) { if (!s.notes) s.notes = {}; t = String(t || '').trim(); if (t) s.notes[h] = t; else delete s.notes[h]; save(); },
    getNote: (h) => (s.notes && s.notes[h]) || '',

    /* ── колоды ── */
    decksList: () => (s.decks || (s.decks = [])),
    addDeck(name) { if (!s.decks) s.decks = []; const id = 'd' + Date.now(); s.decks.push({ id, name: name || 'Колода', words: [] }); save(); return id; },
    removeDeck(id) { s.decks = (s.decks || []).filter(d => d.id !== id); save(); },
    renameDeck(id, name) { const d = (s.decks || []).find(x => x.id === id); if (d) { d.name = name; save(); } },
    deckHas: (id, h) => { const d = (s.decks || []).find(x => x.id === id); return !!(d && d.words.includes(h)); },
    deckToggle(id, h) { const d = (s.decks || []).find(x => x.id === id); if (!d) return; const i = d.words.indexOf(h); if (i < 0) d.words.push(h); else d.words.splice(i, 1); save(); },

    /* ── сюрпризы ── */
    surpriseSeen: (id) => !!(s.flags && s.flags['s_' + id]),
    markSurprise(id) { if (!s.flags) s.flags = {}; s.flags['s_' + id] = true; save(); },

    /* ── «раз в день»: печенье с предсказанием и т.п. ── */
    todayStr,
    flagDate: (k) => (s.flags && s.flags['d_' + k]) || null,
    setFlagDate(k) { if (!s.flags) s.flags = {}; s.flags['d_' + k] = todayStr(); save(); },
    isDoneToday: (k) => !!(s.flags && s.flags['d_' + k] === todayStr()),

    setSetting(k, v) { s.settings[k] = v; save(); },
    reset() { s = fresh(); save(); },
  };
  return api;
})();
