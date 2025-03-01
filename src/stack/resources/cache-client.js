window.addEventListener('load', () => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('./cache-worker.js')
        .then((registration) => {
            console.log('Service Worker registered successfully with scope:', registration.scope);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
});

