//@ts-check
const cacheName = 'client-cache-0-03';
const cachePaths = ['./'];

export const cacheEvents = {
    /** @returns {Promise<Cache>} */
    open: async () => {
        return await caches.open(cacheName);
    },

    /** add every path to the cache -  */
    add: async () => {
        const cache = await cacheEvents.open();
        cachePaths.forEach ( async (path) => {
            await cache.add(path);
        })
    },

    /** @param {Request} request */
    fetch: async (request) => {
        const cache = await cacheEvents.open();
        const cachedResponse = await cache.match(request);
        return cachedResponse || fetch(request);
    },

    /** request each path & update its cache if etag does not match */
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
