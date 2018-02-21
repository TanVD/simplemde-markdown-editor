var toMarkdown = require("to-markdown");
var $ = require("jquery");
var modes = require("../mode/package");
var marked = require("marked");

var markdownRenderer = function (text) {
    if (marked) {
        var markedOptions = {
            gfm: false
        };
        marked.setOptions(markedOptions);
        return marked(text);
    }
};

/**
 * Switches between spellchecking mode with HTML highlighting and
 * spellchecking mode with Markdown rendering/hihglighting.
 * @param editor
 */
function switchMode(editor) {
    if (editor.options.currentMode === "HTML") {
        fromHTML(editor);
    } else {
        toHTML(editor);
    }
}

function fromHTML(editor) {
    if (editor.options.currentMode === "HTML") {
        var cm = editor.codemirror;
        var markdownText = toMarkdown(editor.value(), {
            gfm: false
        });
        cm.setValue("");
        cm.clearHistory();
        cm.setOption("mode", modes.spellCheckModeMarkdown);
        cm.setOption("backdrop", modes.markdownMode);
        cm.setValue(markdownText);
        editor.options.currentMode = "Markdown";
    }
}

function toHTML(editor) {
    if (editor.options.currentMode === "Markdown") {
        var cm = editor.codemirror;
        var htmlText = markdownRenderer(editor.value());
        cm.setValue("");
        cm.clearHistory();
        cm.setOption("mode", modes.spellCheckModeHtml);
        cm.setOption("backdrop", modes.htmlMode);
        cm.setValue(htmlText);
        editor.options.currentMode = "HTML";
    }
}

/**
 * Save HTML into "${editorId}Html" field (rendering HTML)
 * @param editor
 */
function saveHTML(editor) {
    var htmlText = "";
    if (editor.options.currentMode === "Markdown") {
        htmlText = markdownRenderer(editor.value());
    } else {
        htmlText = editor.value();
    }
    $("input[name='" + editor.element.id + "Html']").val(htmlText);
}

function saveMarkdown(editor) {
    var markdownText = "";
    if (editor.options.currentMode === "Markdown") {
        markdownText = markdownRenderer(editor.value());
    } else {
        markdownText = toMarkdown(editor.value(), {
            gfm: true
        });
    }
    $("input[name='" + editor.element.id + "Markdown']").val(markdownText);
}



module.exports.switchMode = switchMode;
module.exports.toHTML = toHTML;
module.exports.fromHTML = fromHTML;
module.exports.saveHTML = saveHTML;
module.exports.saveMarkdown = saveMarkdown;

