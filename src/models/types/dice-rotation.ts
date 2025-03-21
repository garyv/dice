import type { Randomizer } from "./randomizer";

export type DiceRotation = {
    /** convert rotation numbers to a CSS transform string */
    formatRotation: (options: {rotateX: number; rotateY: number}) => string;
    /** get rotation based on mouse or touch event manually turning cube */
    getDragRotation: (event: PointerEvent, rotation: {rotateX: number; rotateY: number, startRotateX: number, startRotateY: number} ) => {rotateX: number; rotateY: number};
    /** generate randomized cube rotation numbers */
    getRandomRotation: (randomizer: Randomizer) => {rotateX: number; rotateY: number};
    /** parse numbers for rotation from a transform CSS string */
    readRotation: (transform: string) => {rotateX: number; rotateY: number};
};
