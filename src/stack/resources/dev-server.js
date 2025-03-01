//@ts-check
import { fileStore as store } from '../adapters/file-store.js';
import { fileTemplater } from '../adapters/file-templater.js';
import { nodeServer as web } from '../adapters/node-server.js';
import { filePaths as paths } from './file-paths.js';

const { load } = fileTemplater.init(store, paths);
const hotReload = await load('hotReload');
const cacheWorkerBuild = await load('cacheWorkerBuild');
const server = web.createServer();
const { get, respond } = server;

get('/', async () => {
    const build = await load('build');
    return respond(build);
});

get('/hot-reload.js', async () =>
    respond(hotReload, {
        headers: { 'Content-Type': 'application/javascript' },
    })
);

get('/cache-worker.js', async () => 
    respond(cacheWorkerBuild, {
        headers: { 'Content-Type': 'application/javascript' },
    })
);

server.websocket('/live-reload', async (socket) => {
    store.watch(paths.build, () => {
        socket.send('reload');
    });
});

server.start(8080);
