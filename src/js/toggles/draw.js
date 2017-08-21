var utils = require("../utils/package");

/**
 * Action for drawing a link.
 */
function drawLink(editor) {
    var cm = editor.codemirror;
    var stat = utils.getState(cm);
    var options = editor.options;
    var url = "http://";
    _replaceSelection(cm, stat.link, options.insertTexts.link, url);
}

/**
 * Action for drawing an img.
 */
function drawImage(editor) {
    var cm = editor.codemirror;
    var stat = utils.getState(cm);
    var options = editor.options;
    var url = "http://";
    _replaceSelection(cm, stat.image, options.insertTexts.image, url);
}

function _replaceSelection(cm, active, startEnd, url) {
    if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
        return;

    var text;
    var start = startEnd[0];
    var end = startEnd[1];
    var startPoint = cm.getCursor("start");
    var endPoint = cm.getCursor("end");
    if (url) {
        end = end.replace("#url#", url);
    }
    if (active) {
        text = cm.getLine(startPoint.line);
        start = text.slice(0, startPoint.ch);
        end = text.slice(startPoint.ch);
        cm.replaceRange(start + end, {
            line: startPoint.line,
            ch: 0
        });
    } else {
        text = cm.getSelection();
        cm.replaceSelection(start + text + end);

        startPoint.ch += start.length;
        if (startPoint !== endPoint) {
            endPoint.ch += start.length;
        }
    }
    cm.setSelection(startPoint, endPoint);
    cm.focus();
}

module.exports.drawImage = drawImage;
module.exports.drawLink = drawLink;