/* ============================================================
   core/speech.js — распознавание речи (Web Speech API).
   Поддерживается в Chrome/Edge (ПК, Android). На iPhone (Safari)
   обычно НЕ работает — поэтому в интерфейсе кнопка появляется только
   там, где распознавание доступно (feature-gated).
   ============================================================ */
window.CN = window.CN || {};
CN.speech = (function () {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  function supported() { return !!SR; }

  // вернёт массив вариантов распознанного текста (или reject с причиной)
  function recognize(opts) {
    opts = opts || {};
    return new Promise((resolve, reject) => {
      if (!SR) return reject(new Error('unsupported'));
      const r = new SR();
      r.lang = opts.lang || 'zh-CN';
      r.interimResults = false;
      r.maxAlternatives = 4;
      let done = false;
      r.onresult = (e) => {
        done = true;
        const alts = [];
        for (let i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript);
        resolve(alts);
      };
      r.onerror = (e) => { if (!done) reject(new Error(e.error || 'error')); };
      r.onend = () => { if (!done) reject(new Error('no-speech')); };
      try { r.start(); } catch (e) { reject(e); }
    });
  }

  const clean = (s) => String(s).replace(/[\s，。！？、,.!?·]/g, '');

  // совпало ли распознанное с целью (по иероглифам)
  function matches(alts, targetHanzi) {
    const g = clean(targetHanzi);
    return (Array.isArray(alts) ? alts : [alts]).some(a => {
      const t = clean(a);
      return t && (t === g || t.includes(g) || g.includes(t));
    });
  }

  return { supported, recognize, clean, matches };
})();
