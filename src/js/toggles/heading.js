/**
 * Action for toggling heading size: normal -> h1 -> h2 -> h3 -> h4 -> h5 -> h6 -> normal
 */
function toggleHeadingSmaller(editor) {
    var cm = editor.codemirror;
    _toggleHeading(cm, "smaller");
}

// /**
//  * Action for toggling heading size: normal -> h6 -> h5 -> h4 -> h3 -> h2 -> h1 -> normal
//  */
// function toggleHeadingBigger(editor) {
//     var cm = editor.codemirror;
//     _toggleHeading(cm, "bigger");
// }
//
// /**
//  * Action for toggling heading size 1
//  */
// function toggleHeading1(editor) {
//     var cm = editor.codemirror;
//     _toggleHeading(cm, undefined, 1);
// }
//
// /**
//  * Action for toggling heading size 2
//  */
// function toggleHeading2(editor) {
//     var cm = editor.codemirror;
//     _toggleHeading(cm, undefined, 2);
// }
//
// /**
//  * Action for toggling heading size 3
//  */
// function toggleHeading3(editor) {
//     var cm = editor.codemirror;
//     _toggleHeading(cm, undefined, 3);
// }

function _toggleHeading(cm, direction, size) {
    if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
        return;

    var startPoint = cm.getCursor("start");
    var endPoint = cm.getCursor("end");
    for (var i = startPoint.line; i <= endPoint.line; i++) {
        (function (i) {
            var text = cm.getLine(i);
            var currHeadingLevel = text.search(/[^#]/);

            if (direction !== undefined) {
                if (currHeadingLevel <= 0) {
                    if (direction === "bigger") {
                        text = "###### " + text;
                    } else {
                        text = "# " + text;
                    }
                } else if (currHeadingLevel === 6 && direction === "smaller") {
                    text = text.substr(7);
                } else if (currHeadingLevel === 1 && direction === "bigger") {
                    text = text.substr(2);
                } else {
                    if (direction === "bigger") {
                        text = text.substr(1);
                    } else {
                        text = "#" + text;
                    }
                }
            } else {
                if (size === 1) {
                    if (currHeadingLevel <= 0) {
                        text = "# " + text;
                    } else if (currHeadingLevel === size) {
                        text = text.substr(currHeadingLevel + 1);
                    } else {
                        text = "# " + text.substr(currHeadingLevel + 1);
                    }
                } else if (size === 2) {
                    if (currHeadingLevel <= 0) {
                        text = "## " + text;
                    } else if (currHeadingLevel === size) {
                        text = text.substr(currHeadingLevel + 1);
                    } else {
                        text = "## " + text.substr(currHeadingLevel + 1);
                    }
                } else {
                    if (currHeadingLevel <= 0) {
                        text = "### " + text;
                    } else if (currHeadingLevel === size) {
                        text = text.substr(currHeadingLevel + 1);
                    } else {
                        text = "### " + text.substr(currHeadingLevel + 1);
                    }
                }
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

module.exports.toggleHeadingSmaller = toggleHeadingSmaller;