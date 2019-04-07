const updateThreads = require('./updateThreads.js');
const processThreads = require('./processThreads.js');

const projectRoot = __dirname;

async function run() {
    await updateThreads(projectRoot);
    await processThreads(projectRoot);
}

run().catch(console.error);
