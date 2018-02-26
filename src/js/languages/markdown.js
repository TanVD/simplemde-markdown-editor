var markdownToHtml = require("../render/MarkdownToHtml");
var htmlToMarkdown = require("../render/HtmlToMarkdown");
var modes = require("../mode/package");

function toMarkdown(editor, text, language) {
    switch (language.name) {
        case ("HTML") : {
            return htmlToMarkdown.getRenderer(editor)(text);
        }
        case ("Markdown") : {
            return text;
        }
        case ("PlainText") : {
            return text;
        }
    }
}

function preview(editor, text) {
    return markdownToHtml.getRenderer(editor)(text);
}

function setMode(editor) {
    var cm = editor.codemirror;
    cm.clearHistory();
    cm.setOption("mode", modes.spellCheckModeMarkdown);
    cm.setOption("backdrop", modes.markdownMode);

    if (editor.toolbar) {
        Object.keys(editor.toolbar).forEach(function (key) {
            var item = editor.toolbar[key];
            if (item.markdownOnly) {
                item.element.style.pointerEvents = "auto";
            }
        });
    }
}

module.exports.toMarkdown = toMarkdown;
module.exports.preview = preview;
module.exports.setMode = setMode;