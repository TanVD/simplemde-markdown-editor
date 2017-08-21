function createAddTag(self, item) {
    return function () {
        item.action(self, "${" + item.name + "}", {});
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
function createTagsbar(self, items) {
    items = items || self.options.tagsbar;

    if (!items || items.length === 0) {
        return;
    }
    var bar = document.createElement("div");
    bar.className = "editor-tagsbar";

    var toolbarData = {};
    self.toolbar = items;

    for (var i = 0; i < items.length; i++) {
        var el = createPlaceholder(items[i].description, items[i].group);
        toolbarData[items[i].name] = el;
        bar.appendChild(el);

        // bind events, special for info
        if (items[i].action) {
            el.onclick = createAddTag(self, items[i]);
        }
    }

    self.toolbarElements = toolbarData;

    var cm = self.codemirror;
    var cmWrapper = cm.getWrapperElement();
    cmWrapper.parentNode.insertBefore(bar, cmWrapper);
    return bar;
}

module.exports.createTagsbar = createTagsbar;