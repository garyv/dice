//@ts-check
/** @type {import('./types/dice-events').DiceEvents} */
export const diceEvents = {
    getAll: ({cssSelector}) =>  (
        document.querySelectorAll(cssSelector)
    ),

    roll: (dice, {spinDuration, ...transformOptions}) => {
        dice.style.setProperty('--duration', spinDuration);
        dice.style.transform = getTransform(transformOptions);
    },

    rollAll: ({cssSelector, ...rollOptions}) => {
        diceEvents.getAll({cssSelector}).forEach(dice => 
            diceEvents.roll(dice, rollOptions)
        );
    },

    start: ({cssSelector, ...rollOptions}) => {
        diceEvents.getAll({cssSelector}).forEach(dice => {
            dice.addEventListener('click', () => {
                diceEvents.rollAll({cssSelector, ...rollOptions})
            });
        });
    }
}

/** @param {import('./types/dice-events').TransformOptions} transformOptions */
const getTransform = ({spinMax, spinStep, getRandomNumber}) => {
    const numberOptions = { start: 0, length: spinMax, step: spinStep }; 

    return (
        `rotateX(${ 
            getRandomNumber(numberOptions) 
        }deg) rotateY(${ 
            getRandomNumber(numberOptions)
        }deg)`
    );
};