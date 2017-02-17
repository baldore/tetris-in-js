self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('tetris').then(() =>
      cache.addAll([
        '/',
        '/index.html',
        '/tetris.js'
      ])
    )
  );
});