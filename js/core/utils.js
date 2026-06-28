/* core/utils.js — маленькие помощники, которыми пользуется весь код. */
window.CN = window.CN || {};
CN.u = {
  $:  (s, r = document) => r.querySelector(s),
  $$: (s, r = document) => [...r.querySelectorAll(s)],

  // Создать элемент: el('div', {class:'x'}, [child, 'текст'])
  el(tag, attrs = {}, kids = []) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') n.className = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) n.setAttribute(k, v);
    }
    (Array.isArray(kids) ? kids : [kids]).forEach(c =>
      c != null && n.append(c.nodeType ? c : document.createTextNode(c)));
    return n;
  },

  shuffle: (a) => [...a].sort(() => Math.random() - 0.5),
  pick: (a, n) => CN.u.shuffle(a).slice(0, n),
  sample: (a) => a[Math.floor(Math.random() * a.length)],
  todayStr: () => new Date().toISOString().slice(0, 10),
  clamp: (x, a, b) => Math.max(a, Math.min(b, x)),
  esc: (s) => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])),
};
