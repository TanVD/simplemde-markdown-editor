function renderPlain(text, placeholders) {
    for (var i = 0; i < placeholders.length; i++) {
        var placeholder = placeholders[i];
        var regex = RegExp("\\${" + placeholder.name + "}", "g");
        text = text.replace(regex, placeholder.example);
    }
    return text;
}

function renderWithStyles(text, placeholders, styles) {
    for (var i = 0; i < placeholders.length; i++) {
        var placeholder = placeholders[i];
        var regex = RegExp("\\${" + placeholder.name + "}", "g");
        text = text.replace(regex, "<span class=\"" + styles[placeholder.group] + "\">" + placeholder.example + "</span>");
    }
    return text;
}

module.exports.render = renderPlain;
module.exports.renderWithStyles = renderWithStyles;
