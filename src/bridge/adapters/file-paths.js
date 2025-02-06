//@ts-check
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const currentPath = dirname(fileURLToPath(import.meta.url));
const root = join(currentPath, '../../');

/** @type {import('./types/file-paths.ts').FilePaths} */
export const filePaths = Object.fromEntries(
    Object.entries({
        layout: 'views/layout/root.html',
        rootStyles: 'views/layout/root.css',
        dicePage: 'views/pages/dice.html',
        diceStyles: 'views/pages/dice.css',
        diceEvents: 'domain/events/dice-events.js',
        diceConfig: 'domain/models/dice-config.js',
        randomizer: 'domain/models/randomizer.js',
        diceResource: 'bridge/resources/dice-resource.js',
        build: '../public/index.html',
        root,
    }).map(([fileKey, path]) => [
        fileKey, 
        join(root, path)
    ])
);
