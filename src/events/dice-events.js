//@ts-check
import { diceConfig } from '../models/dice-config.js';
import { readRotation, formatRotation, getDragRotation, getRandomRotation } from '../models/dice-rotation.js';
import { getSize, isValidCount } from '../models/dice-rules.js';
import { randomizer } from '../models/randomizer.js';
import { useState } from '../hooks/use-state.js';
import { useEvents } from '../hooks/use-events.js';

/** @typedef {import('./types/dice-event-map.ts').DiceEventMap} DiceEventMap */
/** @type {import('../hooks/types/use-events.ts').EventEmitter<DiceEventMap>} */
const {on, emit} = useEvents();

const diceState = useState({
    count: 1,
    dragging: false,
    rotateX: 0,
    rotateY: 0,
    startRotateX: 0,
    startRotateY: 0,
    diceElement: document.querySelector(diceConfig.cssSelector),
});

on('ready', () => {
    startDiceRollingEvents();
    startUpdateCountEvents();
});

on('dragStart', (dice, { clientX, clientY }) => {
    diceState.set({
        ...readRotation(dice.style.transform),
        dragging: true,
        startRotateX: clientX,
        startRotateY: clientY,
    });
});

on('dragMove', (dice, event) => {
    const state = diceState.get();
    if (!state.dragging) return;

    dice.style.setProperty('--duration', '0');
    dice.style.setProperty('--opacity', 'var(--transparent');

    dice.style.transform = formatRotation(
        getDragRotation(event, state)
    );
});

on('roll', (dice) => {
    dice.style.setProperty('--duration', diceConfig.spinDuration);
    dice.style.setProperty('--opacity', '1');
    diceState.set({
        ...getRandomRotation(randomizer)
    });
    dice.style.transform = formatRotation(diceState.get());
});

on('rollAll', () => {
    if (!diceState.get().dragging) return;
    diceState.set({dragging : false});
    getAll().forEach((dice) => emit('roll', dice));
});

const startDiceRollingEvents = () => {
    // set up rolling and dragging dice
    getAll().forEach((dice) => {
        dice.addEventListener('pointerdown', (event) => {
            emit('dragStart', dice, event);
        });

        const onPointerMove = debounce( (event) => {
            emit('dragMove', dice, event);
        })

        dice.addEventListener('pointermove', (event) => {
            onPointerMove(event);
        });
    });

    getAll({ cssSelector: diceConfig.parentSelector }).forEach((parent) => {
        parent.addEventListener('pointerup', () => {
            emit('rollAll');
        });

        parent.addEventListener('pointerleave', () => {
            emit('rollAll');
        });
    });
};

const startUpdateCountEvents = () => {
    const { cssSelector, addButtonSelector, removeButtonSelector, parentSelector } = diceConfig;

    // selecting ui for adding and removing dice
    const elements = [cssSelector, addButtonSelector, removeButtonSelector, parentSelector].map(cssSelector => getAll({cssSelector})[0]);
    const [diceElement, addButton, removeButton, parent] = elements;
    // copy dice element to state to use later as a template for more dice
    const clonedElement = diceElement.cloneNode(true);
    if (!(clonedElement instanceof HTMLElement)) throw NoDiceError();

    diceState.set({
        diceElement: clonedElement
    })

    addButton.addEventListener('click', () => {
        updateCount(diceState.get().count + 1, { addButton, removeButton, parent });
    });

    removeButton.addEventListener('click', () => {
        updateCount(diceState.get().count - 1, { addButton, removeButton, parent });
    });
};

const updateCount = (newCount, { addButton, removeButton, parent }) => {
    const { diceElement, count } = diceState.get();
    const { min, max } = diceConfig;
    if (!isValidCount(count, min, max)) return;
    if (!diceElement) throw NoDiceError();

    addButton.hidden = newCount >= max;
    removeButton.hidden = newCount <= min;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < newCount; i++) {
        fragment.appendChild(diceElement.cloneNode(true));
    }
    parent.innerHTML = '';
    parent.style.setProperty('--size', getSize(newCount));
    parent.appendChild(fragment);
    diceState.set({ count: newCount });
    startDiceRollingEvents();
};

const NoDiceError = (name='Dice') => new TypeError(`${name} missing on page`);

const getAll = ({ cssSelector } = { cssSelector: diceConfig.cssSelector }) => {
    const all = [...document.querySelectorAll(cssSelector)];
    if (!all.every((element) => element instanceof HTMLElement)) {
        throw NoDiceError(cssSelector);
    }
    return all;
}    

const debounce = (callback) => {
    let pending = false;
    let lastArgs;
    
    return (...args) => {
        lastArgs = args;
        if (pending) return;

        return requestAnimationFrame(() => {
            callback(...lastArgs);
            pending = false;
        })
    }
}

// init page
document.addEventListener('DOMContentLoaded', () => {
    emit('ready');
});
