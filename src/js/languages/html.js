var markdownToHtml = require("../render/MarkdownToHtml");
var modes = require("../mode/package");

function toHtml(text, language) {
    switch (language.name) {
        case ("HTML") : {
            return text;
        }
        case ("Markdown") : {
            return markdownToHtml(text);
        }
        case ("PlainText") : {
            return text;
        }
    }
}

function preview(text) {
    return text;
}

function setMode(editor) {
    var cm = editor.codemirror;
    cm.clearHistory();
    cm.setOption("mode", modes.spellCheckModeHtml);
    cm.setOption("backdrop", modes.htmlMode);

    if (editor.toolbar) {
        Object.keys(editor.toolbar).forEach(function (key) {
            var item = editor.toolbar[key];
            if (item.markdownOnly) {
                item.element.style.pointerEvents = "none";
            }
        });
    }
}

module.exports.toHtml = toHtml;
module.exports.preview = preview;
module.exports.setMode = setMode;