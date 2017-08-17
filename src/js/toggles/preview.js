/**
 * Preview action.
 */
function togglePreview(editor) {
    var cm = editor.codemirror;
    var wrapper = cm.getWrapperElement();
    var toolbar_div = wrapper.previousSibling;
    var toolbar = editor.options.toolbar ? editor.toolbarElements.preview : false;
    var preview = wrapper.lastChild;
    if (!preview || !/editor-preview/.test(preview.className)) {
        preview = document.createElement("div");
        preview.className = "editor-preview";
        wrapper.appendChild(preview);
    }
    if (/editor-preview-active/.test(preview.className)) {
        preview.className = preview.className.replace(
            /\s*editor-preview-active\s*/g, ""
        );
        if (toolbar) {
            toolbar.className = toolbar.className.replace(/\s*active\s*/g, "");
            toolbar_div.className = toolbar_div.className.replace(/\s*disabled-for-preview*/g, "");
        }
    } else {
        // When the preview button is clicked for the first time,
        // give some time for the transition from editor.css to fire and the view to slide from right to left,
        // instead of just appearing.
        setTimeout(function () {
            preview.className += " editor-preview-active";
        }, 1);
        if (toolbar) {
            toolbar.className += " active";
            toolbar_div.className += " disabled-for-preview";
        }
    }
    preview.innerHTML = editor.options.previewRender(editor.value(), preview);
}

module.exports.togglePreview = togglePreview;