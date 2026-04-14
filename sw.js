// ─── Service Worker — Voyage Japon 2026 ────────────────────────────
// Strategy: cache-first for app shell. On every new deploy, bump CACHE_VERSION
// to force clients to re-fetch everything next time they're online.
// localStorage data (notes, reservations, etc) is NEVER touched by SW updates.

const CACHE_VERSION = 'japon-2026-v1';
const CACHE_NAME = `japon-voyage-${CACHE_VERSION}`;

// Files to cache on first visit (the "app shell")
const APP_SHELL = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './offline.html',
  // React from CDN — cached so the app works offline
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
];

// ─── INSTALL ─── pre-cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(APP_SHELL).catch(err => {
        console.warn('[SW] Some shell items failed to cache:', err);
        // Continue install even if some assets fail (e.g. CDN blocked)
        return Promise.all(
          APP_SHELL.map(url => cache.add(url).catch(() => null))
        );
      });
    }).then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE ─── delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names
          .filter(name => name.startsWith('japon-voyage-') && name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// ─── FETCH ─── cache-first, fall back to network, fall back to offline.html
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET
  if (request.method !== 'GET') return;

  // Skip cross-origin requests we don't explicitly cache (e.g. Google Fonts CSS,
  // analytics, anything else). Let the browser handle them normally.
  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isUnpkg = url.origin === 'https://unpkg.com';
  const isFonts = url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com';

  if (!isSameOrigin && !isUnpkg && !isFonts) return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        // Background revalidate for fonts (so they update if Google changes them)
        if (isFonts) {
          fetch(request).then(fresh => {
            if (fresh && fresh.ok) {
              caches.open(CACHE_NAME).then(c => c.put(request, fresh));
            }
          }).catch(() => {});
        }
        return cached;
      }
      // Not cached: try network, cache the result for next time
      return fetch(request).then(response => {
        if (response && response.ok && (isSameOrigin || isUnpkg || isFonts)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
        }
        return response;
      }).catch(() => {
        // Network failed and no cache → if it's a navigation, show offline page
        if (request.mode === 'navigate') {
          return caches.match('./offline.html');
        }
        return new Response('', { status: 504, statusText: 'Offline' });
      });
    })
  );
});

// Allow page to trigger immediate update
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
