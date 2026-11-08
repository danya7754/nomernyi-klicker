// Офлайн-режим: гра зберігає свої файли на телефоні й відкривається без інтернету.
// Після зміни будь-якого файлу гри збільш VERSION, щоб телефон завантажив нову версію.
const VERSION = 'nomernyi-klicker-v4';
const FILES = [
  './',
  'index.html',
  'style.css',
  'game.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'fonts/roboto-condensed-700-cyrillic.woff2',
  'fonts/roboto-condensed-700-latin.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Спершу мережа (щоб оновлення приходили одразу), без мережі — збережена копія.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req, { cache: 'no-cache' })      // завжди питати сервер про свіжу версію
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('index.html')))
  );
});
