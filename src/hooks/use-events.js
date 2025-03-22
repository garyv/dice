/** @typedef {import('./types/use-events.ts').EventMap} */
/** @type {import('./types/use-events.ts').UseEvents<EventMap>} */
export const useEvents = () => {
    const listeners = {};

    return {
        on: (event, listener) => {
            if (!listeners[event]) {
                listeners[event] = [];
            }
            listeners[event].push(listener);
        },

        off: (event, listener) => {
            if (!listeners[event]) return;
            listeners[event] = listeners[event].filter((f) => f !== listener);
        },

        emit: async (event, ...args) => {
            if (!listeners[event]) return;
            await Promise.all(listeners[event].map((listener) => listener(...args)));
        },
    };
};
