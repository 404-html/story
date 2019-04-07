const fs = require('fs-extra');
const path = require('path');
const normaliseThreadData = require('./normaliseThreadData.js');

async function getThreadPaths(dir) {
    const files = await fs.readdir(dir);
    return files.map(file => path.join(dir, file));
}

async function exportPosts(threadData, dest) {
    return Promise.all(threadData.map(postData => fs.writeJson(path.join(dest, `${postData.number}.json`), postData, 'utf8')));
}

async function processThreads(projectRoot) {
    const destPosts = path.join(projectRoot, 'docs', 'posts');
    const destThreads = path.join(projectRoot, 'docs', 'threads');
    await Promise.all([
        fs.ensureDir(destPosts),
        fs.ensureDir(destThreads)
    ]);
    const threadPaths = await getThreadPaths(path.join(projectRoot, 'threadsRaw'));
    await Promise.all(threadPaths.map(async (threadPath) => {
        const thread = await fs.readJSON(threadPath);
        const threadData = normaliseThreadData(thread);
        await fs.writeJson(path.join(destThreads, path.basename(threadPath)), threadData, 'utf8');
        await exportPosts(threadData, destPosts);
    }));
}

module.exports = processThreads;
