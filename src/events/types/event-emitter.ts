/** @template T - Record of event names and listener functions */
export type EventEmitter<T extends Record<string, (...args: any[]) => any>> = {
    /** map of event names to listener functions */
    listeners: Partial<{ [K in keyof T]: Array<T[K]> }>;
    /** register an event listener */
    on<K extends keyof T>(event: K, listener: T[K]): void;
    /** remove an event listener */
    off<K extends keyof T>(event: K, listener: T[K]): void;
    /** emit an event with specific arguments */
    emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): Promise<void>;
}
