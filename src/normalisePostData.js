const formatFileSize = require('./formatFileSize.js');
const sanitiseComment = require('./sanitiseComment.js');
const moment = require('moment-timezone');
// const moment = require('moment');

function get4chanTime(time) {
    return moment.tz(time, 'Europe/London').tz('America/New_York').format('MM/DD/YY(ddd)HH:mm:ss');
}

function normalise4chan(post, { isOp }) {
    const normalisedPost = { isOp };
    normalisedPost.number = post.no;
    normalisedPost.threadNumber = post.resto || post.no; // resto is 0 if it's the op
    normalisedPost.comment = post.com;
    normalisedPost.time = post.time * 1000;
    normalisedPost.time4chanFormatted = get4chanTime(post.time * 1000);
    normalisedPost.id = post.id;
    normalisedPost.name = post.name;
    if (post.sub) {
        normalisedPost.subject = post.sub;
    }
    if (post.trip) {
        normalisedPost.trip = post.trip;
    }
    if (post.filename) {
        normalisedPost.filename = `${post.filename}${post.ext}`;
        normalisedPost.fileSize = formatFileSize(post.fsize);
        normalisedPost.fileSrc = `http://suptg.thisisnotatrueending.com/qstarchive/${isOp ? post.no : post.resto}/images/${post.tim}${post.ext}`;
        normalisedPost.fileThumbSrc = `http://suptg.thisisnotatrueending.com/qstarchive/${isOp ? post.no : post.resto}/thumbs/${post.tim}s${post.ext}`;
        normalisedPost.md5 = post.md5;
        normalisedPost.w = post.w;
        normalisedPost.h = post.h;
        normalisedPost.tn_w = post.tn_w;
        normalisedPost.tn_h = post.tn_h;
    }
    return normalisedPost;
}

function normaliseFoolzFuuka(post, { isOp }) {
    const normalisedPost = { isOp };
    normalisedPost.number = parseInt(post.num, 10);
    normalisedPost.threadNumber = parseInt(post.thread_num, 10);
    if (post.comment) {
        normalisedPost.comment = sanitiseComment(post.comment);
    }
    normalisedPost.time = post.timestamp * 1000;
    normalisedPost.time4chanFormatted = get4chanTime(post.timestamp * 1000);
    normalisedPost.id = post.poster_hash;
    normalisedPost.name = post.name;
    if (post.title) {
        normalisedPost.subject = post.title;
    }
    if (post.trip) {
        normalisedPost.trip = post.trip;
    }
    if (post.media) {
        normalisedPost.filename = post.media.media_filename;
        normalisedPost.fileSize = formatFileSize(post.media.media_size);
        normalisedPost.fileSrc = `http://suptg.thisisnotatrueending.com/qstarchive/${post.thread_num}/images/${post.media.media_orig}`;
        normalisedPost.fileThumbSrc = `http://suptg.thisisnotatrueending.com/qstarchive/${post.thread_num}/thumbs/${post.media.preview_orig}`;
        normalisedPost.md5 = post.media.media_hash;
        normalisedPost.w = parseInt(post.media.media_w, 10);
        normalisedPost.h = parseInt(post.media.media_h, 10);
        normalisedPost.tn_w = parseInt(post.media.preview_w, 10);
        normalisedPost.tn_h = parseInt(post.media.preview_h, 10);
    }
    return normalisedPost;
}

function normalisePostData(post, options) {
    const { format } = options;
    switch (format) {
        case '4chan':
            return normalise4chan(post, options);
        case 'foolz-fuuka':
            return normaliseFoolzFuuka(post, options);
        default:
            throw new Error(`Format unrecognised for post:\n${JSON.stringify(post, null, '\t')}`);
    }
}

module.exports = normalisePostData;
