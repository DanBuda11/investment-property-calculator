const CACHE_NAME = 'investment-calc-v1';
const urlsToCache = ['/', '/css/main.css', '/js/index.js'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request));
});

// self.addeListener('install', function(e) {
//   e.waitUntil(
//     caches.open(CACHE_NAME).then(function(cache) {
//       console.log('Opened cache');
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

// self.addeListener('fetch', function(e) {
//   e.respondWith(fromCache(e.req));

//   e.waitUntil(update(e.req).then(refresh));
// });

// function fromCache(req) {
//   return caches.open(CACHE).then(function(cache) {
//     return cache.match(req);
//   });
// }

// function update(req) {
//   return caches.open(CACHE).then(function(cache) {
//     return fetch(req).then(function(res) {
//       return cache.put(req, res.clone()).then(function() {
//         return res;
//       });
//     });
//   });
// }

// function refresh(res) {
//   return self.clients.matchAll().then(function(clients) {
//     clients.forEach(function(client) {
//       const message = {
//         type: 'refresh',
//         url: res.url,
//         eTag: res.headers.get('ETag'),
//       };
//       client.postMessage(JSON.stringify(message));
//     });
//   });
// }
