var markdown = require("./markdown");
var html = require("./html");
var plaintext = require("./plaintext");


module.exports.languages = Object.freeze({
    HTML: {
        id: 0,
        name: "HTML",
        convert: html.toHtml,
        setMode: html.setMode,
        preview: html.preview
    },
    Markdown: {
        id: 1,
        name: "Markdown",
        convert: markdown.toMarkdown,
        setMode: markdown.setMode,
        preview: markdown.preview
    },
    PlainText: {
        id: 2,
        name: "PlainText",
        convert: plaintext.toPlaintext,
        setMode: plaintext.setMode,
        preview: plaintext.preview
    }
});