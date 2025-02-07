export type FileStore = {
    readFile(path: string, options?: BufferEncoding): Promise<string | Buffer>;
    writeFile(path: string, data: string, options?: BufferEncoding): Promise<void>;
};