export type Randomizer = {
    /** generates a random number based on the provided options */
    getRandomNumber: (options?: { start?: number, step?: number, length?: number }) => number;
};
