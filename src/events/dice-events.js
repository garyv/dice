//@ts-check
import { diceConfig } from '../models/dice-config.js';
import {
    readRotation,
    formatRotation,
    getDragRotation,
    getRandomRotation,
} from '../models/dice-rotation.js';
import { getSize, isValidCount } from '../models/dice-rules.js';
import { randomizer } from '../models/randomizer.js';
import { useDebounced } from '../hooks/use-debounced.js';
import { useEvents } from '../hooks/use-events.js';
import { useState } from '../hooks/use-state.js';

/** @typedef {import('./types/dice-event-map.ts').DiceEventMap} DiceEventMap */
/** @type {import('../hooks/types/use-events.ts').EventEmitter<DiceEventMap>} */
const { on, emit } = useEvents();

document.addEventListener('DOMContentLoaded', () => emit('ready'));

on('ready', () => {
    startDiceRollingEvents();

    const { addButton, removeButton, parent } = getDiceElements();

    addButton.addEventListener('click', () => {
        updateCount(diceState.get().count + 1, { addButton, removeButton, parent });
    });

    removeButton.addEventListener('click', () => {
        updateCount(diceState.get().count - 1, { addButton, removeButton, parent });
    });
});

const diceState = useState({
    count: 1,
    dragging: false,
    originX: 0,
    originY: 0,
    rotateX: 0,
    rotateY: 0,
    diceElement: document.querySelector(diceConfig.cssSelector),
    isFlipped: 1,
});

/** @return all matching HTML Elements for the given selector */
const getAll = ({ cssSelector = diceConfig.cssSelector } = {}) => {
    const elements = [...document.querySelectorAll(cssSelector)];
    if (!elements.length || !elements.every((el) => el instanceof HTMLElement)) {
        throw new TypeError(`No HTML Elements found for ${cssSelector}`);
    }
    return elements;
};

on('roll', (dice) => {
    dice.style.setProperty('--duration', diceConfig.spinDuration);
    dice.style.setProperty('--opacity', '1');
    diceState.set(getRandomRotation(randomizer));
    dice.style.transform = formatRotation(diceState.get());
});

on('rollAll', () => {
    if (!diceState.get().dragging) return;
    diceState.set({ dragging: false });
    getAll().forEach((dice) => emit('roll', dice));
});

const startDiceRollingEvents = () => {
    getAll().forEach((dice) => {
        dice.addEventListener('pointerdown', (event) => emit('dragStart', dice, event));
        const onPointerMove = useDebounced((event) => emit('dragMove', dice, event));
        dice.addEventListener('pointermove', onPointerMove);
    });

    getAll({ cssSelector: diceConfig.parentSelector }).forEach((parent) => {
        ['pointerup', 'pointerleave'].forEach((event) =>
            parent.addEventListener(event, () => emit('rollAll'))
        );
    });
};

on('dragStart', (dice, { clientX: originX, clientY: originY, target }) => {
    const { rotateX, rotateY } = readRotation(dice.style.transform);
    diceState.set({
        rotateX,
        rotateY,
        dragging: true,
        originX,
        originY,
        isFlipped: rotateX % 360 >= 180 ? -1 : 1,
    });
});

on('dragMove', (dice, event) => {
    const state = diceState.get();
    if (!state.dragging) return;
    dice.style.setProperty('--duration', '0');
    dice.style.setProperty('--opacity', 'var(--transparent');
    dice.style.transform = formatRotation(getDragRotation(event, state));
});

const getDiceElements = () => {
    const { cssSelector, addButtonSelector, removeButtonSelector, parentSelector } = diceConfig;
    const elements = [cssSelector, addButtonSelector, removeButtonSelector, parentSelector].map(
        (cssSelector) => getAll({ cssSelector })[0]
    );
    const [diceElement, addButton, removeButton, parent] = elements;

    const diceTemplate = diceElement.cloneNode(true);
    if (!(diceTemplate instanceof HTMLElement)) throw new TypeError('No Dice');
    diceState.set({ diceElement: diceTemplate });
    return { addButton, removeButton, parent };
};

const updateCount = (newCount, { addButton, removeButton, parent }) => {
    const { diceElement } = diceState.get();
    const { min, max } = diceConfig;
    if (!isValidCount(newCount, min, max) || !diceElement) return;

    addButton.hidden = newCount >= max;
    removeButton.hidden = newCount <= min;

    const fragment = document.createDocumentFragment();
    Array.from({ length: newCount }, () => {
        fragment.appendChild(diceElement.cloneNode(true));
    });
    parent.innerHTML = '';
    parent.style.setProperty('--size', getSize(newCount));
    parent.appendChild(fragment);
    diceState.set({ count: newCount });
    startDiceRollingEvents();
};
