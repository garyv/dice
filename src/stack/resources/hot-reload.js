const socket = new WebSocket('ws://localhost:8080/live-reload');

socket.addEventListener('message', ({data}) => {
    if (data !== 'reload') return;
    window.location.reload();
});
