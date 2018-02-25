var $ = require("jquery");
var toggles = require("../toggles/package");
var languages = require("../extensions/languagesMode");

function createCombobox(options) {
    return function () {
        var sel = document.createElement("select");
        for (var i = 0; i < options.length; i++) {
            var opt = document.createElement("option");
            opt.value = options[i];
            opt.innerHTML = options[i];
            sel.appendChild(opt);
        }
        return sel;
    };
}

function createIcon(className) {
    return function () {
        var el = document.createElement("a");
        el.tabIndex = -1;
        el.className = className;
        return el;
    };
}

function createSep() {
    var el = document.createElement("i");
    el.className = "separator";
    el.innerHTML = "|";
    return el;
}

function setOnClickAction(action) {
    return function (editor, el) {
        el.onclick = function (e) {
            e.preventDefault();
            action(editor, e);
        };
    };
}

function setOnChangeAction(action) {
    return function (editor, el) {
        el.onchange = function (e) {
            e.preventDefault();
            action(editor, e);
        };
    };
}

function emptyAction() {
    return function (el) {
    };
}

function toolbarBuiltInButtons(editor) {
    return {

        "bold": {
            name: "bold",
            createElement: createIcon("fa fa-bold"),
            setAction: setOnClickAction(toggles.toggleBold),
            markdownOnly: true,
            title: "Bold"
        },
        "italic": {
            name: "italic",
            createElement: createIcon("fa fa-italic"),
            setAction: setOnClickAction(toggles.toggleItalic),
            markdownOnly: true,
            title: "Italic"
        },
        "heading": {
            name: "heading",
            createElement: createIcon("fa fa-header"),
            setAction: setOnClickAction(toggles.toggleHeadingSmaller),
            markdownOnly: true,
            title: "Heading"
        },
        "separator-1": {
            name: "separator-1",
            setAction: emptyAction(),
            createElement: createSep
        },
        "quote": {
            name: "quote",
            createElement: createIcon("fa fa-quote-left"),
            setAction: setOnClickAction(toggles.toggleBlockquote),
            markdownOnly: true,
            title: "Quote"
        },
        "unordered-list": {
            name: "unordered-list",
            createElement: createIcon("fa fa-list-ul"),
            setAction: setOnClickAction(toggles.toggleUnorderedList),
            markdownOnly: true,
            title: "Generic List"
        },
        "ordered-list": {
            name: "ordered-list",
            createElement: createIcon("fa fa-list-ol"),
            setAction: setOnClickAction(toggles.toggleOrderedList),
            markdownOnly: true,
            title: "Numbered List"
        },
        "separator-2": {
            name: "separator-2",
            setAction: emptyAction(),
            createElement: createSep
        },
        "link": {
            name: "link",
            createElement: createIcon("fa fa-link"),
            setAction: setOnClickAction(toggles.drawLink),
            markdownOnly: true,
            title: "Create Link"
        },
        "image": {
            name: "image",
            createElement: createIcon("fa fa-picture-o"),
            setAction: setOnClickAction(toggles.drawImage),
            markdownOnly: true,
            title: "Insert Image"
        },
        "separator-3": {
            name: "separator-3",
            setAction: emptyAction(),
            createElement: createSep
        },
        "preview": {
            name: "preview",
            createElement: createIcon("fa fa-eye no-disable"),
            setAction: setOnClickAction(toggles.togglePreview),
            title: "Toggle Preview"
        },
        "separator-4": {
            name: "separator-4",
            setAction: emptyAction(),
            createElement: createSep
        },
        "switchMode": {
            name: "switchMode",
            createElement: createCombobox(editor.lang.list),
            setAction: setOnChangeAction(function (editor, e) {
                var select = editor.toolbar["switchMode"].element;
                var selectedOption = select.options[select.selectedIndex].value;
                try {
                    languages.switchMode(editor, selectedOption);
                } catch (e) {
                    var previousIndex = 0;
                    while (select.options[previousIndex].value !== editor.lang.current
                    && previousIndex < editor.lang.list) {
                        previousIndex++;
                    }
                    select.selectedIndex = previousIndex;
                    var span = document.createElement("span");
                    span.className += "simplemde-text-conversion-error";
                    span.innerHTML = " Current text can not be converted to " + selectedOption;

                    editor.gui.toolbar.appendChild(span);
                    setTimeout(function () {
                        $(span).remove();
                    }, 5000);
                }
            }),
            title: "Switch between languages"
        }
    };
}

module.exports.toolbarBuiltInButtons = toolbarBuiltInButtons;
