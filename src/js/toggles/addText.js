var utils = require("../utils/package");

/**
 * Action to insert text at cursor position
 */
function addText(editor, text, mark) {
    var cm = editor.codemirror;
    _replaceSelectionWithText(cm, text, mark);
}

function _replaceSelectionWithText(cm, text, mark) {
    var start = utils.cloneCursor(cm.getCursor("start"));
    var end = utils.cloneCursor(cm.getCursor("end"));

    cm.replaceRange(text, start, end, cm.getCursor());

    end.ch = start.ch + text.length;
    cm.markText(start, end, mark);
    cm.focus();
}

module.exports.addText = addText;