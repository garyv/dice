//@ts-check
import { pathFinder } from '../adapters/path-finder.js';

const mainPaths = {
    /** Output path file single page app */
    build: '../public/index.html',
    /** Base html layout */
    layout: 'views/layout/root.html',
    /** Base css styles */
    rootStyles: 'views/layout/root.css',
}

export const filePaths = {
    ...mainPaths,
    /** Dice configuration */
    diceConfig: 'domain/models/dice-config.js',
    diceEvents: 'domain/events/dice-events.js',
    diceStart: 'stack/resources/dice.js',
    randomizer: 'domain/models/randomizer.js',
    /** Dice html */
    dicePage: 'views/pages/dice.html',
    diceStyles: 'views/pages/dice.css',
};

pathFinder.update(filePaths);
