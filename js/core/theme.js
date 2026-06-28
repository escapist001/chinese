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
  function toggle() { set(current() === 'dark' ? 'light' : 'dark'); }

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
