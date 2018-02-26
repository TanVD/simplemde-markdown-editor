var modes = require("../mode/package");

function toPlainText(editor, text, language) {
    switch (language.name) {
        case ("HTML") : {
            throw SyntaxError("HTML can not be converted to PlainText");
        }
        case ("Markdown") : {
            throw SyntaxError("Markdown can not be converted to PlainText");
        }
        case ("PlainText") : {
            return text;
        }
    }
}

function preview(editor, text) {
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

module.exports.toPlainText = toPlainText;
module.exports.preview = preview;
module.exports.setMode = setMode;