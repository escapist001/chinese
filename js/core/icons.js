/* ============================================================
   core/icons.js — набор аккуратных SVG-иконок (стиль Lucide,
   обводка 2px, currentColor). Заменяют эмодзи в интерфейсе:
   эмодзи зависят от шрифта ОС и выглядят непрофессионально.
   Использование: CN.icon('speaker')  → <svg>…</svg>
   ============================================================ */
window.CN = window.CN || {};
CN.icon = (function () {
  const ns = 'http://www.w3.org/2000/svg';

  // Каждая иконка — содержимое <svg> в системе координат 24×24.
  const P = {
    speaker:  '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M19 6a8 8 0 0 1 0 12"/>',
    brush:    '<path d="M9.5 14.5 4 20c1.6 1 3.8.6 5-1 .8-1.2.6-2.6-.5-3.5z"/><path d="m13 13 7.3-7.3a1.7 1.7 0 0 0-2.4-2.4L10.6 10"/><path d="m9.5 14.5 4-4 .5.5 1 1-4 4z"/>',
    gear:     '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.2 8.4l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 1-1.5V4a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
    flame:    '<path d="M12 2c1 3-1 4-2 6-1.2 2.4 0 4 0 4s-2-1-2.5-3C5.5 11 4 13.4 4 16a8 8 0 0 0 16 0c0-3.6-2.4-6-4-8-1.6-1.3-3-3.4-4-6z"/>',
    book:     '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    target:   '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
    trophy:   '<path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3"/><path d="M17 6h3v1a3 3 0 0 1-3 3"/><path d="M9 21h6"/><path d="M12 13v8"/>',
    repeat:   '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    search:   '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    check:    '<path d="M20 6 9 17l-5-5"/>',
    close:    '<path d="M18 6 6 18M6 6l12 12"/>',
    play:     '<path d="M6 4v16l13-8z"/>',
    arrowLeft:'<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    sun:      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon:     '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    sparkle:  '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    seal:     '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12l3 3 5-6"/>',
    bolt:     '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    chart:    '<path d="M3 3v18h18"/><path d="M7 15l3-4 3 2 4-6"/>',
    mic:      '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 17v4"/><path d="M8 21h8"/>',
    ear:      '<path d="M6 8a6 6 0 0 1 12 0c0 3-2 4-3 5.5-1 1.5-1 3.5-3 3.5a3 3 0 0 1-3-3"/><path d="M9 8a3 3 0 0 1 5 2"/>',
    cards:    '<rect x="3" y="8" width="12" height="13" rx="2"/><path d="M8 8V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3"/>',
    home:     '<path d="M3 11l9-8 9 8"/><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/><path d="M9 21v-6h6v6"/>',
    star:     '<path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.9 6.2 21l1.1-6.5-4.7-4.6 6.5-.95z"/>',
    plus:     '<path d="M12 5v14M5 12h14"/>',
    trash:    '<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/>',
    doc:      '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h5"/>',
  };

  function icon(name, size = 20) {
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('class', 'ic ic-' + name);
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = P[name] || '';
    return svg;
  }
  return icon;
})();
