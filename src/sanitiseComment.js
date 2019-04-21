function sanitiseComment(rawComment) {
    let comment = rawComment;
    // Fix broken tags
    while (/\[\/spoiler\]/.test(comment)) {
        const previousComment = comment;
        comment = comment.replace(/(<span class="mu-[isr]">)(.+?)\[\/spoiler\]/g, ($0, $1, $2) => {
            const tagNameMatch = $1.match(/^<([A-z]+) /);
            if (tagNameMatch) {
                const tagName = tagNameMatch[1];
                return `${$1}${$2}</${tagName}>`;
            } else {
                throw new Error(`sanitiseComment unable to parse following comment:\n${rawComment}`);
            }
        });
        if (comment === previousComment) {
            throw new Error(`Unable to fix [/spoiler] tag in:\n${rawComment}`);
        }
    }
    // Convert spoiler to HTML
    comment = comment.replace(/\[spoiler\](.+?)\[\/spoiler\]/g, ($0, $1) => {
        return `<s>${$1}</s>`;
    });
    // Handle greentext and replies
    comment = comment.replace(/^>.+$/gm, ($0) => {
        const replyMatch = $0.match(/^>>([0-9]+)$/);
        if (replyMatch) {
            // reply
            return `<a href="#p${replyMatch[1]}" class="quotelink">&gt;&gt;${replyMatch[1]}</a>`;
        } else {
            //green text
            return `<span class="quote">${$0}</span>`;
        }
    });
    // Convert linebreaks
    comment = comment.replace(/\n/g, '<br>');
    // Replace angle brackets with escaped versions without messing up the desired HTML tags
    const text = comment.split(/<[^<>]+>/g).map(str => str.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    const tags = comment.match(/<[^<>]+>/g);
    // If the comment started with a tag then the text array starts with an empty string
    // When there are multiple tags in a row the text array has empty strings
    // This means stitching things back together is surprisingly simple
    comment = '';
    for (let i = 0; i < text.length - 1; i++) {
        comment += text[i];
        comment += tags[i];
    }
    comment += text[text.length - 1];

    return comment;
}

module.exports = sanitiseComment;
