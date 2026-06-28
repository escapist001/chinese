/* ============================================================
   core/fx.js — визуальные эффекты в стиле «тушь и кисть».
   • countUp  — число плавно «набегает» до значения
   • inkBurst — чернильные брызги (canvas, без библиотек)
   Всё уважает prefers-reduced-motion.
   ============================================================ */
window.CN = window.CN || {};
CN.fx = (function () {
  const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // плавный счётчик: el — узел, to — целевое число, suffix — напр. '%'
  function countUp(el, to, opts) {
    opts = opts || {};
    const dur = opts.dur || 750, suffix = opts.suffix || '';
    to = Number(to) || 0;
    if (reduced() || to === 0) { el.textContent = to + suffix; return; }
    const t0 = performance.now();
    function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);           // ease-out
      el.textContent = Math.round(to * e) + suffix;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // чернильные брызги из точки (по умолчанию — центр экрана)
  function inkBurst(opts) {
    opts = opts || {};
    if (reduced()) return;
    const cs = getComputedStyle(document.documentElement);
    const colors = opts.colors || [
      cs.getPropertyValue('--vermilion').trim() || '#d23c2c',
      cs.getPropertyValue('--celadon').trim() || '#2c7d6b',
      cs.getPropertyValue('--ink').trim() || '#211f1a',
    ];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    const x = opts.x != null ? opts.x : W / 2;
    const y = opts.y != null ? opts.y : H * 0.4;
    const n = opts.count || 26;

    const cv = document.createElement('canvas');
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:250';
    document.body.append(cv);
    const ctx = cv.getContext('2d');
    ctx.scale(dpr, dpr);

    const parts = [];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 3 + Math.random() * 9;
      parts.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4,
        r: 3 + Math.random() * 7, c: colors[(Math.random() * colors.length) | 0],
        life: 1, decay: 0.012 + Math.random() * 0.02,
      });
    }
    const t0 = performance.now();
    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      for (const p of parts) {
        if (p.life <= 0) continue;
        alive = true;
        p.vy += 0.35;            // гравитация
        p.vx *= 0.98;
        p.x += p.vx; p.y += p.vy;
        p.life -= p.decay;
        ctx.globalAlpha = Math.max(0, p.life) * 0.9;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.4 + p.life * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
      if (alive && t - t0 < 1400) requestAnimationFrame(frame);
      else cv.remove();
    }
    requestAnimationFrame(frame);
  }

  // нарисовать иероглиф кистью в элементе (Hanzi Writer). Фолбэк — статичный текст.
  function brushWrite(el, char, opts) {
    opts = opts || {};
    const size = opts.size || el.clientWidth || 120;
    const cs = getComputedStyle(document.documentElement);
    const color = opts.color || cs.getPropertyValue('--vermilion').trim() || '#d23c2c';
    // нет анимаций / нет библиотеки → оставляем уже отрисованный статичный иероглиф
    if (reduced() || !window.HanziWriter) return;
    const fallback = () => { el.innerHTML = '<span class="zi">' + char + '</span>'; };
    el.textContent = '';
    try {
      const w = HanziWriter.create(el, char, {
        width: size, height: size, padding: Math.round(size * 0.08),
        showOutline: false, strokeColor: color, strokeAnimationSpeed: 1.4,
        delayBetweenStrokes: 90,
        onLoadCharDataError: fallback,
      });
      w.animateCharacter();
      return w;
    } catch (e) { fallback(); }
  }

  return { countUp, inkBurst, brushWrite, reduced };
})();
