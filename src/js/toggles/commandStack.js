/**
 * Undo action.
 */
function undo(editor) {
    var cm = editor.codemirror;
    cm.undo();
    cm.focus();
}


/**
 * Redo action.
 */
function redo(editor) {
    var cm = editor.codemirror;
    cm.redo();
    cm.focus();
}

module.exports.undo = undo;
module.exports.redo = redo;