/* sw.js — service worker: офлайн-работа и быстрый запуск.
   Стратегия: навигация — network-first (видим обновления, офлайн — из кэша);
   остальное (css/js/audio/шрифты/CDN) — cache-first с дозаписью в кэш. */
const CACHE = 'cn-trainer-v1';

const SHELL = [
  './', 'index.html', 'manifest.json',
  'css/base.css', 'css/components.css', 'css/views.css',
  'audio/manifest.js',
  'js/data/pinyin.js', 'js/data/lessons.js', 'js/data/drills.js', 'js/data/reference.js',
  'js/core/utils.js', 'js/core/icons.js', 'js/core/fx.js', 'js/core/store.js',
  'js/core/audio.js', 'js/core/speech.js', 'js/core/theme.js', 'js/core/router.js',
  'js/components.js',
  'js/views/home.js', 'js/views/lesson.js', 'js/views/pinyin.js', 'js/views/tonestudio.js',
  'js/views/minpairs.js', 'js/views/quiz.js', 'js/views/review.js', 'js/views/practice.js',
  'js/views/games.js', 'js/views/methodology.js', 'js/views/profile.js', 'js/views/personalize.js',
  'js/views/extra.js', 'js/app.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // навигация: сеть с откатом на кэш (index.html)
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('index.html').then(r => r || caches.match('./'))));
    return;
  }

  // остальное: из кэша, иначе сеть + дозапись
  e.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    if (res && (res.ok || res.type === 'opaque')) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
    }
    return res;
  }).catch(() => cached)));
});
