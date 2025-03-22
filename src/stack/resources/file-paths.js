//@ts-check
import { resolve } from 'path';

const mainPaths = {
    /** Output path for single page app */
    build: '../public/index.html',
    /** Base html layout */
    layout: 'views/layout/root.html',
    /** meta tags in head */
    meta: 'views/layout/meta.html',
    /** Base css styles */
    rootStyles: 'views/layout/root.css',
}

export const filePaths = {
    ...mainPaths,
    /** Dice configuration */
    diceConfig: 'models/dice-config.js',
    /** Dice business logic */
    diceEvents: 'events/dice-events.js',
    diceRotation: 'models/dice-rotation.js',
    diceRules: 'models/dice-rules.js',
    randomizer: 'models/randomizer.js',
    useEvents: 'hooks/use-events.js',
    useState: 'hooks/use-state.js',
    /** Dice html */
    dicePage: 'views/pages/dice.html',
    diceStyles: 'views/pages/dice.css',
    /** Dev script */
    hotReload: 'stack/resources/hot-reload.js',
    /** Cache client */
    cacheClient: 'stack/resources/cache-client.js',
    cacheEvents: 'stack/resources/cache-events.js',
    cacheWorker: 'stack/resources/cache-worker.js',
    cacheWorkerBuild: '../public/cache-worker.js',
    /** Dice icon */
    icon: 'views/images/dice.svg',
    iconBuild: '../public/dice.svg',
    icon180: 'views/images/dice_180.png',
    icon180Build: '../public/dice_180.png',
    manifest: 'stack/manifest.json',
    manifestBuild: '../public/manifest.json',
};

Object.keys(filePaths).forEach(name => {
    filePaths[name] = resolve(`src/${ filePaths[name] }`);
});
