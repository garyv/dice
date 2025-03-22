export type UseState = <T extends object>(defaultState: T) => {
    get: () => T,
    set: (delta: Partial<T>) => T
}
