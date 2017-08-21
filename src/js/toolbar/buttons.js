var toggles = require("../toggles/package");
var html = require("../extensions/htmlMode");

var toolbarBuiltInButtons = {
    "bold": {
        name: "bold",
        action: toggles.toggleBold,
        className: "fa fa-bold",
        title: "Bold",
        default: true
    },
    "italic": {
        name: "italic",
        action: toggles.toggleItalic,
        className: "fa fa-italic",
        title: "Italic",
        default: true
    },
    "heading": {
        name: "heading",
        action: toggles.toggleHeadingSmaller,
        className: "fa fa-header",
        title: "Heading",
        default: true
    },
    "separator-1": {
        name: "separator-1"
    },
    "quote": {
        name: "quote",
        action: toggles.toggleBlockquote,
        className: "fa fa-quote-left",
        title: "Quote",
        default: true
    },
    "unordered-list": {
        name: "unordered-list",
        action: toggles.toggleUnorderedList,
        className: "fa fa-list-ul",
        title: "Generic List",
        default: true
    },
    "ordered-list": {
        name: "ordered-list",
        action: toggles.toggleOrderedList,
        className: "fa fa-list-ol",
        title: "Numbered List",
        default: true
    },
    "separator-2": {
        name: "separator-2"
    },
    "link": {
        name: "link",
        action: toggles.drawLink,
        className: "fa fa-link",
        title: "Create Link",
        default: true
    },
    "image": {
        name: "image",
        action: toggles.drawImage,
        className: "fa fa-picture-o",
        title: "Insert Image",
        default: true
    },
    "separator-3": {
        name: "separator-3"
    },
    "preview": {
        name: "preview",
        action: toggles.togglePreview,
        className: "fa fa-eye no-disable",
        title: "Toggle Preview",
        default: true
    },
    "separator-4": {
        name: "separator-4"
    },
    "switchMode": {
        name: "switchMode",
        action: html.switchMode,
        className: "fa fa-html5",
        title: "Convert to HTML",
        default: true
    },
    "separator-5": {
        name: "separator-5"
    },
    "undo": {
        name: "undo",
        action: toggles.undo,
        className: "fa fa-undo no-disable",
        title: "Undo"
    },
    "redo": {
        name: "redo",
        action: toggles.redo,
        className: "fa fa-repeat no-disable",
        title: "Redo"
    }
};

module.exports.toolbarBuiltInButtons = toolbarBuiltInButtons;
