var utils = require("../utils/package");

/**
 * Action for toggling bold.
 */
function toggleBold(editor) {
    _toggleBlock(editor, "bold", editor.options.blockStyles.bold);
}

/**
 * Action for toggling italic.
 */
function toggleItalic(editor) {
    _toggleBlock(editor, "italic", editor.options.blockStyles.italic);
}

function _toggleBlock(editor, type, start_chars, end_chars) {
    if (/editor-preview-active/.test(editor.codemirror.getWrapperElement().lastChild.className))
        return;

    end_chars = (typeof end_chars === "undefined") ? start_chars : end_chars;
    var cm = editor.codemirror;
    var stat = utils.getState(cm);

    var text;
    var start = start_chars;
    var end = end_chars;

    var startPoint = cm.getCursor("start");
    var endPoint = cm.getCursor("end");

    if (stat[type]) {
        text = cm.getLine(startPoint.line);
        start = text.slice(0, startPoint.ch);
        end = text.slice(startPoint.ch);
        if (type === "bold") {
            start = start.replace(/(\*\*|__)(?![\s\S]*(\*\*|__))/, "");
            end = end.replace(/(\*\*|__)/, "");
        } else if (type === "italic") {
            start = start.replace(/(\*|_)(?![\s\S]*(\*|_))/, "");
            end = end.replace(/([*_])/, "");
        } else if (type === "strikethrough") {
            start = start.replace(/(\*\*|~~)(?![\s\S]*(\*\*|~~))/, "");
            end = end.replace(/(\*\*|~~)/, "");
        }
        cm.replaceRange(start + end, {
            line: startPoint.line,
            ch: 0
        }, {
            line: startPoint.line,
            ch: 99999999999999
        });

        if (type === "bold" || type === "strikethrough") {
            startPoint.ch -= 2;
            if (startPoint !== endPoint) {
                endPoint.ch -= 2;
            }
        } else if (type === "italic") {
            startPoint.ch -= 1;
            if (startPoint !== endPoint) {
                endPoint.ch -= 1;
            }
        }
    } else {
        text = cm.getSelection();
        if (type === "bold") {
            text = text.split("**").join("");
            text = text.split("__").join("");
        } else if (type === "italic") {
            text = text.split("*").join("");
            text = text.split("_").join("");
        } else if (type === "strikethrough") {
            text = text.split("~~").join("");
        }
        cm.replaceSelection(start + text + end);

        startPoint.ch += start_chars.length;
        endPoint.ch = startPoint.ch + text.length;
    }

    cm.setSelection(startPoint, endPoint);
    cm.focus();
}

module.exports.toggleBold = toggleBold;
module.exports.toggleItalic = toggleItalic;
