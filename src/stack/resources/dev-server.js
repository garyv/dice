//@ts-check
import { fileStore as store } from '../adapters/file-store.js';
import { fileTemplater } from '../adapters/file-templater.js';
import { nodeServer as web } from '../adapters/node-server.js';
import { filePaths as paths } from './file-paths.js';

const { load } = fileTemplater.init(store, paths);
const cacheWorkerBuild = await load('cacheWorkerBuild');
const hotReload = await load('hotReload');
const manifestBuild = await load('manifestBuild');
const server = web.createServer();
const { get, respond } = server;

get('/', async () => {
    const build = await load('build');
    return respond(build);
});

get('/cache-worker.js', async () => 
    respond(cacheWorkerBuild, {
        headers: { 'Content-Type': 'application/javascript' },
    })
);

get('/dice.svg', async () => {
    const iconBuild = await load('iconBuild');
    return respond(iconBuild, {
        headers: { 'Content-Type': 'image/svg+xml' },
    })  
});

get('/hot-reload.js', async () =>
    respond(hotReload, {
        headers: { 'Content-Type': 'application/javascript' },
    })
);

get('/manifest.json', async () => 
    respond(manifestBuild, {
        headers: { 'Content-Type': 'application/json' }
    })
);

server.websocket('/live-reload', async (socket) => {
    store.watch(paths.build, () => {
        socket.send('reload');
    });
});

server.start(8080);
