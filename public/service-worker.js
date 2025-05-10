/* eslint-disable no-restricted-globals */
const cacheName = "cache-v80";
const staticAssets = [
  "./",
  "./index.html",
  "./favicon.ico",
  "./favicon-16x16.png",
  "./favicon-32x32.png",
  "./apple-touch-icon.png",
  "./android-chrome-192x192.png",
  "./android-chrome-512x512.png",
  "./maskable-192x192.png",
  "./maskable-512x512.png",
  "./site.webmanifest",
];
self.addEventListener("install", async (event) => {
  event.waitUntil(async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
  });
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

self.addEventListener("fetch", async (event) => {
  const req = event.request;

  const url = new URL(req.url);

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (error) {
    console.error("Network request failed, falling back to cache:", error);
    const cached = await cache.match(req);
    return cached || await caches.match("./fallback.html"); // Return fallback page if not cached
  }
}
