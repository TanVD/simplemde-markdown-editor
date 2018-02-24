var $ = require("jquery");
var buttons = require("./buttons");
var cmUtils = require("../utils/codemirrorUtils");

function createToolbar(editor) {
    var items = $.extend(true, {}, buttons.toolbarBuiltInButtons(editor));

    var bar = document.createElement("div");
    bar.className = "editor-toolbar";


    Object.keys(items).forEach(function (key) {
        var item = items[key];

        var el = item.createElement();
        item.setAction(editor, el);

        bar.appendChild(el);

        item.element = el;
    });

    editor.toolbar = items;

    var cm = editor.codemirror;
    cm.on("cursorActivity", function () {
        var stat = cmUtils.getState(editor);

        Object.keys(items).forEach(function (key) {
            var item = items[key];
            if (stat[key]) {
                item.element.className += " active";
            } else {
                item.element.className = item.element.className.replace(/\s*active\s*/g, "");
            }
        });
    });

    var cmWrapper = cm.getWrapperElement();
    cmWrapper.parentNode.insertBefore(bar, cmWrapper);
    return bar;
}

module.exports.createToolbar = createToolbar;

