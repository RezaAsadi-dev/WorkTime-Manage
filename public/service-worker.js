/* eslint-disable no-restricted-globals */
const cacheName = "platin-work-time-cache-v4";
const staticAssets = [
  "./",
  "./index.html",
  "./favicon.ico",
  "./site.webmanifest",
];
self.addEventListener("install", async (event) => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== cacheName)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// self.addEventListener("fetch", async (event) => {
//   const req = event.request;

//   const url = new URL(req.url);

//   if (url.origin === location.origin) {
//     event.respondWith(cacheFirst(req));
//   } else {
//     event.respondWith(networkAndCache(req));
//   }
// });

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

// async function networkAndCache(req) {
//   const cache = await caches.open(cacheName);
//   try {
//     const fresh = await fetch(req);
//     await cache.put(req, fresh.clone());
//     return fresh;
//   } catch (error) {
//     const cached = await cache.match(req);
//     return cached || await caches.match("./fallback.html"); // Return fallback page if not cached
//   }
// }
