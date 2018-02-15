/*global require,module*/
"use strict";
var CodeMirror = require("codemirror");
require("codemirror/addon/edit/continuelist.js");

//Tablist package
require("./codemirror/tablist");

//Utils package
var utils = require("./utils/package");

//Extensions package
var tagsbar = require("./extensions/tagsbar");
var html = require("./extensions/htmlMode");
var CodeMirrorSpellChecker = require("./extensions/spellcheck");
var autocomplete = require("./extensions/autocomplete");

//Modes package
var modes = require("./mode/package");

//Toggles package
var toggles = require("./toggles/package");

//Toolbar package
var toolbar = require("./toolbar/package");

//CodeMirror package
require("codemirror/addon/display/fullscreen.js");
require("codemirror/mode/markdown/markdown.js");
require("codemirror/addon/mode/overlay.js");
require("codemirror/addon/display/placeholder.js");
require("codemirror/addon/selection/mark-selection.js");
require("codemirror/mode/gfm/gfm.js");
require("codemirror/mode/xml/xml.js");

//Converters package
var marked = require("marked");


// Merge an arbitrary number of objects into one.
function extend(target) {
	for(var i = 1; i < arguments.length; i++) {
		target = utils.mergeProperties(target, arguments[i]);
	}

	return target;
}


var insertTexts = {
	link: ["[", "](#url#)"],
	image: ["![](", "#url#)"],
	table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text     | Text     |\n\n"],
	horizontalRule: ["", "\n\n-----\n\n"]
};

var promptTexts = {
	link: "URL for the link:",
	image: "URL of the image:"
};

var blockStyles = {
	"bold": "**",
	"code": "```",
	"italic": "*"
};

SimpleMDE.instances = [];

/**
 * Interface of SimpleMDE.
 */
function SimpleMDE(options) {
	// Get options from predefined function
	options = options || {};

	// Set default options for parsing config
	options = extend(options, getSimpleMdeOptions(options.element.id) || {});

	if(options.enableAutocompletion) {
		CodeMirror.hint.markdown = autocomplete.createHints(options.autocompleteHints);
		CodeMirror.hint.html = autocomplete.createHints(options.autocompleteHints);
	}


	// Used later to refer to it"s parent
	options.parent = this;


	// Auto download FA
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = "https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css";
	document.getElementsByTagName("head")[0].appendChild(link);


	// Find the textarea to use
	if(options.element) {
		this.element = options.element;
	} else if(options.element === null) {
		// This means that the element option was specified, but no element was found
		console.log("SimpleMDE: Error. No element was found.");
		return;
	}

	//Handle tagsbar
	options.tagsbar = [];

	for(var index = 0; index < options.placeholders.length; index++) {
		var obj = options.placeholders[index];
		options.tagsbar.push({
			name: obj.name,
			description: obj.description,
			group: obj.group,
			action: toggles.addText
		});
	}


	// Handle toolbar
	options.toolbar = [];
	// Loop over the built in buttons, to get the preferred order
	for(var key in toolbar.toolbarBuiltInButtons) {
		if(toolbar.toolbarBuiltInButtons.hasOwnProperty(key)) {
			if(toolbar.toolbarBuiltInButtons[key].name === "switchMode" && !options.isHtmlEnabled) {
				continue;
			}

			if(key.indexOf("separator-") !== -1) {
				options.toolbar.push("|");
			}

			if(toolbar.toolbarBuiltInButtons[key].default === true) {
				options.toolbar.push(key);
			}
		}
	}


	// Add default preview rendering function
	options.previewRender = function(plainText) {
		// Note: "this" refers to the options object
		return this.parent.markdown(plainText);
	};


	// Set default options for parsing config
	options.parsingConfig = extend({
		highlightFormatting: true // needed for toggleCodeBlock to detect types of code
	}, options.parsingConfig || {});


	// Merging the insertTexts, with the given options
	options.insertTexts = extend({}, insertTexts, options.insertTexts || {});


	// Merging the promptTexts, with the given options
	options.promptTexts = promptTexts;


	// Merging the blockStyles, with the given options
	options.blockStyles = extend({}, blockStyles, options.blockStyles || {});

	// Update this options
	this.options = options;


	// Auto render
	this.render(this.element);

	SimpleMDE.instances.push(this);
}

/**
 * Default markdown render.
 */
SimpleMDE.prototype.markdown = function(text) {
	if(marked) {
		var markedOptions = {
			gfm: true,
			breaks: true
		};
		marked.setOptions(markedOptions);
		return marked(text);
	}
};

/**
 * Render editor to the given element.
 */
SimpleMDE.prototype.render = function(el) {
	if(this._rendered && this._rendered === el) {
		// Already rendered.
		return;
	}

	this.element = el;
	var options = this.options;

	var keyMaps = {
		"Ctrl-Space": "autocomplete"
	};

	CodeMirrorSpellChecker({
		codeMirrorInstance: CodeMirror
	}, options.placeholders);

	this.codemirror = CodeMirror.fromTextArea(el, {
		mode: modes.spellCheckMode,
		backdrop: modes.markdownMode,
		theme: "paper",
		tabSize: (options.tabSize !== undefined) ? options.tabSize : 2,
		indentUnit: (options.tabSize !== undefined) ? options.tabSize : 2,
		indentWithTabs: (options.indentWithTabs !== false),
		lineNumbers: false,
		autofocus: (options.autofocus === true),
		extraKeys: keyMaps,
		lineWrapping: (options.lineWrapping !== false),
		allowDropFileTypes: ["text/plain"],
		styleSelectedText: (options.styleSelectedText !== undefined) ? options.styleSelectedText : true
	});

	this.gui = {};

	if(this.options.isToolsbarEnabled) {
		this.gui.toolbar = toolbar.createToolbar(this);
	}
	if(this.options.isTagsbarEnabled) {
		this.gui.tagsbar = tagsbar.createTagsbar(this);
	}

	this._rendered = this.element;

	if(this.options.isSmallSize) {
		this.codemirror.getWrapperElement().className += " CodeMirror-small";
	}

	if(this.options.currentMode === "HTML") {
		html.fromHTML(this);
		this.options.currentMode = "Markdown";
	}

	if(this.options.enableAutocompletion) {
		this.codemirror.on("keyup", autocomplete.keyUpAutocompleteHandler);
	}


	// Fixes CodeMirror bug (#344)
	var temp_cm = this.codemirror;
	setTimeout(function() {
		temp_cm.refresh();
	}.bind(temp_cm), 0);
};


/**
 * Get or set the text content.
 */
SimpleMDE.prototype.value = function(val) {
	if(val === undefined) {
		return this.codemirror.getValue();
	} else {
		this.codemirror.getDoc().setValue(val);
		return this;
	}
};


SimpleMDE.saveHTML = html.saveHTML;
SimpleMDE.saveMarkdown = html.saveMarkdown;

module.exports = SimpleMDE;