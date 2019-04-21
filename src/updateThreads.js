const fs = require('fs-extra');
const path = require('path');
const got = require('got');

async function try4chan({ board, threadId }) {
    try {
        const response = await got(`https://a.4cdn.org/${board}/thread/${threadId}.json`);
        if (JSON.parse(response.body).posts[0].archived) {
            return null;
        }
        return response.body;
    } catch (error) {
        return null;
    }
}

async function tryDesuarchive({ board, threadId }) {
    try {
        const response = await got(`https://desuarchive.org/_/api/chan/thread/?board=${board}&num=${threadId}`);
        return response.body;
    } catch (error) {
        return null;
    }
}

async function tryArchivedMoe({ board, threadId }) {
    try {
        const response = await got(`https://archived.moe/_/api/chan/thread/?board=${board}&num=${threadId}`);
        return response.body;
    } catch (error) {
        return null;
    }
}

async function updateThread(thread, dest) {
    let data = await try4chan(thread);
    if (!data) {
        data = await tryDesuarchive(thread);
    }
    if (!data) {
        data = await tryArchivedMoe(thread);
    }
    if (!data) {
        throw new Error(`Unable to find JSON data for thread ${thread.board}/${thread.threadId}`);
    }
    await fs.ensureDir(dest);
    await fs.writeFile(path.join(dest, `${thread.threadId}.json`), data, 'utf8');
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
