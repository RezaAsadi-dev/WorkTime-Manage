const CACHE_NAME = 'worktime-manage-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// لیست فایل‌های استاتیک که باید کش شوند
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/site.webmanifest'
];

// نصب سرویس ورکر و کش کردن فایل‌های استاتیک
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE)
    ])
  );
});

// فعال‌سازی سرویس ورکر و پاک کردن کش‌های قدیمی
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// استراتژی کش برای درخواست‌های مختلف
const cacheStrategy = async (request) => {
  // برای درخواست‌های API از استراتژی Network First استفاده می‌کنیم
  if (request.url.includes('/api/')) {
    try {
      const networkResponse = await fetch(request);
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      // اگر کش هم نبود، یک پاسخ آفلاین برگردان
      return new Response(JSON.stringify({ error: 'You are offline' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // برای فایل‌های استاتیک از استراتژی Cache First استفاده می‌کنیم
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    // اگر فایل در کش نبود و شبکه هم در دسترس نبود
    if (request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
      return caches.match('/android-chrome-192x192.png');
    }
    return new Response('You are offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
};

// مدیریت درخواست‌ها
self.addEventListener('fetch', event => {
  event.respondWith(cacheStrategy(event.request));
});

// مدیریت پیام‌ها
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// مدیریت خطاها
self.addEventListener('error', event => {
  console.error('Service Worker Error:', event.error);
});

// مدیریت خطاهای ناتمام
self.addEventListener('unhandledrejection', event => {
  console.error('Unhandled Promise Rejection:', event.reason);
}); 