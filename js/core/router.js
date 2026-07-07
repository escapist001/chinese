/* core/router.js — простой роутер по «решётке» в адресе (#/lesson/u1l1).
   Переходы между экранами сглажены через View Transitions API
   (плавный морф старого экрана в новый). Где API нет — обычная замена. */
window.CN = window.CN || {};
CN.router = (function () {
  const routes = [];   // { re, view, keys }
  const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stack = [];    // история глубины — чтобы понять «вперёд» это или «назад»

  function add(pattern, view) {
    const keys = [];
    const re = new RegExp('^#/' + pattern.replace(/:([\w]+)/g, (_, k) => {
      keys.push(k); return '([^/]+)';
    }) + '/?$');
    routes.push({ re, view, keys });
  }
  function resolve() {
    const hash = location.hash || '#/home';
    for (const r of routes) {
      const m = hash.match(r.re);
      if (m) {
        const params = {};
        r.keys.forEach((k, i) => params[k] = decodeURIComponent(m[i + 1]));
        return { view: r.view, params };
      }
    }
    return { view: 'home', params: {} };
  }

  // направление перехода: назад на «Главную» или к уже виденному экрану → 'back'
  function direction(hash) {
    if (hash === '#/home' || hash === '' ) return 'back';
    const i = stack.lastIndexOf(hash);
    if (i !== -1) { stack.length = i + 1; return 'back'; }
    stack.push(hash); if (stack.length > 40) stack.shift();
    return 'forward';
  }

  // собственно отрисовка экрана (внутри View Transition, если он есть)
  function paint() {
    const { view, params } = resolve();
    const mount = CN.u.$('#app');
    const fn = (CN.views[view] || CN.views.home);
    mount.innerHTML = '';
    mount.append(fn(params));
    CN.u.$$('.nav-link').forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === (location.hash || '#/home')
        || (view === 'home' && a.dataset.section === 'home')));
    document.dispatchEvent(new CustomEvent('cn:rendered', { detail: { view, params } }));
  }

  function afterPaint() {
    const mount = CN.u.$('#app');
    mount.scrollTo ? mount.scrollTo(0, 0) : window.scrollTo(0, 0);
    window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
  }

  let activeVT = null;
  function render() {
    const hash = location.hash || '#/home';
    // без поддержки API или при reduced-motion — простая мгновенная замена
    if (!document.startViewTransition || reduced()) { paint(); afterPaint(); return; }
    document.documentElement.setAttribute('data-nav', direction(hash));
    // если предыдущий переход ещё идёт — завершаем его мгновенно, чтобы не было конфликта
    if (activeVT && activeVT.skipTransition) { try { activeVT.skipTransition(); } catch (e) {} }
    const t = document.startViewTransition(() => paint());
    activeVT = t;
    // все промисы перехода могут отклониться при прерывании — глушим, чтобы не было ошибок в консоли
    if (t.ready) t.ready.catch(() => {});
    if (t.updateCallbackDone) t.updateCallbackDone.catch(() => {});
    t.finished.catch(() => {}).finally(() => {
      if (activeVT === t) { activeVT = null; document.documentElement.removeAttribute('data-nav'); }
    });
    afterPaint();
  }

  function go(hash) { location.hash = hash; }
  function start() { direction(location.hash || '#/home'); window.addEventListener('hashchange', render); render(); }
  return { add, start, go, current: resolve };
})();
