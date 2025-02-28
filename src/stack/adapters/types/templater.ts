import { Store } from './store';

type Variables = Record<string, string | number>;

export type Templater = {
    render(template: string | { toString(): string }, variables?: Variables): string;
    load(path: string, store: Store, variables?: Variables): Promise<string>;
    write(destinationPath: string, templatePath: string, store: Store, variables?: Variables): Promise<void>;
    loadJs(path: string, store: Store, variables?: Variables): Promise<string>;
    init<T extends Record<string, string>>(store: Store, filePaths: T): {
        load(path: keyof T, variables?: Variables): Promise<string>;
        loadJs(path: keyof T, variables?: Variables): Promise<string>;
        write(destinationPath: string, templatePath: keyof T, variables?: Record<string, any>): Promise<void>;
    };
}
