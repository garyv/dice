/** process web requests */
type WebHandler = (request: Request, options?: { params?: Record<string, string> }) => Promise<Response>;

/** a web route with a path and a handler */
export type WebRoute = {
    path: RegExp;
    handler: WebHandler;
}

type WebSocketHandler = (websocket: WebSocket, request: Request) => Promise<void>;

/** a WebSocket route with a path and a handler */
export type WebSocketRoute = {
    path: RegExp;
    handler: WebSocketHandler;
}

export type WebRespond = (body?: string, options?: { status?: number, headers?: Record<string, string> }) => Response;

/** Web server with methods to create and manage routes */
export type WebServer = {
    /** creates a new web server instance */
    createServer: (defaultHandler?: WebHandler, options?: { errorHandler?: WebHandler, notFoundHandler?: WebHandler }) => {
        /** registers a GET route with the server */
        get: (path: string, handler: WebHandler) => void;
        /** registers a WebSocket route with the server */
        websocket: (path: string, handler: WebSocketHandler) => void;
        /** starts the web server on the specified port */
        start: (port?: number, callback?: (port?: number) => void) => void;
        /** creates a response object with the specified body and options */
        respond: WebRespond;
        // later...
        // post: (path: string, handler: WebHandler) => void;
        // put: (path: string, handler: WebHandler) => void;
        // delete: (path: string, handler: WebHandler) => void;
    };
}
