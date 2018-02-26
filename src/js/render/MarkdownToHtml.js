var marked = require("marked");
var $ = require("jquery");

module.exports.getRenderer = function (editor) {
    switch (editor.renderer.markdownToHtml.type) {
        case("marked") : {
            return function(text) {
                var markedOptions = {
                    gfm: true,
                    breaks: true
                };
                marked.setOptions(markedOptions);
                marked(text);
            };
        }
        case("ajax") : {
            return function(text) {
                var result = "";
                $.ajax({
                    url: editor.renderer.markdownToHtml.url,
                    dataType: "json",
                    data: {
                        "text": text
                    },
                    async: false,
                    success: function (obj, textStatus) {
                        result = obj.text;
                    }
                });
                return result;
            };
        }
    }
};


