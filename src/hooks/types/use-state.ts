export type UseState = <T extends object>(defaultState: T) => {
    get: () => T,
    set: (update: Partial<T> | ((state: T) => T)) => T
}
