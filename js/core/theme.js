/* ============================================================
   core/theme.js — переключение дневной (昼) и ночной (夜) темы.
   Тема хранится в настройках (store) и применяется на <html>.
   ============================================================ */
window.CN = window.CN || {};
CN.theme = (function () {
  const root = document.documentElement;

  function current() { return CN.store.settings().theme === 'dark' ? 'dark' : 'light'; }

  function apply(t) {
    root.setAttribute('data-theme', t);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#14161a' : '#f1ede2');
    refreshButton();
  }

  function set(t) { CN.store.setSetting('theme', t); apply(t); }

  // чернильная волна: круг расходится из кнопки, на пике переключаем тему
  function toggle() {
    const nextT = current() === 'dark' ? 'light' : 'dark';
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const btn = document.getElementById('themeToggle');
    if (reduced || !btn || typeof document.body.animate !== 'function') { set(nextT); return; }
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const far = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
    const wave = document.createElement('div');
    const bg = nextT === 'dark' ? '#14161a' : '#f1ede2';
    wave.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:${far*2}px;height:${far*2}px;`
      + `margin:${-far}px 0 0 ${-far}px;border-radius:50%;background:${bg};z-index:300;pointer-events:none;`
      + `transform:scale(0);will-change:transform`;
    document.body.append(wave);
    const an = wave.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 620, easing: 'cubic-bezier(.4,0,.2,1)' });
    setTimeout(() => set(nextT), 300);
    an.onfinish = () => { wave.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260 }).onfinish = () => wave.remove(); };
  }

  // кнопка показывает иконку ТОЙ темы, на которую переключит
  function refreshButton() {
    const btn = document.getElementById('themeToggle');
    if (!btn || !CN.icon) return;
    const dark = current() === 'dark';
    btn.innerHTML = '';
    btn.append(CN.icon(dark ? 'sun' : 'moon'));
    btn.title = dark ? 'Дневная тема 昼' : 'Ночная тема 夜';
  }

  function init() {
    apply(current());
    const btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', toggle);
  }

  return { init, toggle, set, current };
})();
