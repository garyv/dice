//@ts-check
import { diceConfig } from '../models/dice-config.js';
import { readRotation, formatRotation, getDragRotation, getRandomRotation } from '../models/dice-rotation.js';
import { getSize, isValidCount } from '../models/dice-rules.js';
import { randomizer } from '../models/randomizer.js';

/** @typedef {import('./types/dice-event-map.ts').DiceEventMap} DiceEventMap */
/** @type {import('./types/event-emitter.ts').EventEmitter<DiceEventMap>} */
export const diceEvents = {
    listeners: {},

    on(event, listener) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    },

    off(event, listener) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter((f) => f !== listener);
    },

    async emit(event, ...args) {
        if (!this.listeners[event]) return;
        await Promise.all(this.listeners[event].map((listener) => listener(...args)));
    },
};

let state = {
    count: 1,
    dragging: false,
    rotateX: 0,
    rotateY: 0,
    startRotateX: 0,
    startRotateY: 0,
};

diceEvents.on('ready', () => {
    startDiceRollingEvents();
    startUpdateCountEvents();
});

diceEvents.on('dragStart', (dice, { clientX, clientY }) => {
    state = {
        ...state,
        ...readRotation(dice.style.transform),
        dragging: true,
        startRotateX: clientX,
        startRotateY: clientY,
    };
});

diceEvents.on('dragMove', (dice, event) => {
    if (!state.dragging) return;

    dice.style.setProperty('--duration', '0');
    dice.style.setProperty('--opacity', 'var(--transparent');

    dice.style.transform = formatRotation(
        getDragRotation(event, state)
    );
});

diceEvents.on('roll', (dice) => {
    dice.style.setProperty('--duration', diceConfig.spinDuration);
    dice.style.setProperty('--opacity', '1');
    state = {
        ...state,
        ...getRandomRotation(randomizer)
    };
    dice.style.transform = formatRotation(state);
});

diceEvents.on('rollAll', () => {
    if (!state.dragging) return;
    state.dragging = false;
    getAll().forEach((dice) => diceEvents.emit('roll', dice));
});

const startDiceRollingEvents = () => {
    // set up rolling and dragging dice
    getAll().forEach((dice) => {
        dice.addEventListener('pointerdown', (event) => {
            diceEvents.emit('dragStart', dice, event);
        });

        dice.addEventListener('pointermove', (event) => {
            requestAnimationFrame(() => {
                diceEvents.emit('dragMove', dice, event);
            });
        });
    });

    getAll({ cssSelector: diceConfig.parentSelector }).forEach((parent) => {
        parent.addEventListener('pointerup', () => {
            diceEvents.emit('rollAll');
        });

        parent.addEventListener('pointerleave', () => {
            diceEvents.emit('rollAll');
        });
    });
};

const startUpdateCountEvents = () => {
    const { cssSelector, addButtonSelector, removeButtonSelector, parentSelector } = diceConfig;

    if (state.diceElement) return;

    // selecting ui for adding and removeing dice
    const elements = [cssSelector, addButtonSelector, removeButtonSelector, parentSelector].map(selector => document.querySelector(selector));
    if (!elements.every((element) => element instanceof HTMLElement)) return;
    const [diceElement, addButton, removeButton, parent] = elements;

    // copy dice element to state to use later as a template for more dice
    state.diceElement = diceElement.cloneNode(true);

    addButton.addEventListener('click', () => {
        updateCount(state.count + 1, { addButton, removeButton, parent });
    });

    removeButton.addEventListener('click', () => {
        updateCount(state.count - 1, { addButton, removeButton, parent });
    });
};

const updateCount = (newCount, { addButton, removeButton, parent }) => {
    const { diceElement, count } = state;
    const { min, max } = diceConfig;
    if (!isValidCount(count, min, max)) return;

    addButton.hidden = newCount >= max;
    removeButton.hidden = newCount <= min;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < newCount; i++) {
        fragment.appendChild(diceElement.cloneNode(true));
    }
    parent.innerHTML = '';
    parent.style.setProperty('--size', getSize(newCount));
    parent.appendChild(fragment);
    state.count = newCount;
    startDiceRollingEvents();
};

/** @return {NodeListOf<HTMLElement>}  */
const getAll = ({ cssSelector } = { cssSelector: diceConfig.cssSelector }) =>
    document.querySelectorAll(cssSelector);

// init page
document.addEventListener('DOMContentLoaded', () => {
    diceEvents.emit('ready');
});
