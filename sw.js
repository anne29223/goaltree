const CACHE_NAME = 'goal-tree-cache-v1';

// In production, Vite outputs hashed asset filenames. It's unsafe to hard-code
// source files here. We'll use a runtime caching strategy for navigation and
// static resources (images, css, js) and provide an index.html fallback for SPA.

self.addEventListener('install', (event) => {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Simple runtime cache for images and other assets
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // For navigation requests, respond with index.html (SPA fallback)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For other requests, try cache first then network and cache the response
  if (request.destination === 'image' || request.destination === 'style' || request.destination === 'script' || request.destination === 'font') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => cached || fetch(request).then((resp) => {
          // Only cache successful GET responses
          if (resp && resp.ok && request.method === 'GET') cache.put(request, resp.clone());
          return resp;
        }).catch(() => cached))
      )
    );
  }
  // Let other requests pass through
});
