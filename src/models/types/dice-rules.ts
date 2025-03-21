export type DiceRules = {
    /** dice size is based on quantity **/
    getSize: (count: number) => string;
    isValidCount: (count: number, min: number, max: number) => boolean;
};