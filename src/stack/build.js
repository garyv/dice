//@ts-check
import { fileTemplater } from './adapters/file-templater.js';
import { fileStore as store } from './adapters/file-store.js';
import { filePaths as paths } from './resources/file-paths.js';
import { diceConfig as config } from '../models/dice-config.js';

const { load, loadJs } = fileTemplater.init(store, paths);

console.log('Building dice page...');

const meta = await load('meta');
const rootStyles = await load('rootStyles');

const diceConfig = await loadJs('diceConfig');
const useState = await loadJs('useState');
const diceEvents = await loadJs('diceEvents');
const dicePage = await load('dicePage', config);
const diceStyles = await load('diceStyles');
const randomizer = await loadJs('randomizer');
const useEvents = await loadJs('useEvents');
const diceRules = await loadJs('diceRules');
const diceRotation = await loadJs('diceRotation');

const cacheClient = await loadJs('cacheClient');
const cacheEvents = await loadJs('cacheEvents');
const cacheWorker = await loadJs('cacheWorker');

const hotReload = process.argv.some((arg) => arg === '--hot-reload');

const html = await load('layout', {
    head: `<title>${config.title}</title>
${meta}
<style>
${rootStyles}

${diceStyles}
</style>`,
    main: `${dicePage}

<script>
${diceConfig}
${useState}
${useEvents}
${diceEvents}
${diceRules}
${diceRotation}
${randomizer}

${!hotReload ? cacheClient : ''}
</script>

${hotReload ? '<script src="/hot-reload.js"></script>' : ''}
`,
});

await store.write(paths.build, html);
console.log('Main complete.', html.split('\n').slice(-9).join('\n'), paths.build);

await store.write(paths.cacheWorkerBuild, `
${cacheEvents}
${cacheWorker}
`
);
console.log('Service worker complete.', paths.cacheWorkerBuild);

await store.copy(paths.icon, paths.iconBuild);
await store.copy(paths.icon180, paths.icon180Build);
console.log('Icons complete.', paths.iconBuild, paths.icon180Build);

await store.copy(paths.manifest, paths.manifestBuild);
console.log('Manifest complete', paths.manifestBuild);