var TurndownService = require("turndown");
var turndownPluginGfm = require("turndown-plugin-gfm");

module.exports.getRenderer = function (editor) {
    return function(text) {
        var gfm = turndownPluginGfm.gfm;
        var turnDownService = new TurndownService({
            defaultReplacement: function (innerHTML, node) {
                throw SyntaxError("Turndown could not convert some html constructs to Markdown");
            }
        });
        turnDownService.use(gfm);
        return turnDownService.turndown(text);
    };
};