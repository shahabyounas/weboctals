// Service Worker for WebOctals - Performance & Caching

const CACHE_NAME = 'weboctals-v1.0.0';
const STATIC_CACHE_NAME = 'weboctals-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'weboctals-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/css/blog.css',
    '/assets/js/main.js',
    '/blog/index.html',
    '/blog/ai-agents-future-business-automation.html',
    // Add more critical files as needed
];

// Files that can be cached dynamically
const DYNAMIC_CACHE_URLS = [
    'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js',
    'https://unpkg.com/aos@2.3.1/dist/aos.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap'
];

// Install event - cache static files
// self.addEventListener('install', (event) => {
//     console.log('Service Worker: Installing...');
    
//     event.waitUntil(
//         caches.open(STATIC_CACHE_NAME)
//             .then((cache) => {
//                 console.log('Service Worker: Caching static files');
//                 return cache.addAll(STATIC_FILES);
//             })
//             .then(() => {
//                 console.log('Service Worker: Static files cached successfully');
//                 return self.skipWaiting();
//             })
//             .catch((error) => {
//                 console.error('Service Worker: Error caching static files', error);
//             })
//     );
// });

// // Activate event - clean up old caches
// self.addEventListener('activate', (event) => {
//     console.log('Service Worker: Activating...');
    
//     event.waitUntil(
//         caches.keys()
//             .then((cacheNames) => {
//                 return Promise.all(
//                     cacheNames.map((cacheName) => {
//                         if (cacheName !== STATIC_CACHE_NAME && 
//                             cacheName !== DYNAMIC_CACHE_NAME) {
//                             console.log('Service Worker: Deleting old cache', cacheName);
//                             return caches.delete(cacheName);
//                         }
//                     })
//                 );
//             })
//             .then(() => {
//                 console.log('Service Worker: Activated successfully');
//                 return self.clients.claim();
//             })
//     );
// });

// Fetch event - serve files from cache or network
// self.addEventListener('fetch', (event) => {
//     const { request } = event;
//     const url = new URL(request.url);
    
//     // Skip non-GET requests
//     if (request.method !== 'GET') {
//         return;
//     }
    
//     // Skip cross-origin requests that aren't in our dynamic cache list
//     if (url.origin !== location.origin && 
//         !DYNAMIC_CACHE_URLS.some(dynamicUrl => request.url.includes(dynamicUrl))) {
//         return;
//     }
    
//     event.respondWith(
//         caches.match(request)
//             .then((cachedResponse) => {
//                 // Return cached version if available
//                 if (cachedResponse) {
//                     console.log('Service Worker: Serving from cache', request.url);
//                     return cachedResponse;
//                 }
                
//                 // Fetch from network and cache the response
//                 return fetch(request)
//                     .then((networkResponse) => {
//                         // Only cache successful responses
//                         if (networkResponse.status === 200) {
//                             const responseClone = networkResponse.clone();
                            
//                             // Determine which cache to use
//                             const cacheName = STATIC_FILES.includes(url.pathname) || 
//                                             url.pathname === '/' ? 
//                                             STATIC_CACHE_NAME : DYNAMIC_CACHE_NAME;
                            
//                             caches.open(cacheName)
//                                 .then((cache) => {
//                                     console.log('Service Worker: Caching new resource', request.url);
//                                     cache.put(request, responseClone);
//                                 });
//                         }
                        
//                         return networkResponse;
//                     })
//                     .catch((error) => {
//                         console.error('Service Worker: Fetch failed', error);
                        
//                         // Return offline page for navigation requests
//                         if (request.destination === 'document') {
//                             return caches.match('/offline.html');
//                         }
                        
//                         // Return cached version if available (stale-while-revalidate)
//                         return caches.match(request);
//                     });
//             })
//     );
// });

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
    
    if (event.tag === 'newsletter-sync') {
        event.waitUntil(syncNewsletterForm());
    }
});

// Sync contact form submissions when back online
async function syncContactForm() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        const requests = await cache.keys();
        
        for (const request of requests) {
            if (request.url.includes('/contact') && request.method === 'POST') {
                const response = await fetch(request);
                if (response.ok) {
                    await cache.delete(request);
                    console.log('Service Worker: Contact form synced successfully');
                }
            }
        }
    } catch (error) {
        console.error('Service Worker: Error syncing contact form', error);
    }
}

// Sync newsletter subscriptions when back online
async function syncNewsletterForm() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        const requests = await cache.keys();
        
        for (const request of requests) {
            if (request.url.includes('/newsletter') && request.method === 'POST') {
                const response = await fetch(request);
                if (response.ok) {
                    await cache.delete(request);
                    console.log('Service Worker: Newsletter subscription synced successfully');
                }
            }
        }
    } catch (error) {
        console.error('Service Worker: Error syncing newsletter subscription', error);
    }
}

// Push notification event
self.addEventListener('push', (event) => {
    if (!event.data) {
        return;
    }
    
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/assets/images/icon-192.png',
        badge: '/assets/images/badge-72.png',
        tag: 'weboctals-notification',
        actions: [
            {
                action: 'view',
                title: 'View',
                icon: '/assets/images/action-view.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/images/action-close.png'
            }
        ],
        vibrate: [200, 100, 200],
        requireInteraction: true
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Handle updates
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    switch (event.tag) {
        case 'update-blog-cache':
            event.waitUntil(updateBlogCache());
            break;
        case 'cleanup-cache':
            event.waitUntil(cleanupCache());
            break;
    }
});

// Update blog cache periodically
async function updateBlogCache() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        const blogUrls = [
            '/blog/',
            '/blog/ai-agents-future-business-automation.html'
            // Add more blog URLs as needed
        ];
        
        for (const url of blogUrls) {
            const response = await fetch(url);
            if (response.ok) {
                await cache.put(url, response);
                console.log('Service Worker: Updated blog cache for', url);
            }
        }
    } catch (error) {
        console.error('Service Worker: Error updating blog cache', error);
    }
}

// Clean up old cache entries
async function cleanupCache() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        const requests = await cache.keys();
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const dateHeader = response.headers.get('date');
                if (dateHeader) {
                    const responseDate = new Date(dateHeader).getTime();
                    if (now - responseDate > maxAge) {
                        await cache.delete(request);
                        console.log('Service Worker: Cleaned up old cache entry', request.url);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Service Worker: Error cleaning up cache', error);
    }
}