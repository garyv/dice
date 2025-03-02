export type Store = {
    copy(source: string, destination: string): Promise<void>;
    read(path: string, options?: BufferEncoding): Promise<string | Buffer>;
    write(path: string, data: string, options?: BufferEncoding): Promise<void>;
    watch(path: string, callback: () => void): void;
};
