// Use strict mode (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)
"use strict";
require("codemirror/addon/mode/overlay.js");
var modes = require("../mode/package.js");

//Token static variables
function Token() {
}

Token.invalid = "Token.invalid";
Token.placeholder = "Token.placeholder";
Token.string = "Token.string";

// Create function
function CodeMirrorSpellChecker(options, placeholders) {
    // Initialize
    options = options || {};


    // Verify
    if (typeof options.codeMirrorInstance !== "function" || typeof options.codeMirrorInstance.defineMode !== "function") {
        console.log("CodeMirror Spell Checker: You must provide an instance of CodeMirror via the option `codeMirrorInstance`");
        return;
    }


    // Because some browsers don't support this functionality yet
    if (!String.prototype.includes) {
        String.prototype.includes = function () {
            "use strict";
            return String.prototype.indexOf.apply(this, arguments) !== -1;
        };
    }


    var placeholderNames = placeholders.map(function (it) {
        return it.name;
    });

    // Define the new mode
    options.codeMirrorInstance.defineMode("spell-checker-html", function (config) {
        var placeholdersCheck = function check(text) {
            var startsAsPlaceholder = text.startsWith("\${");
            var endsAsPlaceholder = text.endsWith("}");
            if (startsAsPlaceholder && endsAsPlaceholder) {
                var placeholder = text.slice("\${".length, text.length - "}".length);
                if (placeholderNames.includes(placeholder)) {
                    return Token.placeholder;
                } else {
                    return Token.invalid;
                }
            }
            else if (!startsAsPlaceholder && !endsAsPlaceholder) {
                return Token.string;
            }
            return Token.invalid;
        };

        // Define what separates a word
        var rx_word = "!\"#%&()*+,-./:;<=>?@[\\]^_`|~ ";


        // Create the overlay and such
        var overlay = {
            token: function (stream) {

                var ch = stream.peek();
                var word = "";

                if (rx_word.includes(ch)) {
                    stream.next();
                    return null;
                }

                var includeCurlyBracket = false;
                while ((ch = stream.peek()) != null && !rx_word.includes(ch)) {
                    if (ch === "$") {
                        word += ch;
                        stream.next();
                        ch = stream.peek();
                        if (ch === "{") {
                            includeCurlyBracket = true;
                        }
                    }
                    word += ch;
                    stream.next();
                    if (includeCurlyBracket && ch === "}") {
                        break;
                    }
                }

                var tokenType = placeholdersCheck(word);
                if (tokenType === Token.string) {
                    return null;
                }
                else if (tokenType === Token.placeholder) {
                    return "placeholder-token";
                }
                else if (tokenType === Token.invalid) {
                    return "invalid-token";
                }

                return null;
            }
        };

        return options.codeMirrorInstance.overlayMode(options.codeMirrorInstance.getMode(config, modes.htmlMode), overlay, true);
    });

    // Define the new mode
    options.codeMirrorInstance.defineMode("spell-checker-markdown", function (config) {
        var placeholdersCheck = function check(text) {
            var startsAsPlaceholder = text.startsWith("\${");
            var endsAsPlaceholder = text.endsWith("}");
            if (startsAsPlaceholder && endsAsPlaceholder) {
                var placeholder = text.slice("\${".length, text.length - "}".length);
                if (placeholderNames.includes(placeholder)) {
                    return Token.placeholder;
                } else {
                    return Token.invalid;
                }
            }
            else if (!startsAsPlaceholder && !endsAsPlaceholder) {
                return Token.string;
            }
            return Token.invalid;
        };

        // Define what separates a word
        var rx_word = "!\"#%&()*+,-./:;<=>?@[\\]^_`|~ ";


        // Create the overlay and such
        var overlay = {
            token: function (stream) {

                var ch = stream.peek();
                var word = "";

                if (rx_word.includes(ch)) {
                    stream.next();
                    return null;
                }

                var includeCurlyBracket = false;
                while ((ch = stream.peek()) != null && !rx_word.includes(ch)) {
                    if (ch === "$") {
                        word += ch;
                        stream.next();
                        ch = stream.peek();
                        if (ch === "{") {
                            includeCurlyBracket = true;
                        }
                    }
                    word += ch;
                    stream.next();
                    if (includeCurlyBracket && ch === "}") {
                        break;
                    }
                }

                var tokenType = placeholdersCheck(word);
                if (tokenType === Token.string) {
                    return null;
                }
                else if (tokenType === Token.placeholder) {
                    return "placeholder-token";
                }
                else if (tokenType === Token.invalid) {
                    return "invalid-token";
                }

                return null;
            }
        };

        return options.codeMirrorInstance.overlayMode(options.codeMirrorInstance.getMode(config, modes.markdownMode), overlay, true);
    });
}

function enable(codemirror, placeholders) {
    //Enable placeholders checking
    CodeMirrorSpellChecker({
        codeMirrorInstance: codemirror
    }, placeholders);
}

// Export
module.exports.enable = enable;
