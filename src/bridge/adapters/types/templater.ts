import { FileStore } from './file-store';

export type Templater = {
    render(template: string | { toString(): string }, variables?: Record<string, string>): string;
    load(path: string, fileStore: FileStore, variables?: Record<string, string>): Promise<string>;
    write(destinationPath: string, templatePath: string, fileStore: FileStore, variables?: Record<string, string>): Promise<void>;
    loadJs(path: string, fileStore: FileStore, variables?: Record<string, string>): Promise<string>;
}
