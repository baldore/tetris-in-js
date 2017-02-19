const cacheName = 'v1';
const cacheFiles = [
  './',
  './index.html',
  './tetris.js'
]

self.addEventListener('install', (e) => {
  // console.log('[ServiceWorker] installed');
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      // console.log('[ServiceWorker] caching cacheFiles');
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('activate', (e) => {
  // console.log('[ServiceWorker] activated');
  e.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(cacheNames.map((thisCacheName) => {
        if (thisCacheName !== cacheName) {
          // console.log('[ServiceWorker] removing cached files from', cacheName);
          return caches.delete(thisCacheName);
        }
      }))
    )
  );
});

this.addEventListener('fetch', function(event) {
  if (
    event.request.method !== 'GET' ||
    event.request.url.startsWith('chrome-extension')
  ) {
    return Promise.resolve(undefined);
  }

  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        caches.open(cacheName).then(function(cache) {
          cache.put(event.request, response.clone());
        });
        return response;
      });
    }).catch(function(err) {
      console.log('[ServiceWorker] An error ocurred', err);
    })
  );
});