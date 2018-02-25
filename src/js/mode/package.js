var htmlMode = require("./HtmlMode");
var markdownMode = require("./MarkdownMode");
var plainTextMode = require("./PlainTextMode");
var spellCheckerMode = require("./SpellCheckerMode");

module.exports.htmlMode = htmlMode.htmlMode;
module.exports.markdownMode = markdownMode.markdownMode;
module.exports.plainTextMode = plainTextMode.plainTextMode;
module.exports.spellCheckModeHtml = spellCheckerMode.spellCheckModeHtml;
module.exports.spellCheckModeMarkdown = spellCheckerMode.spellCheckModeMarkdown;
module.exports.spellCheckModePlainText = spellCheckerMode.spellCheckModePlainText;


module.exports.getMode = function (name) {
    switch (name) {
        case "Markdown":
            return markdownMode.markdownMode;
        case "HTML":
            return htmlMode.htmlMode;
        case "PlainText":
            return plainTextMode.plainTextMode;
        default:
            return null;
    }
};

module.exports.getSpellCheckMode = function (name) {
    switch (name) {
        case "Markdown":
            return spellCheckerMode.spellCheckModeMarkdown;
        case "HTML":
            return spellCheckerMode.spellCheckModeHtml;
        case "PlainText":
            return spellCheckerMode.spellCheckModePlainText;
        default:
            return null;
    }
};
