// @ts-check

import { createServer } from 'http';
import { WebSocketServer } from 'ws';

/** @type WebServer */
export const nodeServer = {
    createServer(
        defaultHandler,
        { errorHandler = defaultErrorHandler, notFoundHandler = defaultNotFoundHandler } = {}
    ) {
        /** @type {WebRoute[]} */
        const routes = [];

        if (defaultHandler) {
            routes.push({ path: /.*/, handler: defaultHandler });
        }

        const nodeServer = createServer(async (nodeRequest, nodeResponse) => {
            const request = formatRequest(nodeRequest);
            const requestPath = nodeRequest.url ?? '';
            const matchedRoute = routes.find(({ path }) => path.test(requestPath));
            
            let response;
            if (!matchedRoute) {
                response = await notFoundHandler(request);
                return await sendResponse(response, nodeResponse);
            }

            try {
                response = await matchedRoute.handler(request);
            } catch (err) {
                response = await errorHandler(err);
            }
            await sendResponse(response, nodeResponse);
        });

        /** @type {WebSocketRoute[]} */
        const wsRoutes = [];
        const socketServer = new WebSocketServer({ server: nodeServer });

        socketServer.on('connection', (socket, nodeRequest) => {
            const requestPath = nodeRequest.url ?? '';
            const matchedRoute = wsRoutes.find((route) => route.path.test(requestPath));
            if (!matchedRoute) return socket.close();

            matchedRoute.handler(socket, nodeRequest);
        });

        const server = {
            get: (path, handler) => {
                const { pattern } = pathToPattern(path);
                routes.push({ path: pattern, handler });
                return server;
            },
            respond,
            start: (port = 3000, callback = defaultStartCallback) => {
                nodeServer.listen(port);
                callback(port);
            },
            websocket: (path, handler) => {
                const { pattern } = pathToPattern(path);
                wsRoutes.push({ path: pattern, handler });
                return server;
            },
        };
        return server;
    },
};

const pathToPattern = (path) => {
    const params = {}; // later... extract :params from path. or wait for native 'URL Pattern API' to land 
    return { pattern: new RegExp(`^${path}$`), params };
};

const defaultErrorHandler = async (err) => {
    console.error(err);
    return respond('Internal Server Error', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
    });
};

const defaultNotFoundHandler = async () =>
    respond('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain' } });

const defaultStartCallback = (port) => {
    console.log(`Server running at http://localhost:${port}`);
};

/** @param {IncomingMessage} nodeRequest */
const getFullUrl = (nodeRequest) => {
    const { headers, url } = nodeRequest;
    return `http://${headers.host}${url}`;
}

/** @param {IncomingMessage} nodeRequest */
const formatRequest = (nodeRequest) => new Request(getFullUrl(nodeRequest), nodeRequest);

/** @type {WebRespond} */
const respond = (body, { status = 200, headers = { 'Content-Type': 'text/html' } } = {}) =>
    new Response(body, { status, headers });

/** @param {Response} response @param {ServerResponse} nodeResponse */
const sendResponse = async (response, nodeResponse) => {
    nodeResponse.writeHead(response.status, Object.fromEntries(response.headers));
    nodeResponse.end(response.body ? await response.text() : undefined);
};

/**
 * @typedef {import('./types/web-server.ts').WebServer} WebServer
 * @typedef {import('./types/web-server.ts').WebRoute} WebRoute
 * @typedef {import('./types/web-server.ts').WebSocketRoute} WebSocketRoute
 * @typedef {import('./types/web-server.ts').WebRespond} WebRespond
 * @typedef {import('http').ServerResponse} ServerResponse 
 * @typedef {import('http').IncomingMessage} IncomingMessage 
 **/
