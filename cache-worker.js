
const cacheName = 'client-cache-0-03';
const cachePaths = ['./'];

const cacheEvents = {
    open: async () => {
        return await caches.open(cacheName);
    },
    add: async () => {
        const cache = await cacheEvents.open();
        cachePaths.forEach ( async (path) => {
            await cache.add(path);
        })
    },
    fetch: async (request) => {
        const cache = await cacheEvents.open();
        const cachedResponse = await cache.match(request);
        return cachedResponse || fetch(request);
    },
    update: async () => {
        const cache = await cacheEvents.open();
        cachePaths.forEach( async (path) => {
            const cachedResponse = await cache.match(path);
            if (!cachedResponse) return;
            const etag = cachedResponse.headers.get('etag');
            const response = await fetch(path, { method: 'HEAD' });
            console.log('cache update check in progress', { path, etag, response, cache });
            if (!response.ok) return;
            if (response.headers.get('etag') === etag) return;
            await cache.delete(path);
            await cache.add(path);
        })
    }
};


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

