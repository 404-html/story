const formatFileSize = require('./formatFileSize.js');
const sanitiseComment = require('./sanitiseComment.js');

function normalise4chan(post, { isOp }) {
    const normalisedPost = { isOp };
    normalisedPost.number = post.no;
    normalisedPost.threadNumber = post.resto;
    normalisedPost.comment = post.com;
    normalisedPost.time = post.time * 1000;
    normalisedPost.time4chanFormatted = post.now;
    normalisedPost.id = post.id;
    normalisedPost.name = post.name;
    normalisedPost.subject = post.sub;
    normalisedPost.trip = post.trip;
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
    normalisedPost.number = post.num;
    normalisedPost.threadNumber = post.thread_num;
    if (post.comment) {
        normalisedPost.comment = sanitiseComment(post.comment);
    }
    normalisedPost.time = post.timestamp * 1000;
    normalisedPost.time4chanFormatted = post.fourchan_date;
    normalisedPost.id = post.poster_hash;
    normalisedPost.name = post.name;
    normalisedPost.subject = post.title;
    normalisedPost.trip = post.trip;
    if (post.media) {
        normalisedPost.filename = post.media.media_filename;
        normalisedPost.fileSize = formatFileSize(post.media.media_size);
        normalisedPost.fileSrc = `http://suptg.thisisnotatrueending.com/qstarchive/${post.thread_num}/images/${post.media.media_orig}`;
        normalisedPost.fileThumbSrc = `http://suptg.thisisnotatrueending.com/qstarchive/${post.thread_num}/thumbs/${post.media.preview_orig}`;
        normalisedPost.md5 = post.media.media_hash;
        normalisedPost.w = post.media.media_w;
        normalisedPost.h = post.media.media_h;
        normalisedPost.tn_w = post.media.preview_w;
        normalisedPost.tn_h = post.media.preview_h;
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
