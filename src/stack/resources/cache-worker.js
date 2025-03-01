import { cacheEvents } from './cache-events.js';

self.addEventListener('install', event => {
    event.waitUntil(
        cacheEvents
          .add()
          .then(() => self.skipWaiting())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        cacheEvents.fetch(event.request)
    );

    if (event.request.url.endsWith('/')) {
        event.waitUntil(
            cacheEvents.update()
        )
    }
});

self.addEventListener('activate', event => {
    event.waitUntil(
        self.clients.claim()
    )
});
