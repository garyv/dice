import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { watch } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';

const filePath = path.resolve('public/index.html');
const hotReloadPath = path.resolve('src/stack/adapters/hot-reload.js');
const hotReloadScript = await readFile(hotReloadPath, 'utf-8');
    
const server = createServer(async (req, res) => {
  if (req.url === '/') {
    try {
      const data = await readFile(filePath, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  } else if (req.url === '/hot-reload.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(hotReloadScript);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Create WebSocket server for live reload
const wss = new WebSocketServer({ server });

watch(filePath, () => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('reload');
        }
    });
});

server.listen(8080, () => {
  console.log('Server listening on http://localhost:8080');
});

