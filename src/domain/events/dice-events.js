//@ts-check
/** @type {import('./types/dice-events').DiceEvents} */
export const diceEvents = {
    getAll: ({ cssSelector }) => document.querySelectorAll(cssSelector),

    dragStart: (dice, { clientX, clientY }) => {
        state.dragging = true;
        state.startX = clientX;
        state.startY = clientY;

        const transform = dice.style.transform;

        const rotateXMatch = transform.match(/rotateX\((\d+)deg\)/);
        const rotateYMatch = transform.match(/rotateY\((\d+)deg\)/);

        state.x = rotateXMatch ? parseInt(rotateXMatch[1], 10) : 0;
        state.y = rotateYMatch ? parseInt(rotateYMatch[1], 10) : 0;
    },

    drag: (dice, { clientX, clientY }) => {
        if (!state.dragging) return;

        dice.style.setProperty('--duration', '0');
        dice.style.setProperty('--opacity', 'var(--transparent');

        dice.style.transform = getRotation({
            x: state.x - (clientY - state.startY),
            y: state.y + (clientX - state.startX),
        });
    },

    roll: (dice, { spinDuration, ...transformOptions }) => {
        dice.style.setProperty('--duration', spinDuration);
        dice.style.setProperty('--opacity', '1');
        dice.style.transform = setRotation(transformOptions);
    },

    rollAll: ({ cssSelector, ...rollOptions }) => {
        if (!state.dragging) return;
        state.dragging = false;
        diceEvents.getAll({ cssSelector }).forEach((dice) => diceEvents.roll(dice, rollOptions));
    },

    start: ({
        cssSelector,
        parentSelector,
        addButtonSelector,
        min,
        max,
        removeButtonSelector,
        ...rollOptions
    }) => {
        startDiceRollingEvents({ cssSelector, parentSelector, rollOptions });

        startButtonEvents({
            cssSelector,
            parentSelector,
            addButtonSelector,
            min,
            max,
            removeButtonSelector,
            rollOptions,
        });
    },
};

const getRotation = ({ x, y }) => `rotateX(${x}deg) rotateY(${y}deg)`;

const state = {
    dragging: false,
    count: 1,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
};

const startDiceRollingEvents = ({ cssSelector, parentSelector, rollOptions }) => {
    // set up rolling and dragging dice
    diceEvents.getAll({ cssSelector }).forEach((dice) => {
        dice.addEventListener('pointerdown', (event) => {
            diceEvents.dragStart(dice, event);
        });

        dice.addEventListener('pointermove', (event) => {
            requestAnimationFrame(() => {
                diceEvents.drag(dice, event);
            });
        });
    });

    diceEvents.getAll({ cssSelector: parentSelector }).forEach((parent) => {
        parent.addEventListener('pointerup', () => {
            diceEvents.rollAll({ cssSelector, ...rollOptions });
        });

        parent.addEventListener('pointerleave', () => {
            diceEvents.rollAll({ cssSelector, ...rollOptions });
        });
    });
};

const startButtonEvents = ({
    cssSelector,
    parentSelector,
    addButtonSelector,
    min,
    max,
    removeButtonSelector,
    rollOptions,
}) => {
    if (state.diceElement) return;

    // set up adding and removing dice
    const diceElement = document.querySelector(cssSelector);
    const addButton = document.querySelector(addButtonSelector);
    const removeButton = document.querySelector(removeButtonSelector);
    if (!(addButton instanceof HTMLElement) || !(removeButton instanceof HTMLElement)) return;

    state.diceElement = diceElement.cloneNode(true);

    const updateCountOptions = {
        max,
        min,
        addButton,
        removeButton,
        parentSelector,
        cssSelector,
        rollOptions,
    };

    addButton.addEventListener('click', () => {
        updateCount(state.count + 1, updateCountOptions);
    });

    removeButton.addEventListener('click', () => {
        updateCount(state.count - 1, updateCountOptions);
    });
};

const updateCount = (
    newCount,
    { max, min, addButton, removeButton, parentSelector, cssSelector, rollOptions }
) => {
    const { diceElement, count } = state;
    if (newCount === count) return;
    if (newCount < min || newCount > max) return;
    if (!(diceElement instanceof HTMLElement)) return;

    const parent = document.querySelector(parentSelector);
    if (!(parent instanceof HTMLElement)) return;

    addButton.hidden = newCount === max;
    removeButton.hidden = newCount === min;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < newCount; i++) {
        fragment.appendChild(diceElement.cloneNode(true));
    }
    parent.innerHTML = '';
    parent.style.setProperty('--size', `${49 - newCount * 6}vmin`);
    parent.appendChild(fragment);
    state.count = newCount;
    startDiceRollingEvents({ cssSelector, parentSelector, rollOptions });
};

/** @param {import('./types/dice-events').TransformOptions} transformOptions */
const setRotation = ({ spinMax, spinStep, getRandomNumber }) => {
    const numberOptions = { start: 0, length: spinMax, step: spinStep };
    state.x = getRandomNumber(numberOptions);
    state.y = getRandomNumber(numberOptions);
    return getRotation(state);
};
