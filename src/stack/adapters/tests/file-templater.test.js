import { describe, expect, it, vi } from 'vitest';
import { fileTemplater } from '../file-templater.js';

const mockStore = {
    read: vi.fn(),
    write: vi.fn()
};

const template = 'Hello {{name}}';
const variables = { name: 'World' };

describe('fileTemplater', () => {
    describe('render', () => {
        it('should replace {{variables}}', () => {
            expect(
                fileTemplater.render(template, variables)
            ).toBe('Hello World');
        });

        it('should replace <slot> elements', () => {
            const template = 'Hi <slot name="name"></slot>';
            expect(
                fileTemplater.render(template, variables)
            ).toBe('Hi World');
        });
    });

    describe('load', () => {
        it('should load and render a template from a file', async () => {
            mockStore.read.mockResolvedValue(template);

            expect(
                await fileTemplater.load('/template/path', mockStore, variables)
            ).toBe('Hello World');
        });
    });

    describe('write', () => {
        it('should write rendered content to a file', async () => {
            mockStore.read.mockResolvedValue(template);
            mockStore.write.mockResolvedValue();

            await fileTemplater.write('/output/path', '/template/path', mockStore, variables);

            expect(mockStore.write).toHaveBeenCalledWith('/output/path', 'Hello World', 'utf-8');
        });
    });
});
