import { diceConfig } from './dice-config.js';

/** @type {import('./types/dice-rotation.ts').DiceRotation} */
export const diceRotation = {
    formatRotation: ({ rotateX, rotateY }) =>
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,

    getDragRotation({clientX, clientY}, { rotateX, rotateY, startRotateX, startRotateY}) {
        const deltaX = clientX - startRotateX;
        const deltaY = clientY - startRotateY;
        return {
            rotateX: rotateX - deltaY,
            rotateY: rotateY + deltaX,
        };
    },

    getRandomRotation({getRandomNumber}) {
        const randomNumberOptions = { start: 0, length: diceConfig.spinMax, step: diceConfig.spinStep };
        return {
            rotateX: getRandomNumber(randomNumberOptions),
            rotateY: getRandomNumber(randomNumberOptions),
        };
    },

    readRotation(transform) {
        const rotateXMatch = transform.match(/rotateX\(([-\d.]+)deg\)/);
        const rotateYMatch = transform.match(/rotateY\(([-\d.]+)deg\)/);
        return {
            rotateX: rotateXMatch ? parseFloat(rotateXMatch[1]) : 0,
            rotateY: rotateYMatch ? parseFloat(rotateYMatch[1]) : 0,
        };
    },
};

export const { readRotation, formatRotation, getDragRotation, getRandomRotation } = diceRotation;