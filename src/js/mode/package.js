var htmlMode = require("./HtmlMode");
var markdownMode = require("./MarkdownMode");
var spellCheckerMode = require("./SpellCheckerMode");

module.exports.htmlMode = htmlMode.htmlMode;
module.exports.markdownMode = markdownMode.markdownMode;
module.exports.spellCheckModeHtml = spellCheckerMode.spellCheckModeHtml;
module.exports.spellCheckModeMarkdown = spellCheckerMode.spellCheckModeMarkdown;

module.exports.getMode = function (name) {
    switch (name) {
        case "Markdown":
            return markdownMode.markdownMode;
        case "HTML":
            return htmlMode.htmlMode;
        default:
            return null;
    }
};

module.exports.getSpellCheckMode = function(name) {
    switch (name) {
        case "Markdown":
            return spellCheckerMode.spellCheckModeMarkdown;
        case "HTML":
            return spellCheckerMode.spellCheckModeHtml;
        default:
            return null;
    }
};
