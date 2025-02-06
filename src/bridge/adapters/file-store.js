//@ts-check

import { promises } from 'node:fs';

/** @type {import('./types/file-store').FileStore} */
export const fileStore = promises;
