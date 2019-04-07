const minimist = require('minimist');
const updateThreads = require('./src/updateThreads.js');
const processThreads = require('./src/processThreads.js');

const args = minimist(process.argv.slice(2), {
    boolean: ['process-only']
});

const projectRoot = __dirname;

async function run() {
    if (!args['process-only']) {
        console.log('Updating raw thread data');
        await updateThreads(projectRoot);
    }
    console.log('Processing thread data');
    await processThreads(projectRoot);
}

run().catch(console.error);
