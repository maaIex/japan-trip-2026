// ─── Service Worker — Voyage Japon 2026 ──────────────────────────────
// Strategy: cache-first for app shell, network-first for HTML navigations
// so new deploys go live quickly without the user having to uninstall.
//
// 🔁 On every new deploy, bump CACHE_VERSION to force old caches to be
//    deleted on the next visit.
// 🧷 localStorage data (notes, reservations, done-items) is NEVER touched
//    by the SW — only static assets are cached here.

const CACHE_VERSION = 'japon-2026-v3';
const CACHE_NAME = `japon-voyage-${CACHE_VERSION}`;

// Files to cache on first visit. Paths are relative to the site root.
// The built JS/CSS bundle names are hashed by Vite, so they are cached
// lazily by the fetch handler rather than listed here.
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
];

// ─── INSTALL ─── pre-cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      // Use add() per-item so a single failure (e.g. missing icon) does
      // not fail the whole install.
      Promise.all(
        APP_SHELL.map(url =>
          cache.add(url).catch(err => console.warn('[SW] skip', url, err))
        )
      )
    ).then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE ─── clean up old caches from previous deploys
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names
          .filter(n => n.startsWith('japon-voyage-') && n !== CACHE_NAME)
          .map(n => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

// ─── FETCH ─── mixed strategy
// - HTML navigations: network-first with cache+offline fallback (fresh UI)
// - Everything else (same-origin): cache-first, populate on miss
// - Cross-origin: bypass (let the browser handle it)
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFonts =
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com';

  // HTML navigations → network-first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(resp => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put('/index.html', clone));
          return resp;
        })
        .catch(() =>
          caches.match('/index.html').then(cached => cached || caches.match('/offline.html'))
        )
    );
    return;
  }

  // Only handle same-origin + Google Fonts below
  if (!sameOrigin && !isFonts) return;

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request)
        .then(resp => {
          if (resp && resp.ok && resp.type !== 'opaque') {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, clone));
          }
          return resp;
        })
        .catch(() => new Response('', { status: 504, statusText: 'Offline' }));
    })
  );
});

// Allow the page to trigger an immediate SW update when desired
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
