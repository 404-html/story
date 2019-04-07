const formatFileSize = require('./formatFileSize.js');

function sanitiseComment(comment) {
    return comment.replace(/\n/g, '<br>');
}

function normalisePostData(post, isOp) {
    const normalisedPost = { isOp };
    if (post.com) {
        // it's in 4chan format
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
            normalisedPost.fileSrc = `http://suptg.thisisnotatrueending.com/qstarchive/${post.resto}/images/${post.tim}${post.ext}`;
            normalisedPost.fileThumbSrc = `http://suptg.thisisnotatrueending.com/qstarchive/${post.resto}/thumbs/${post.tim}s${post.ext}`;
            normalisedPost.md5 = post.md5;
            normalisedPost.w = post.w;
            normalisedPost.h = post.h;
            normalisedPost.tn_w = post.tn_w;
            normalisedPost.tn_h = post.tn_h;
        }
    } else {
        // it's foolz-fuuka format
        normalisedPost.number = post.num;
        normalisedPost.threadNumber = post.thread_num;
        normalisedPost.comment = sanitiseComment(post.comment);
        normalisedPost.time = post.timestamp * 1000;
        normalisedPost.time4chanFormatted = post.fourchan_date;
        normalisedPost.id = post.poster_hash;
        normalisedPost.name = post.name;
        normalisedPost.subject = post.title;
        normalisedPost.trip = post.trip;
        if (post.media) {
            normalisedPost.filename = post.media.media_filename;
            normalisedPost.fileSize = formatFileSize(post.media.media_size);
            normalisedPost.fileSrc = `http://suptg.thisisnotatrueending.com/qstarchive/${post.thread_num}/images/${post.media.media}`;
            normalisedPost.fileThumbSrc = `http://suptg.thisisnotatrueending.com/qstarchive/${post.thread_num}/thumbs/${post.media.preview_orig}`;
            normalisedPost.md5 = post.media.media_hash;
            normalisedPost.w = post.media.media_w;
            normalisedPost.h = post.media.media_h;
            normalisedPost.tn_w = post.media.preview_w;
            normalisedPost.tn_h = post.media.preview_h;
        }
    }
    return normalisedPost;
}

module.exports = normalisePostData;
