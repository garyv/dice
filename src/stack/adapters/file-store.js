//@ts-check

import { promises, watch } from 'node:fs';

const { readFile, writeFile } = promises;

/** @type {import('./types/file-store').FileStore} */
export const fileStore = {
    readFile,
    writeFile,
    watch,
}
