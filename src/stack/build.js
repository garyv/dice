//@ts-check
import { fileTemplater } from './adapters/file-templater.js';
import { fileStore } from './adapters/file-store.js';
import { filePaths } from './resources/file-paths.js';
import { diceConfig as config } from '../domain/models/dice-config.js';

const { load, loadJs } = fileTemplater.init(fileStore, filePaths);

console.log('Building dice page...');

const rootStyles = await load('rootStyles');
const diceStyles = await load('diceStyles');
const dicePage = await load('dicePage', config);
const diceConfig = await loadJs('diceConfig');
const randomizer = await loadJs('randomizer');
const diceEvents = await loadJs('diceEvents');
const diceStart = await loadJs('diceStart');

const hotReload = process.argv.some((arg) => arg === '--hot-reload');

const cacheEvents = await loadJs('cacheEvents');
const cacheClient = await loadJs('cacheClient');
const cacheWorker = await loadJs('cacheWorker');

const html = await load('layout', {
    head: `<title>${config.title}</title>
<style>
${rootStyles}

${diceStyles}
</style>`,
    main: `${dicePage}

<script>
${diceConfig}
${diceEvents}
${randomizer}
${diceStart}
</script>  

<script>
${cacheClient}
</script>

${hotReload ? '<script src="/hot-reload.js"></script>' : ''}
`,
});

fileStore.write(filePaths.build, html);

console.log('Main complete.', html.split('\n').slice(-9).join('\n'), filePaths.build);

fileStore.write(filePaths.cacheWorkerBuild, `
${cacheEvents}
${cacheWorker}
`
);
console.log('Service worker complete.', filePaths.cacheWorkerBuild);