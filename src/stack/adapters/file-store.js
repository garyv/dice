//@ts-check

import { promises, watch } from 'node:fs';

const { readFile, writeFile } = promises;

/** @type {import('./types/store').Store} */
export const fileStore = {
    read: readFile,
    write: writeFile,
    watch,
}
