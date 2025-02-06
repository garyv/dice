//@ts-check
/** 
 * Properties for 3d cube and animation 
 * 
 * @type {import('./types/dice-config').DiceConfig} 
 */
export const diceConfig = {
    title: 'Dice App',
    spinDuration: '0.62s',
    spinStep: 90,
    spinMax: 32,
    min: 1,
    max: 2,
    cssSelector: "[role='button']",
    htmlProps: "role='button' aria-label='Click to roll the dice'",
};
