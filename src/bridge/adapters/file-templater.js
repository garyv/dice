//@ts-check

const patterns = {
    liquid: /{{\s*([^{}\s]+)\s*}}/g,
    slot: /<slot\s+name=['"]([^'"]+)['"]\s*>(.*?)<\/slot>/gs,
    jsdocs: /\/\*\*[\s\S]+?\*\/\n?/gm,
    comments: /\/\/.*\n?/gm,
    exports: /^export\s+/gm,
    imports: /^import.*\n?/gm,
};

/** @type {import('./types/templater.ts').Templater} */
export const fileTemplater = {
    render: (template, variables = {}) =>
        template.toString()
            .replace(patterns.liquid, (_match, key) => 
                getValue(variables, key))
            .replace(patterns.slot, (_match, key, content) => 
                getValue(variables, key) || content),
    
    load: async (path, fileStore, variables = {}) => {
        const template = await fileStore.readFile(path, 'utf-8');
        return fileTemplater.render(template, variables);
    },

    loadJs: async (path, fileStore, variables = {}) => 
        stripJs(
            await fileTemplater.load(path, fileStore, variables)
        ),
    
    write: async (destinationPath, templatePath, fileStore, variables = {}) => {
        const content = await fileTemplater.load(templatePath, fileStore, variables);
        return await fileStore.writeFile(destinationPath, content, 'utf-8');
    },   
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