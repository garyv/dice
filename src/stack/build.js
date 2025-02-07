//@ts-check
import { fileTemplater } from './adapters/file-templater.js';
import { fileStore } from './adapters/file-store.js';
import { filePaths } from './resources/file-paths.js';
import { diceConfig } from '../domain/models/dice-config.js';

const { load, loadJs } = fileTemplater.init(fileStore, filePaths);

console.log('Building dice page...');

const rootStyles = await load('rootStyles');
const diceStyles = await load('diceStyles');
const dicePage = await load('dicePage', diceConfig);
const diceConfigContent = await loadJs('diceConfig');
const randomizer = await loadJs('randomizer');
const diceEvents = await loadJs('diceEvents');
const diceStart = await loadJs('diceStart');

const hotReload = process.argv.some(arg => arg  === '--hot-reload');

const html = await load('layout', {
    head: `<title>${diceConfig.title}</title>
<style>
${rootStyles}

${diceStyles}
</style>`,
    main: `${dicePage}

<script>
${diceConfigContent}
${diceEvents}
${randomizer}
${diceStart}
</script>  

${hotReload ? '<script src="/hot-reload.js"></script>' : ''}
`,
});

fileStore.writeFile(filePaths.build, html);

console.log('Build complete.', filePaths.build);
