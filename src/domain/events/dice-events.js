//@ts-check
/** @type {import('./types/dice-events').DiceEvents} */
export const diceEvents = {
    getAll: ({cssSelector}) =>  (
        document.querySelectorAll(cssSelector)
    ),

    dragStart: ({ clientX, clientY }) => {
        state.dragging = true;
        state.startX = clientX;
        state.startY = clientY; 
    },

    drag: (dice, { clientX, clientY }) => {
        if (!state.dragging) return;

        dice.style.setProperty('--duration', '0');
        dice.style.setProperty('--opacity', 'var(--transparent');

        dice.style.transform = getRotation({
            x: state.x - (clientY - state.startY),
            y: state.y + (clientX - state.startX)
        });
    },

    roll: (dice, {spinDuration, ...transformOptions}) => {
        dice.style.setProperty('--duration', spinDuration);
        dice.style.setProperty('--opacity', '1');
        dice.style.transform = setRotation(transformOptions);
    },

    rollAll: ({cssSelector, ...rollOptions}) => {
        if (!state.dragging) return;
        state.dragging = false;
        diceEvents.getAll({cssSelector}).forEach(dice => 
            diceEvents.roll(dice, rollOptions)
        );
    },

    start: ({cssSelector, parentSelector, ...rollOptions}) => {

        diceEvents.getAll({cssSelector}).forEach(dice => {
            dice.addEventListener('pointerdown', diceEvents.dragStart);
            
            dice.addEventListener('pointermove', (event) => {
                requestAnimationFrame(() => {
                    diceEvents.drag(dice, event);
                });
            });
        });

        diceEvents.getAll({cssSelector: parentSelector}).forEach(parent => {
            parent.addEventListener('pointerup', () => {
                diceEvents.rollAll({cssSelector, ...rollOptions})
            });

            parent.addEventListener('pointerleave', () => {
                diceEvents.rollAll({cssSelector, ...rollOptions})
            });
        });
    },
}

const getRotation = ({ x, y }) =>  `rotateX(${ x }deg) rotateY(${ y }deg)`;

const state = {
    dragging: false,
    startX: 0,
    startY: 0,  
    x: 0,
    y: 0,
};

/** @param {import('./types/dice-events').TransformOptions} transformOptions */
const setRotation = ({spinMax, spinStep, getRandomNumber}) => {
    const numberOptions = { start: 0, length: spinMax, step: spinStep }; 
    state.x = getRandomNumber(numberOptions);
    state.y = getRandomNumber(numberOptions);
    return getRotation(state);
};
