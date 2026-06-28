/* sw.js — service worker: офлайн-работа и быстрый запуск.
   Стратегия:
   • навигация и КОД (html/css/js/json) — network-first:
     при онлайне всегда свежее (обновления видны сразу), офлайн — из кэша.
   • тяжёлое и неизменное (mp3/шрифты/иконки/CDN) — cache-first.
   ВАЖНО: при каждом релизе меняем VERSION — иначе старый кэш не очистится. */
const VERSION = 'v4-2026-06-28';
const CACHE = 'cn-trainer-' + VERSION;

const SHELL = [
  './', 'index.html', 'manifest.json',
  'css/base.css', 'css/components.css', 'css/views.css', 'css/extra.css',
  'audio/manifest.js',
  'js/data/pinyin.js', 'js/data/lessons.js', 'js/data/drills.js', 'js/data/reference.js',
  'js/core/utils.js', 'js/core/icons.js', 'js/core/fx.js', 'js/core/store.js',
  'js/core/audio.js', 'js/core/speech.js', 'js/core/theme.js', 'js/core/mascot.js', 'js/core/router.js',
  'js/components.js',
  'js/views/home.js', 'js/views/lesson.js', 'js/views/pinyin.js', 'js/views/tonestudio.js',
  'js/views/minpairs.js', 'js/views/quiz.js', 'js/views/review.js', 'js/views/practice.js',
  'js/views/games.js', 'js/views/methodology.js', 'js/views/profile.js', 'js/views/personalize.js',
  'js/views/garden.js', 'js/views/etymology.js', 'js/views/extra.js', 'js/app.js',
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

// позволяем странице форсировать активацию нового worker'а
self.addEventListener('message', (e) => { if (e.data === 'skip-waiting') self.skipWaiting(); });

// network-first: свежее из сети, в кэш для офлайна, при сбое — из кэша
function networkFirst(req) {
  return fetch(req).then(res => {
    if (res && (res.ok || res.type === 'opaque')) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
    }
    return res;
  }).catch(() => caches.match(req).then(r => r || caches.match('index.html')));
}

// cache-first: из кэша мгновенно, иначе сеть + дозапись
function cacheFirst(req) {
  return caches.match(req).then(cached => cached || fetch(req).then(res => {
    if (res && (res.ok || res.type === 'opaque')) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
    }
    return res;
  }).catch(() => cached));
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  if (req.mode === 'navigate') { e.respondWith(networkFirst(req)); return; }

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isCode = /\.(?:html|css|js|json)$/i.test(url.pathname);

  // свой код/данные — всегда свежие при онлайне; всё прочее (mp3/шрифты/CDN) — из кэша
  if (sameOrigin && isCode) e.respondWith(networkFirst(req));
  else e.respondWith(cacheFirst(req));
});
