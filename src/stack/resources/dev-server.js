//@ts-check

import { fileStore } from '../adapters/file-store.js';
import { fileTemplater } from '../adapters/file-templater.js';
import { nodeServer } from '../adapters/node-server.js';
import { filePaths } from './file-paths.js';

const { load } = fileTemplater.init(fileStore, filePaths);

const server = nodeServer.createServer();

server.get('/', async () => {
    const build = await load('build');
    return server.respond(build);
});

const hotReloadScript = await load('hotReload');

server.get('/hot-reload.js', async () =>
    server.respond(hotReloadScript, {
        headers: { 'Content-Type': 'application/javascript' },
    })
);

server.websocket('/live-reload', async (socket) => {
    fileStore.watch(filePaths.build, () => {
        socket.send('reload');
    });
});

server.start(8080);
