export type DiceConfig = {
    /** html title */
    title: string;
    /** animation length */
    spinDuration: string;
    /** degrees */
    spinStep: number;
    /** maximum number of spin steps per roll action */
    spinMax: number;
    /** quantiy of cubes */
    min: number;
    /** quantiy of cubes */
    max: number;
    cssSelector: string;
    parentSelector: string;
    htmlProps: string;
    parentProps: string;
    /** control dice quantity */
    removeButtonProps: string;
    addButtonProps: string;
    removeButtonSelector: string;
    addButtonSelector: string;
};
