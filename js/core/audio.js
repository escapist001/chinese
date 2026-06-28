/* ============================================================
   core/audio.js — произношение по-китайски.
   1) если для текста есть заранее записанный нейро-голос (MP3) —
      играем его (живой голос носителя, работает офлайн);
   2) иначе откатываемся на системный синтезатор речи (TTS).
   Карта текст→файл лежит в audio/manifest.js (CN.audioManifest).
   ============================================================ */
window.CN = window.CN || {};
CN.audio = (function () {
  const manifest = CN.audioManifest || {};
  const BASE = 'audio/';
  let cur = null;       // текущий проигрываемый <audio>
  let zhVoice = null;

  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices();
    zhVoice = vs.find(v => /^zh/i.test(v.lang)) || null;
  }
  if ('speechSynthesis' in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  function rate(slow) {
    const r = CN.store.settings().rate || 1;
    return slow ? Math.min(r, 1) * 0.6 : r;
  }

  function key(text) { return String(text).trim(); }

  // системный синтез как запасной вариант
  function ttsSpeak(text, slow) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = CN.u.clamp(rate(slow), 0.4, 1.4);
    if (zhVoice) u.voice = zhVoice;
    speechSynthesis.speak(u);
  }

  function speak(text, opts) {
    opts = opts || {};
    const t = key(text);
    const file = manifest[t];
    if (file) {
      try {
        if (cur) { cur.pause(); cur.currentTime = 0; }
        if ('speechSynthesis' in window) speechSynthesis.cancel();
        cur = new Audio(BASE + file);
        cur.preservesPitch = true;            // не «писклявить» при замедлении
        cur.playbackRate = CN.u.clamp(rate(opts.slow), 0.5, 1.5);
        cur.play().catch(() => ttsSpeak(t, opts.slow)); // автоплей зарезан → TTS
        return;
      } catch (e) { /* падаем в TTS ниже */ }
    }
    ttsSpeak(t, opts.slow);
  }

  // последовательно проговорить массив строк (диалог, текст)
  function speakSeq(texts, opts) {
    opts = opts || {};
    let i = 0;
    function one() {
      if (i >= texts.length) { if (opts.onDone) opts.onDone(); return; }
      const t = key(texts[i]);
      const file = manifest[t];
      const nextSoon = () => { i++; setTimeout(one, 250); };
      if (file) {
        try {
          if (cur) { cur.pause(); }
          cur = new Audio(BASE + file);
          cur.preservesPitch = true;
          cur.playbackRate = CN.u.clamp(rate(opts.slow), 0.5, 1.5);
          cur.onended = nextSoon; cur.onerror = nextSoon;
          cur.play().catch(nextSoon);
        } catch (e) { nextSoon(); }
      } else if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(t);
        u.lang = 'zh-CN'; u.rate = CN.u.clamp(rate(opts.slow), 0.4, 1.4);
        if (zhVoice) u.voice = zhVoice; u.onend = nextSoon; u.onerror = nextSoon;
        speechSynthesis.speak(u);
      } else nextSoon();
    }
    one();
  }

  return {
    speak,
    speakSeq,
    available: () => ('speechSynthesis' in window) || Object.keys(manifest).length > 0,
    hasNative: (t) => !!manifest[key(t)],   // есть ли живой голос для строки
    voiceCount: Object.keys(manifest).length,
  };
})();
