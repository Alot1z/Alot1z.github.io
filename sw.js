// Alot1z's Repository Wiki - Service Worker
// Provides offline functionality and PWA capabilities

const CACHE_NAME = 'alot1z-repo-wiki-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/src/css/style.css',
    '/src/css/components.css',
    '/src/js/repositories-data.js',
    '/src/js/app.js',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external resources (except CDN resources we want to cache)
    if (url.origin !== self.location.origin && !url.hostname.includes('cdn.jsdelivr.net')) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    console.log('Service Worker: Serving from cache:', request.url);
                    return response;
                }
                
                console.log('Service Worker: Fetching from network:', request.url);
                return fetch(request)
                    .then(response => {
                        // Cache successful responses
                        if (response.ok && urlsToCache.some(urlToCache => urlToCache.includes(url.pathname))) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(request, responseClone);
                                });
                        }
                        return response;
                    })
                    .catch(error => {
                        console.error('Service Worker: Fetch failed:', error);
                        
                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        
                        // Return a basic offline response for other requests
                        return new Response(
                            JSON.stringify({ 
                                error: 'Offline', 
                                message: 'This resource is not available offline' 
                            }),
                            {
                                status: 503,
                                statusText: 'Service Unavailable',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }
                        );
                    });
            })
    );
});

// Message event - handle messages from main thread
self.addEventListener('message', event => {
    console.log('Service Worker: Received message:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Push event - handle push notifications (if implemented in future)
self.addEventListener('push', event => {
    console.log('Service Worker: Push received:', event);
    
    const options = {
        body: event.data ? event.data.text() : 'New repository update available!',
        icon: '/static/icon-192.png',
        badge: '/static/badge-72.png',
        tag: 'repo-update',
        renotify: true
    };
    
    event.waitUntil(
        self.registration.showNotification('Alot1z\'s Repository Wiki', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});
