// MIA Logistics Manager Service Worker
const CACHE_NAME = 'mia-logistics-v1.0.0';
const STATIC_CACHE_NAME = 'mia-logistics-static-v1.0.0';

// Assets to cache
const STATIC_ASSETS = [
    '/',
    '/static/css/main.css',
    '/static/js/main.js',
    '/manifest.json',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
            })
            .catch((error) => {
                console.error('Service Worker: Failed to cache static assets', error);
            })
    );

    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

    // Claim all clients
    self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip external requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise, fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache if not a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Cache the response
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return offline page if available
                        if (event.request.destination === 'document') {
                            return caches.match('/');
                        }
                    });
            })
    );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync triggered');
        event.waitUntil(
            // Add your background sync logic here
            Promise.resolve()
        );
    }
});

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');

    const options = {
        body: event.data ? event.data.text() : 'Bạn có thông báo mới từ MIA Logistics',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('MIA Logistics Manager', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('/')
    );
});

// Error handling
self.addEventListener('error', (event) => {
    console.error('Service Worker: Error occurred:', event.error);
});

// Unhandled rejection handling
self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker: Unhandled promise rejection:', event.reason);
});
