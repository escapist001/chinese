/* ============================================================
   views/tonestudio.js — «Студия тонов»: Женя произносит слог,
   мы рисуем кривую высоты её голоса и сравниваем форму с эталоном тона.
   Полностью офлайн (Web Audio), бесплатно, работает на iPhone (нужен https).
   Это сравнение ФОРМЫ тона, а не строгая оценка произношения.
   ============================================================ */
window.CN = window.CN || {};

CN.toneStudio = function () {
  const { el } = CN.u, icon = CN.icon;

  // эталонные контуры тона: высота 0 (низко) … 1 (высоко), 20 точек по времени
  const K = 20;
  const IDEAL = {
    1: Array.from({ length: K }, () => 0.85),                                  // ровный высокий
    2: Array.from({ length: K }, (_, i) => 0.25 + 0.7 * (i / (K - 1))),        // восходящий
    3: Array.from({ length: K }, (_, i) => { const t = i / (K - 1);            // провал ∨
         return t < 0.4 ? 0.5 - (0.42 * t / 0.4) : 0.08 + 0.7 * ((t - 0.4) / 0.6); }),
    4: Array.from({ length: K }, (_, i) => 0.95 - 0.83 * (i / (K - 1))),       // падающий
  };
  const TONE_INFO = {
    1: { sample: 'mā', zi: '妈', tip: 'Ровно и высоко, как одна нота.' },
    2: { sample: 'má', zi: '麻', tip: 'Снизу вверх, как удивлённое «да?».' },
    3: { sample: 'mǎ', zi: '马', tip: 'Вниз и снова наверх — провал.' },
    4: { sample: 'mà', zi: '骂', tip: 'Резко сверху вниз, как «Стоп!».' },
  };

  let tone = 1, recording = false, raf = 0, samples = [];
  let ac = null, stream = null;

  const wrap = el('section', { class: 'tone-studio' });
  wrap.append(el('h2', { class: 'section-h' }, 'Студия тонов — проверь свой голос'));
  wrap.append(el('p', { class: 'tip' }, 'Выбери тон, нажми «Говорить» и произнеси слог. Мы нарисуем кривую твоего голоса и сравним её форму с эталоном. Нужен доступ к микрофону.'));

  // выбор тона
  const picker = el('div', { class: 'ts-picker' });
  [1, 2, 3, 4].forEach(n => {
    const b = el('button', { class: 'ts-tone' + (n === 1 ? ' on' : ''), onclick: () => setTone(n) }, [
      el('span', { class: 'ts-tone-n' }, n + ' тон'),
      el('span', { class: 'ts-tone-s' }, TONE_INFO[n].sample),
    ]);
    picker.append(b);
  });
  wrap.append(picker);

  const canvas = el('canvas', { class: 'ts-canvas', width: 600, height: 220 });
  wrap.append(el('div', { class: 'ts-canvas-wrap' }, canvas));

  const hint = el('div', { class: 'ts-hint' }, TONE_INFO[1].tip);
  const recBtn = el('button', { class: 'btn btn-primary', onclick: toggleRec }, [ icon('speaker'), 'Говорить' ]);
  const playBtn = el('button', { class: 'btn btn-ghost', onclick: () => CN.audio.speak(TONE_INFO[tone].zi) }, [ icon('play'), 'Эталон' ]);
  const result = el('div', { class: 'ts-result' });
  wrap.append(el('div', { class: 'ts-controls' }, [ recBtn, playBtn ]), hint, result);

  draw();
  // перерисовать при смене размера окна
  const onResize = () => draw();
  window.addEventListener('resize', onResize);

  function setTone(n) {
    tone = n;
    CN.u.$$('.ts-tone', picker).forEach((b, i) => b.classList.toggle('on', i === n - 1));
    hint.textContent = TONE_INFO[n].tip;
    result.textContent = '';
    samples = [];
    draw();
  }

  // ── рисование: эталон (пунктир) + кривая голоса ──
  function draw() {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height, pad = 18;
    ctx.clearRect(0, 0, w, h);
    const cs = getComputedStyle(document.documentElement);
    const grid = cs.getPropertyValue('--grid-line').trim() || 'rgba(210,60,44,.3)';
    const verm = cs.getPropertyValue('--vermilion').trim() || '#d23c2c';
    const cel = cs.getPropertyValue('--celadon').trim() || '#2c7d6b';
    const ink = cs.getPropertyValue('--ink-soft').trim() || '#888';

    // сетка
    ctx.strokeStyle = grid; ctx.lineWidth = 1; ctx.setLineDash([4, 5]);
    for (let i = 1; i < 4; i++) { const y = pad + (h - 2 * pad) * i / 4; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke(); }
    ctx.setLineDash([]);

    const X = i => pad + (w - 2 * pad) * i / (K - 1);
    const Y = v => pad + (h - 2 * pad) * (1 - v);

    // эталон тона
    ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.setLineDash([7, 7]); ctx.lineCap = 'round';
    ctx.beginPath(); IDEAL[tone].forEach((v, i) => i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v))); ctx.stroke();
    ctx.setLineDash([]);

    // кривая голоса
    if (samples.length > 1) {
      const norm = normalize(samples);
      ctx.strokeStyle = recording ? verm : cel; ctx.lineWidth = 4; ctx.lineJoin = 'round';
      ctx.beginPath();
      norm.forEach((p, i) => { const x = pad + (w - 2 * pad) * p.t; const y = Y(p.v);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke();
    }
  }

  // нормализуем собранные {t,semi} в {t:0..1, v:0..1}
  function normalize(arr) {
    const v = arr.filter(s => s.f > 0);
    if (v.length < 2) return [];
    const t0 = v[0].t, t1 = v[v.length - 1].t || 1;
    let lo = Infinity, hi = -Infinity;
    v.forEach(s => { lo = Math.min(lo, s.semi); hi = Math.max(hi, s.semi); });
    const range = Math.max(2, hi - lo);
    return v.map(s => ({ t: (s.t - t0) / (t1 - t0 || 1), v: CN.u.clamp((s.semi - lo) / range, 0, 1) }));
  }

  // ── запись с микрофона ──
  async function toggleRec() {
    if (recording) { stop(); return; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      result.className = 'ts-result no'; result.textContent = 'Микрофон недоступен в этом браузере.'; return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      result.className = 'ts-result no'; result.textContent = 'Не дали доступ к микрофону. Разреши его и попробуй снова.'; return;
    }
    ac = new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') await ac.resume();
    const src = ac.createMediaStreamSource(stream);
    const an = ac.createAnalyser(); an.fftSize = 2048;
    src.connect(an);
    const buf = new Float32Array(an.fftSize);

    recording = true; samples = []; result.textContent = '';
    recBtn.classList.add('rec'); recBtn.innerHTML = ''; recBtn.append(icon('close'), 'Стоп');
    const t0 = performance.now();
    (function loop(t) {
      if (!recording) return;
      an.getFloatTimeDomainData(buf);
      const f = autoCorrelate(buf, ac.sampleRate);
      const time = (t - t0) / 1000;
      if (f > 0) samples.push({ t: time, f, semi: 12 * Math.log2(f / 130.81) });
      else samples.push({ t: time, f: -1, semi: 0 });
      draw();
      if (time > 2.2) { stop(); return; }
      raf = requestAnimationFrame(loop);
    })(t0);
  }

  function stop() {
    recording = false;
    cancelAnimationFrame(raf);
    recBtn.classList.remove('rec'); recBtn.innerHTML = ''; recBtn.append(icon('speaker'), 'Говорить');
    if (stream) stream.getTracks().forEach(tr => tr.stop());
    if (ac) ac.close();
    stream = ac = null;
    draw();
    score();
  }

  // ── оценка формы тона ──
  function score() {
    const norm = normalize(samples);
    if (norm.length < 6) {
      result.className = 'ts-result no';
      result.textContent = 'Не расслышали голос — говори чуть громче и тяни слог подольше.';
      return;
    }
    const user = resample(norm, K);
    const ideal = IDEAL[tone];
    let s;
    if (tone === 1) {
      const mean = user.reduce((a, b) => a + b, 0) / K;
      const variance = user.reduce((a, b) => a + (b - mean) ** 2, 0) / K;
      s = Math.round(CN.u.clamp(100 - Math.sqrt(variance) * 260, 0, 100)); // чем ровнее — тем выше
    } else {
      s = Math.round(CN.u.clamp(pearson(user, ideal) * 100, 0, 100));
    }
    if (s >= 70) { result.className = 'ts-result ok'; result.textContent = `Отлично! Форма тона совпадает на ${s}%. 加油！`; CN.fx.inkBurst({ count: 18, y: window.innerHeight * 0.5 }); }
    else if (s >= 45) { result.className = 'ts-result mid'; result.textContent = `Неплохо — ${s}%. Сравни свою кривую с пунктиром и повтори.`; }
    else { result.className = 'ts-result no'; result.textContent = `Пока мимо (${s}%). Посмотри на эталонную кривую и попробуй повторить её форму.`; }
  }

  function resample(pts, k) {
    const out = [];
    for (let i = 0; i < k; i++) {
      const t = i / (k - 1);
      let j = 0; while (j < pts.length - 1 && pts[j + 1].t < t) j++;
      const a = pts[j], b = pts[Math.min(j + 1, pts.length - 1)];
      const span = (b.t - a.t) || 1;
      out.push(a.v + (b.v - a.v) * CN.u.clamp((t - a.t) / span, 0, 1));
    }
    return out;
  }

  function pearson(a, b) {
    const n = a.length, ma = avg(a), mb = avg(b);
    let num = 0, da = 0, db = 0;
    for (let i = 0; i < n; i++) { const x = a[i] - ma, y = b[i] - mb; num += x * y; da += x * x; db += y * y; }
    const den = Math.sqrt(da * db);
    return den ? num / den : 0;
  }
  function avg(a) { return a.reduce((x, y) => x + y, 0) / a.length; }

  // автокорреляция: оценка основной частоты голоса
  function autoCorrelate(buf, sr) {
    let SIZE = buf.length, rms = 0;
    for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;
    let r1 = 0, r2 = SIZE - 1; const thr = 0.2;
    for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buf[i]) < thr) { r1 = i; break; }
    for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buf[SIZE - i]) < thr) { r2 = SIZE - i; break; }
    const b = buf.slice(r1, r2); SIZE = b.length;
    if (SIZE < 8) return -1;
    const c = new Float32Array(SIZE);
    for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE - i; j++) c[i] += b[j] * b[j + i];
    let d = 0; while (d < SIZE - 1 && c[d] > c[d + 1]) d++;
    let max = -1, pos = -1;
    for (let i = d; i < SIZE; i++) if (c[i] > max) { max = c[i]; pos = i; }
    let T0 = pos;
    const x1 = c[T0 - 1] || 0, x2 = c[T0] || 0, x3 = c[T0 + 1] || 0;
    const a = (x1 + x3 - 2 * x2) / 2, bb = (x3 - x1) / 2;
    if (a) T0 = T0 - bb / (2 * a);
    const f = sr / T0;
    return (f > 70 && f < 500) ? f : -1;  // диапазон человеческого голоса
  }

  // очистка при уходе с экрана
  document.addEventListener('cn:rendered', function once() {
    window.removeEventListener('resize', onResize);
    if (recording) stop();
    document.removeEventListener('cn:rendered', once);
  });

  return wrap;
};
