var buttons = require("./buttons");
var cmUtils = require("../utils/codemirrorUtils");

/**
 * Create icon element for toolbar.
 */
function createIcon(options) {
    options = options || {};
    var el = document.createElement("a");

    el.tabIndex = -1;
    el.className = options.className;
    return el;
}


function createSep() {
    var el = document.createElement("i");
    el.className = "separator";
    el.innerHTML = "|";
    return el;
}


function createToolbar(self, items) {
    items = items || self.options.toolbar;

    if (!items || items.length === 0) {
        return;
    }
    var i;
    for (i = 0; i < items.length; i++) {
        if (buttons.toolbarBuiltInButtons[items[i]] !== undefined) {
            items[i] = buttons.toolbarBuiltInButtons[items[i]];
        }
    }

    var bar = document.createElement("div");
    bar.className = "editor-toolbar";

    var toolbarData = {};
    self.toolbar = items;

    for (i = 0; i < items.length; i++) {
        // Don't include trailing separators
        if (items[i] === "|") {
            var nonSeparatorIconsFollow = false;

            for (var x = (i + 1); x < items.length; x++) {
                if (items[x] !== "|") {
                    nonSeparatorIconsFollow = true;
                }
            }

            if (!nonSeparatorIconsFollow)
                continue;
        }


        // Create the icon and append to the toolbar
        (function (item) {
            var el;
            if (item === "|") {
                el = createSep();
            } else {
                el = createIcon(item);
            }

            // bind events, special for info
            if (item.action) {
                if (typeof item.action === "function") {
                    el.onclick = function (e) {
                        e.preventDefault();
                        item.action(self);
                    };
                } else if (typeof item.action === "string") {
                    el.href = item.action;
                    el.target = "_blank";
                }
            }

            toolbarData[item.name || item] = el;
            bar.appendChild(el);
        })(items[i]);
    }

    self.toolbarElements = toolbarData;

    var cm = self.codemirror;
    cm.on("cursorActivity", function () {
        var stat = cmUtils.getState(cm);

        for (var key in toolbarData) {
            (function (key) {
                var el = toolbarData[key];
                if (stat[key]) {
                    el.className += " active";
                } else {
                    el.className = el.className.replace(/\s*active\s*/g, "");
                }
            })(key);
        }
    });

    var cmWrapper = cm.getWrapperElement();
    cmWrapper.parentNode.insertBefore(bar, cmWrapper);
    return bar;
}

module.exports.createToolbar = createToolbar;

