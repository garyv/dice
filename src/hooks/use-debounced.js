//@ts-check
/** @param {Function} callback */
export const useDebounced = (callback) => {
    let pending = false;
    let lastArgs;
    
    return (...args) => {
        lastArgs = args;
        if (pending) return;

        return requestAnimationFrame(() => {
            callback(...lastArgs);
            pending = false;
        })
    }
}
