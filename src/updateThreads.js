const fs = require('fs-extra');
const path = require('path');
const got = require('got');
const getSuptgUrl = require('./getSuptgUrl.js');

async function trySuptg({ board, threadId }) {
    try {
        const response = await got(getSuptgUrl(board, threadId));
        return response.body;
    } catch (error) {
        return null;
    }
}

async function try4chan({ board, threadId }) {
    try {
        const response = await got(`https://boards.4chan.org/${board}/thread/${threadId}`);
        return response.body;
    } catch (error) {
        return null;
    }
}

async function updateThread(thread, dest) {
    let data = await trySuptg(thread);
    if (!data) {
        data = await try4chan(thread);
    }
    if (!data) {
        throw new Error(`Unable to find data for thread ${thread.board}/${thread.threadId}`);
    }
    await fs.ensureDir(dest);
    await fs.writeFile(path.join(dest, `${thread.threadId}.html`), data, 'utf8');
}

async function updateThreads(projectRoot = '.', threadIds = []) {
    const threadIndex = await fs.readJson(path.join(projectRoot, 'docs', 'threads', 'index.json'));
    let threads = threadIndex.main.concat(threadIndex.side);
    if (threadIds.length) {
        threads = threads.filter(thread => threadIds.includes(`${thread.threadId}`));
    }
    const threadsPath = path.join(projectRoot, 'threadsRaw');
    await Promise.all(threads.map(thread => { return updateThread(thread, threadsPath); }));
}

module.exports = updateThreads;
