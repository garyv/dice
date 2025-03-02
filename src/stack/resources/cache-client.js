window.addEventListener('load', () => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('./cache-worker.js')
});
