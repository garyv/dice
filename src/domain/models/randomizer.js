//@ts-check
/** @type {import('./types/randomizer').Randomizer} */

export const randomizer = {
    getRandomNumber: ({ start = 1, step = 1, length = 6 } = {}) =>
        start + Math.floor(length * Math.random()) * step,
};