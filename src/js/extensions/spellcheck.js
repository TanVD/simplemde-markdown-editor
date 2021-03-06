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

function defineSpellCheckMode(codemirror, placeholders, name, backdrop) {
    var placeholderNames = placeholders.map(function (it) {
        return it.name;
    });

    codemirror.defineMode(name, function (config) {
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

        return codemirror.overlayMode(codemirror.getMode(config, backdrop), overlay, true);
    });
}

// Create function
function CodeMirrorSpellChecker(codemirror, placeholders) {
    // Because some browsers don't support this functionality yet
    if (!String.prototype.includes) {
        String.prototype.includes = function () {
            "use strict";
            return String.prototype.indexOf.apply(this, arguments) !== -1;
        };
    }

    defineSpellCheckMode(codemirror, placeholders, "spell-checker-html", modes.htmlMode);

    defineSpellCheckMode(codemirror, placeholders, "spell-checker-markdown", modes.markdownMode);

    defineSpellCheckMode(codemirror, placeholders, "spell-checker-plaintext", modes.plainTextMode);
}

function enable(codemirror, placeholders) {
    //Enable placeholders checking
    CodeMirrorSpellChecker(codemirror, placeholders);
}

// Export
module.exports.enable = enable;
