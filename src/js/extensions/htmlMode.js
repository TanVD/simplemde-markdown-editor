var toMarkdown = require("to-markdown");
var $ = require("jquery");
var modes = require("../mode/package");

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

function toHTML(editor) {
    if (editor.options.currentMode === "Markdown") {
        var cm = editor.codemirror;
        var htmlText = editor.options.previewRender(editor.value());
        cm.setValue("");
        cm.clearHistory();
        cm.setOption("mode", modes.spellCheckMode);
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
        htmlText = editor.options.previewRender(editor.value());
    } else {
        htmlText = editor.value();
    }
    $("input[name='" + editor.element.id + "Html']").val(htmlText);
}

function fromHTML(editor) {
    if (editor.options.currentMode === "HTML") {
        var cm = editor.codemirror;
        var markdownText = toMarkdown(editor.value(), {
            gfm: true
        });
        cm.setValue("");
        cm.clearHistory();
        cm.setOption("mode", modes.spellCheckMode);
        cm.setOption("backdrop", modes.markdownMode);
        cm.setValue(markdownText);
        editor.options.currentMode = "Markdown";
    }
}

module.exports.switchMode = switchMode;
module.exports.toHTML = toHTML;
module.exports.fromHTML = fromHTML;
module.exports.saveHTML = saveHTML;

