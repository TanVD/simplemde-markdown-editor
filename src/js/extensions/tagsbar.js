var $ = require("jquery");

function createAddTag(self, item) {
    return function () {
        item.action(self, "\$\{" + item.name + "\}", {});
    };
}

/**
 * Create placeholder element for tagsbar.
 */
function createPlaceholder(text, group) {
    var el = document.createElement("p");

    el.tabIndex = -1;
    el.textContent = text;
    el.className = "tag-class " + "tag-group-" + group;
    return el;
}

/**
 * Create tagsbar div element from specified items
 */
function createTagsbar(editor) {
    var items = editor.tagsbar;
    if (items.length === 0) {
        return;
    }

    if (!items || items.length === 0) {
        return;
    }
    var bar = document.createElement("div");
    bar.className = "editor-tagsbar";

    //Spoiler header
    var spoilerHeader = document.createElement("div");
    spoilerHeader.className += "simplemde-tags-spoiler-header-div";

    var spoilerText = document.createElement("span");
    spoilerText.innerHTML = "Type ${ to overview all available tags";
    spoilerHeader.className += "simplemde-tags-spoiler-header-text";

    var spoilerButton = document.createElement("button");
    spoilerButton.innerHTML = "Hide";
    spoilerButton.type = "button";
    $(spoilerButton).click(function() {
        $(tagsPanel).toggle("slow");
        if (spoilerButton.innerHTML === "Show") {
            spoilerButton.innerHTML = "Hide";
        } else {
            spoilerButton.innerHTML = "Show";
        }
    });
    spoilerHeader.className += "simplemde-tags-spoiler-header-button";

    spoilerHeader.appendChild(spoilerText);
    spoilerHeader.appendChild(spoilerButton);

    //Spoiler body
    var tagsPanel = document.createElement("div");
    spoilerHeader.className += "simplemde-tags-spoiler-body-div";

    for (var i = 0; i < items.length; i++) {
        var el = createPlaceholder(items[i].description, items[i].group);
        tagsPanel.appendChild(el);

        // bind events, special for info
        if (items[i].action) {
            el.onclick = createAddTag(editor, items[i]);
        }
    }

    bar.appendChild(tagsPanel);
    bar.appendChild(spoilerHeader);

    var cm = editor.codemirror;
    var cmWrapper = cm.getWrapperElement();
    cmWrapper.parentNode.insertBefore(bar, cmWrapper);

    return bar;
}

module.exports.createTagsbar = createTagsbar;