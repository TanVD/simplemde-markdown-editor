var marked = require("marked");
var TurndownService = require("turndown");
var modes = require("../mode/package");
var turnDownService = new TurndownService({
    defaultReplacement: function (innerHTML, node) {
        throw SyntaxError("Turndown could not convert some html constructs to Markdown");
    }
});

function toMarkdown(text, language) {
    switch(language.name) {
        case ("HTML") : {
            return turnDownService.turndown(text);
        }
        case ("Markdown") : {
            return text;
        }
        case ("PlainText") : {
            return text;
        }
    }
}

function preview(text) {
    return marked(text);
}

function setMode(editor) {
    var cm = editor.codemirror;
    cm.clearHistory();
    cm.setOption("mode", modes.spellCheckModeMarkdown);
    cm.setOption("backdrop", modes.markdownMode);
    Object.keys(editor.toolbar).forEach(function (key) {
        var item = editor.toolbar[key];
        if (item.markdownOnly) {
            item.element.style.pointerEvents = "auto";
        }
    });
}

module.exports.toMarkdown = toMarkdown;
module.exports.preview = preview;
module.exports.setMode = setMode;