const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const normalisePostData = require('./normalisePostData.js');

function normaliseThreadData(threadHtml, { board, threadId }) {
    console.log(`Processing ${board}/${threadId}`);
    const { document } = (new JSDOM(threadHtml)).window;
    const thread = document.querySelector('.thread');
    return Array.from(thread.children).map(post => normalisePostData(post, { board, threadId }));
}

module.exports = normaliseThreadData;
