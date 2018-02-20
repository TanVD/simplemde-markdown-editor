var htmlMode = require("./HtmlMode");
var markdownMode = require("./MarkdownMode");
var spellCheckerMode = require("./SpellCheckerMode");

module.exports.htmlMode = htmlMode.htmlMode;
module.exports.markdownMode = markdownMode.markdownMode;
module.exports.spellCheckMode = spellCheckerMode.spellCheckMode;
module.exports.getMode = function (name) {
    switch (name) {
        case "Markdown":
            return markdownMode;
        case "HTML":
            return htmlMode;
        default:
            return null;
    }
};