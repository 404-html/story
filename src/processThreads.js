const fs = require('fs-extra');
const path = require('path');
const { renderThreadAsHtml } = require('post-renderer');
const normaliseThreadData = require('./normaliseThreadData.js');

async function getThreadPaths(dir, threadIds) {
    let files = await fs.readdir(dir);
    if (threadIds.length) {
        files = files.filter(file => {
            return threadIds.includes(path.basename(file, path.extname(file)));
        });
    }
    return files.map(file => path.join(dir, file));
}

async function exportPosts(threadData, dest) {
    return Promise.all(threadData.map(postData => fs.writeJson(path.join(dest, `${postData.number}.json`), postData, 'utf8')));
}

async function generateHtml(threadData, dest) {
    const html = renderThreadAsHtml(threadData, '../css/yotsubluenew.652.css');
    await fs.writeFile(path.join(dest, `${threadData[0].number}.html`), html, 'utf8');
}

async function processThread(projectRoot, threadPath) {
    const destPosts = path.join(projectRoot, 'docs', 'posts');
    const destThreads = path.join(projectRoot, 'docs', 'threads');
    await Promise.all([
        fs.ensureDir(destPosts),
        fs.ensureDir(destThreads)
    ]);
    const thread = await fs.readJSON(threadPath);
    const threadData = normaliseThreadData(thread);
    await fs.writeJson(path.join(destThreads, path.basename(threadPath)), threadData, 'utf8');
    await exportPosts(threadData, destPosts);
    await generateHtml(threadData, destThreads);
}

async function processThreads(projectRoot, threadIds = []) {
    const threadPaths = await getThreadPaths(path.join(projectRoot, 'threadsRaw'), threadIds);
    await Promise.all(threadPaths.map((threadPath) => {
        return processThread(projectRoot, threadPath);
    }));
}

module.exports = processThreads;
