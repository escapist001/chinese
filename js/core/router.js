/* core/router.js — простой роутер по «решётке» в адресе (#/lesson/u1l1). */
window.CN = window.CN || {};
CN.router = (function () {
  const routes = [];   // { re, view, keys }
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
  function render() {
    const { view, params } = resolve();
    const mount = CN.u.$('#app');
    const fn = (CN.views[view] || CN.views.home);
    mount.innerHTML = '';
    mount.append(fn(params));
    mount.scrollTo ? mount.scrollTo(0, 0) : window.scrollTo(0, 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    CN.u.$$('.nav-link').forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === (location.hash || '#/home')
        || (view === 'home' && a.dataset.section === 'home')));
    document.dispatchEvent(new CustomEvent('cn:rendered', { detail: { view, params } }));
  }
  function go(hash) { location.hash = hash; }
  function start() { window.addEventListener('hashchange', render); render(); }
  return { add, start, go, current: resolve };
})();
