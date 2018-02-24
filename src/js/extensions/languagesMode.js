var lang = require("../languages/languages");

function nextMode(editor) {
    switchBetweenModes(editor, editor.options.modes);
}

function switchMode(editor, language) {
    var modes = editor.options.modes;
    var currentLanguage = lang.languages[editor.options.currentMode];
    var nextLanguage = lang.languages[language];
    switchToLanguage(editor, modes, currentLanguage, nextLanguage);
}

function switchBetweenModes(editor, modes) {
    var currentMode = editor.options.currentMode;
    var index = 0;
    while (currentMode !== modes[index] && index < modes.length) {
        index++;
    }
    var nextIndex = (index + 1) % modes.length;
    var nextMode = modes[nextIndex];

    var currentLanguage = lang.languages[currentMode];
    var nextLanguage = lang.languages[nextMode];

    try {
        switchToLanguage(editor, modes, currentLanguage, nextLanguage);
    } catch (e) {
        var indexToRemove = modes.indexOf(nextLanguage.name);
        if (indexToRemove > -1) {
            modes = modes.splice(indexToRemove, 1);
        }
        switchBetweenModes(editor, modes);
    }

    editor.toolbar["switchMode"].element.innerHTML = editor.options.currentMode;
}

function switchToLanguage(editor, modes, currentLanguage, nextLanguage) {
    var text = editor.value();
    var nextText = nextLanguage.convert(text, currentLanguage);
    editor.value("");
    nextLanguage.setMode(editor);
    editor.value(nextText);
    editor.options.currentMode = nextLanguage.name;
}

module.exports.nextMode = nextMode;
module.exports.switchMode = switchMode;