var marked = require("marked");

module.exports = function (text) {
    var markedOptions = {
        gfm: true,
        breaks: true
    };
    marked.setOptions(markedOptions);
    return marked(text);
};


