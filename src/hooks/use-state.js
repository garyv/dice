//@ts-check
/** @type {import('./types/use-state.ts').UseState} */
export const useState = (defaultState) => {
    const state = defaultState;

    return {
        get: () => state,
        set: (delta) => {
            Object.assign(state, delta);
            return state;
        }
    }
};
