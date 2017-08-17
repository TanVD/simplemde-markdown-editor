var utils = require("../utils/package");

/**
 * Action for toggling blockquote.
 */
function toggleBlockquote(editor) {
    var cm = editor.codemirror;
    _toggleLine(cm, "quote");
}

/**
 * Action for toggling ul.
 */
function toggleUnorderedList(editor) {
    var cm = editor.codemirror;
    _toggleLine(cm, "unordered-list");
}

/**
 * Action for toggling ol.
 */
function toggleOrderedList(editor) {
    var cm = editor.codemirror;
    _toggleLine(cm, "ordered-list");
}

function _toggleLine(cm, name) {
    if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
        return;

    var stat = utils.getState(cm);
    var startPoint = cm.getCursor("start");
    var endPoint = cm.getCursor("end");
    var repl = {
        "quote": /^(\s*)\>\s+/,
        "unordered-list": /^(\s*)(\*|\-|\+)\s+/,
        "ordered-list": /^(\s*)\d+\.\s+/
    };
    var map = {
        "quote": "> ",
        "unordered-list": "* ",
        "ordered-list": "1. "
    };
    for (var i = startPoint.line; i <= endPoint.line; i++) {
        (function (i) {
            var text = cm.getLine(i);
            if (stat[name]) {
                text = text.replace(repl[name], "$1");
            } else {
                text = map[name] + text;
            }
            cm.replaceRange(text, {
                line: i,
                ch: 0
            }, {
                line: i,
                ch: 99999999999999
            });
        })(i);
    }
    cm.focus();
}

module.exports.toggleOrderedList = toggleOrderedList;
module.exports.toggleUnorderedList = toggleUnorderedList;
module.exports.toggleBlockquote = toggleBlockquote;