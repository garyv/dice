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
    max: 6,
    cssSelector: "[role='button']",
    htmlProps: "role='button' aria-label='Click to roll the dice'",
    parentSelector: "[role='region']",
    parentProps: "role='region' aria-label='Dice container'",
    addButtonSelector: '#add',
    addButtonProps: "id='add' aria-label='Add a die'",
    removeButtonSelector: '#remove',
    removeButtonProps: "id='remove' aria-label='Remove one die'",
};
