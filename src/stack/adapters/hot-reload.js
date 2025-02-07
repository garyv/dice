const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('message', ({data}) => {
    if (data !== 'reload') return;
    window.location.reload();
});
