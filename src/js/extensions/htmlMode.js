var toMarkdown = require("to-markdown");
var $ = require("jquery");

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
        var htmlMode = {
            name: "xml",
            htmlMode: true
        };
        cm.setValue("");
        cm.clearHistory();
        cm.setOption("mode", htmlMode);
        cm.setValue(htmlText);
        editor.options.currentMode = "HTML";
    }
}

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
        var markdownMode = editor.options.parsingConfig;
        markdownMode.name = "gfm";
        markdownMode.gitHubSpice = false;
        cm.setValue("");
        cm.clearHistory();
        cm.setOption("mode", markdownMode);
        cm.setValue(markdownText);
        editor.options.currentMode = "Markdown";
    }
}

module.exports.switchMode = switchMode;
module.exports.toHTML = toHTML;
module.exports.saveHTML = saveHTML;
module.exports.fromHTML = fromHTML;
