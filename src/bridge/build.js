import { fileTemplater } from './adapters/file-templater.js';
import { filePaths } from './adapters/file-paths.js';
import { fileStore } from './adapters/file-store.js';
import { diceConfig } from '../domain/models/dice-config.js';

console.log('Building dice page...');

const { load, loadJs } = fileTemplater;
const rootStyles = await load(filePaths.rootStyles, fileStore);
const diceStyles = await load(filePaths.diceStyles, fileStore);
const dicePage = await load(filePaths.dicePage, fileStore, diceConfig);
const diceConfigContent = await loadJs(filePaths.diceConfig, fileStore);
const randomizer = await loadJs(filePaths.randomizer, fileStore);
const diceEvents = await loadJs(filePaths.diceEvents, fileStore);
const diceResource = await loadJs(filePaths.diceResource, fileStore);

const html = await load(filePaths.layout, fileStore, {
    head: `<title>${diceConfig.title}</title>
<style>
${rootStyles}

${diceStyles}
</style>`
,
    main: `${dicePage}

<script>
${diceConfigContent}
${diceEvents}
${randomizer}
${diceResource}
</script>  
`
});

console.log(html);

fileStore.writeFile(filePaths.build, html);

console.log('Build complete.', filePaths.build);
