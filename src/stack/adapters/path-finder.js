//@ts-check
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const currentPath = dirname(fileURLToPath(import.meta.url));
const root = join(currentPath, '../../');

export const pathFinder = {
    /** join file paths to root folder @param Record<string, string> */
    update(filePaths) {        
        Object.keys(filePaths).forEach(name => {
            filePaths[name] = join(root, filePaths[name]);
        });
    },
}
