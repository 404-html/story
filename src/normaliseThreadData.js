const normalisePostData = require('./normalisePostData.js');

function normaliseThreadData(thread) {
    const normalisedThread = [];
    let options = {};
    if (thread.posts) {
        options.format = '4chan';
        options.isOp = true;
        normalisedThread.push(normalisePostData(thread.posts[0], options));
        for (const post of thread.posts.slice(1)) {
            options.isOp = false;
            normalisedThread.push(normalisePostData(post, options));
        }
    } else {
        options.format = 'foolzFuuka';
        for (const threadId of Object.keys(thread)) {
            const op = thread[threadId].op;
            options.isOp = true;
            normalisedThread.push(normalisePostData(op, options));
            for (const postId of Object.keys(thread[threadId].posts)) {
                const post = thread[threadId].posts[postId];
                options.isOp = false;
                normalisedThread.push(normalisePostData(post, options));
            }
        }
    }
    return normalisedThread;
}

module.exports = normaliseThreadData;
