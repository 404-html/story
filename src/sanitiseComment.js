function sanitiseComment(rawComment) {
    let comment = rawComment;
    // Fix broken tags
    comment = comment.replace(/(<span class="mu-i">)(.+?)\[\/spoiler\]/g, ($0, $1, $2) => {
        const tagNameMatch = $1.match(/^<([A-z]+) /);
        if (tagNameMatch) {
            const tagName = tagNameMatch[1];
            return `${$1}${$2}</${tagName}>`;
        } else {
            throw new Error(`sanitiseComment unable to parse following comment:\n${rawComment}`);
        }
    });
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
    return comment;
}

module.exports = sanitiseComment;
