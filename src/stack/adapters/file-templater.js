//@ts-check

/** @type {import('./types/templater.ts').Templater} */
export const fileTemplater = {
    render: (template, variables = {}) =>
        template.toString()
            .replace(patterns.liquid, (_match, key) => 
                getValue(variables, key))
            .replace(patterns.slot, (_match, key, content) => 
                getValue(variables, key) || content),
    
    load: async (path, store, variables = {}) => {
        const template = await store.read(path, 'utf-8');
        return fileTemplater.render(template, variables);
    },

    loadJs: async (path, store, variables = {}) => 
        stripJs(
            await fileTemplater.load(path, store, variables)
        ),
    
    write: async (destinationPath, templatePath, store, variables = {}) => {
        const content = await fileTemplater.load(templatePath, store, variables);
        return await store.write(destinationPath, content, 'utf-8');
    },

    init: (store, filePaths) => ({
        load: (path, variables = {})  => 
            fileTemplater.load(filePaths[path], store, variables),
        loadJs: (path, variables = {}) => 
            fileTemplater.loadJs(filePaths[path], store, variables),
        write: (destinationPath, templatePath, variables = {}) =>
            fileTemplater.write(destinationPath, filePaths[templatePath], store, variables),
    })
}

function getValue(variables, key) {
    return variables[key] || '';
}

function stripJs(content) {
    return content
        .replace(patterns.comments, '')
        .replace(patterns.jsdocs, '')
        .replace(patterns.exports, '')
        .replace(patterns.imports, '');
}

const patterns = {
    liquid: /{{\s*([^{}\s]+)\s*}}/g,
    slot: /<slot\s+name=['"]([^'"]+)['"]\s*>(.*?)<\/slot>/gs,
    jsdocs: /^\s*\/\*\*[\s\S]+?\*\/\n?/gm,
    comments: /\/\/.*\n?/gm,
    exports: /^export\s+/gm,
    imports: /^import.*\n?/gm,
};
