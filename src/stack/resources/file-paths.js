//@ts-check
import { resolve } from 'path';

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
    diceStart: 'stack/resources/dice-client.js',
    randomizer: 'domain/models/randomizer.js',
    /** Dice html */
    dicePage: 'views/pages/dice.html',
    diceStyles: 'views/pages/dice.css',
    /** Dev script */
    hotReload: 'stack/resources/hot-reload.js',
};

Object.keys(filePaths).forEach(name => {
    filePaths[name] = resolve(`src/${ filePaths[name] }`);
});
