const CACHE_NAME = 'dimdump-cache-v3';
const DYNAMIC_CACHE_NAME = 'dimdump-dynamic-v3';
const IMAGE_CACHE_NAME = 'dimdump-images-v3';

const STATIC_ASSETS = [
  '/',
  '/admin/',
  '/info/',
  '/link/',
  '/manifest.json',
  '/gambar/maskot.png'
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        STATIC_ASSETS.map((asset) => cache.add(asset).catch(() => {}))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  const allowedCaches = [CACHE_NAME, DYNAMIC_CACHE_NAME, IMAGE_CACHE_NAME];
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!allowedCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Jangan cache non-GET (POST, PUT, dll) atau ekstensi browser
  if (e.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Khusus Gambar: Cache First + Background Revalidate
  if (e.request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i)) {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        // Ambil data terbaru di background
        const networkFetch = fetch(e.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(IMAGE_CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
          }
        }).catch(() => {});

        // Namun jika gambar sudah ada di cache, langsung kembalikan tanpa harus loading
        if (cachedResponse) {
          e.waitUntil(networkFetch);
          return cachedResponse;
        }

        // Gambar blm ada di cache
        return fetch(e.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) return networkResponse;
          const clone = networkResponse.clone();
          caches.open(IMAGE_CACHE_NAME).then((cache) => cache.put(e.request, clone));
          return networkResponse;
        }).catch(() => {
          return new Response('', { status: 404, statusText: 'Not Found' });
        });
      })
    );
    return;
  }

  // HTML / Navigasi: Network First (agar selalu dpt versi web terbaru), Fallback to Cache
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then((networkResponse) => {
        const clone = networkResponse.clone();
        caches.open(DYNAMIC_CACHE_NAME).then((cache) => cache.put(e.request, clone));
        return networkResponse;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // PISAHANNYA (JS, CSS, JSON, Font): Stale-While-Revalidate agar transisi halaman cepat (instan UI render) 
  // namun logic update-an baru terdownload di belakang layar
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => cache.put(e.request, networkResponse.clone()));
        }
        return networkResponse;
      }).catch(() => {});
      
      // Jika sudah ada cache, kembalikan itu (instan), tapi update cache di background
      return cachedResponse || fetchPromise;
    })
  );
});
