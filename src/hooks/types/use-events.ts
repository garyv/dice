/** @template T - Record of event names and listener functions */
export type EventEmitter<T extends EventMap> = {
    /** register an event listener */
    on<K extends keyof T>(event: K, listener: T[K]): void;
    /** remove an event listener */
    off<K extends keyof T>(event: K, listener: T[K]): void;
    /** emit a specific event */
    emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): Promise<void>;
}

export type EventMap = {
    [key: string]: (...args: any[]) => any;
}

export type UseEvents<T extends EventMap> = () => EventEmitter<T>;
