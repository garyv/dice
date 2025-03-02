//@ts-check

import { promises, watch } from 'node:fs';

const { copyFile, readFile, writeFile } = promises;

/** @type {import('./types/store').Store} */
export const fileStore = {
    copy: copyFile,
    read: readFile,
    write: writeFile,
    watch,
}
