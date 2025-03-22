//@ts-check
/** @type {import('./types/use-state.ts').UseState} */
export const useState = (defaultState) => {
    let state = { ...defaultState};

    return {
        get: () => state,
        set: (update) => {
            return state = typeof update === 'function' ?
                update(state) :
                { ...state, ...update };
        }
    }
};
