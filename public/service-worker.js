// public/service-worker.js
const CACHE_NAME = 'datafirst-cache-v1';
const API_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// API endpoints to cache
const API_URLS_TO_CACHE = ['/api/availability/next'];

// Install the service worker and cache initial resources
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker installed');
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  console.log('Service Worker activated');
});

// Handle fetch events - use stale-while-revalidate pattern for API calls
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Check if this is an API request we want to cache
  const isApiRequest = API_URLS_TO_CACHE.some((endpoint) => url.pathname.includes(endpoint));

  if (isApiRequest) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // Check if we have a cached response
          if (cachedResponse) {
            const cachedAt = new Date(cachedResponse.headers.get('cache-timestamp'));
            const now = new Date();

            // If cache is fresh, use it
            if (now.getTime() - cachedAt.getTime() < API_CACHE_TIME) {
              console.log('Using cached response for:', url.pathname);
              return cachedResponse;
            }
          }

          // Otherwise fetch new data
          console.log('Fetching fresh data for:', url.pathname);
          return fetch(event.request).then((response) => {
            if (response.ok) {
              // Clone the response before caching it
              const responseToCache = response.clone();

              // Add a timestamp header to the cached response
              const headers = new Headers(responseToCache.headers);
              headers.append('cache-timestamp', new Date().toISOString());

              // Create a new response with the added header
              const timestampedResponse = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers
              });

              // Store in cache
              cache.put(event.request, timestampedResponse);
            }
            return response;
          });
        });
      })
    );
  } else {
    // For non-API requests, use browser's default handling
    return;
  }
});
