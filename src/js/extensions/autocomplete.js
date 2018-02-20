"use strict";

require("codemirror/addon/hint/show-hint.js");
require("codemirror/addon/hint/css-hint.js");
var CodeMirror = require("codemirror");

function escapeRegExp(str) {
    if(!str) {
        return str;
    }
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function createHints(list) {
    return function (editor) {
        var placeholderList = list.map(function callback(currentValue, index, array) {
            return "${" + currentValue.name + "}";
        });
        var cursor = editor.getCursor();
        var currentLine = editor.getLine(cursor.line);
        var start = cursor.ch;
        var end = start;
        while (end < currentLine.length && /[\w${]+/.test(currentLine.charAt(end))) ++end;
        while (start && /[\w${]+/.test(currentLine.charAt(start - 1))) --start;
        var curWord = start !== end && currentLine.slice(start, end);
        var regex = new RegExp("^" + escapeRegExp(curWord), "i");
        return {
            list: (!curWord ? placeholderList : placeholderList.filter(function (item) {
                return item.match(regex);
            })).sort(),
            from: CodeMirror.Pos(cursor.line, start),
            to: CodeMirror.Pos(cursor.line, end)
        };
    };
}

var excludedTriggerKeys = {
        "8": "backspace",
        "9": "tab",
        "13": "enter",
        "16": "shift",
        "17": "ctrl",
        "18": "alt",
        "19": "pause",
        "20": "capslock",
        "27": "escape",
        "33": "pageup",
        "34": "pagedown",
        "35": "end",
        "36": "home",
        "37": "left",
        "38": "up",
        "39": "right",
        "40": "down",
        "45": "insert",
        "46": "delete",
        "91": "left window key",
        "92": "right window key",
        "93": "select",
        "107": "add",
        "109": "subtract",
        "110": "decimal point",
        "111": "divide",
        "112": "f1",
        "113": "f2",
        "114": "f3",
        "115": "f4",
        "116": "f5",
        "117": "f6",
        "118": "f7",
        "119": "f8",
        "120": "f9",
        "121": "f10",
        "122": "f11",
        "123": "f12",
        "144": "numlock",
        "145": "scrolllock",
        "186": "semicolon",
        "187": "equalsign",
        "188": "comma",
        "189": "dash",
        "190": "period",
        "191": "slash",
        "192": "graveaccent",
        "220": "backslash",
        "222": "quote"
};


function keyUpAutocompleteHandler(cm, event) {
        var cursor = cm.getCursor();
        var currentLine = cm.getLine(cursor.line);
        var start = cursor.ch;
        while(start && /[\w${]+/.test(currentLine.charAt(start - 1))) --start;
        if(!cm.state.completionActive && !excludedTriggerKeys[(event.keyCode || event.which).toString()]
            && currentLine.charAt(start) === "\$") {
            cm.showHint({completeSingle: false});
        }
}

module.exports.createHints = createHints;
module.exports.keyUpAutocompleteHandler = keyUpAutocompleteHandler;

