const normalisePostData = require('./normalisePostData.js');

function normaliseThreadData(thread) {
    const normalisedThread = [];
    if (thread.posts) {
        // 4chan format
        for (const post of thread.posts) {
            normalisedThread.push(normalisePostData(post));
        }
    } else {
        // foolz-fuuka format
        for (const threadId of Object.keys(thread)) {
            const op = thread[threadId].op;
            normalisedThread.push(normalisePostData(op));
            for (const postId of Object.keys(thread[threadId].posts)) {
                const post = thread[threadId].posts[postId];
                normalisedThread.push(normalisePostData(post));
            }
        }
    }
    return normalisedThread;
}

module.exports = normaliseThreadData;
