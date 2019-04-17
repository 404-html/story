const minimist = require('minimist');
const updateThreads = require('./src/updateThreads.js');
const processThreads = require('./src/processThreads.js');

const args = minimist(process.argv.slice(2), {
    boolean: ['process-only']
});

const projectRoot = __dirname;

async function run() {
    const threadIds = args._.map(val => `${val}`);
    if (!args['process-only']) {
        console.log('Updating raw thread data');
        await updateThreads(projectRoot, threadIds);
    }
    console.log('Processing thread data');
    await processThreads(projectRoot, threadIds);
}

run().catch(console.error);
