const cacheName = 'calc-v2';
const appFiles = [
  '/index.html',
  '/css/main.css',
  '/js/index.js',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'apple-touch-icon.png',
  'browserconfig.xml',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon.ico',
  'mstile-150x150.png',
  'safari-pinned-tab.svg',
  'site.webmanifest',
];

self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching all');
      return cache.addAll(appFiles);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      return (
        r ||
        fetch(e.request).then(function(response) {
          return caches.open(cacheName).then(function(cache) {
            console.log(
              `[Service Worker] Caching new resource: ${e.request.url}`
            );
            cache.put(e.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keylist) {
      return Promise.all(
        keylist.map(function(key) {
          if (cacheName.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// const cacheName = 'files';

// addEventListener('fetch', fetchEvent => {
//   const request = fetchEvent.request;
//   if (request.method !== 'GET') {
//     return;
//   }
//   fetchEvent.respondWith(async function() {
//     const fetchPromise = fetch(request);
//     fetchEvent.waitUntil(
//       (async function() {
//         const responseFromFetch = await fetchPromise;
//         const responseCopy = responseFromFetch.clone();
//         const myCache = await caches.open(cacheName);
//         return myCache.put(request, responseCopy);
//       })()
//     );
//     if (request.headers.get('Accept').includes('text/html')) {
//       try {
//         return fetchPromise;
//       } catch (error) {
//         return caches.match(request);
//       }
//     } else {
//       const responseFromCache = await caches.match(request);
//       return responseFromCache || fetchPromise;
//     }
//   });
// });
