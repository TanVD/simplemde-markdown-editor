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
var spellchecker = require("./extensions/spellcheck");
var autocomplete = require("./extensions/autocomplete");

var lang = require("./languages/languages");

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
	// Set default options for parsing config
	this.options = extend(options, JSON.parse(options.element.getAttribute("simpleMdeConfig")) || {});

	// Auto download FA
	downloadFa();

	// Find the textarea to use
	if(options.element) {
		this.element = options.element;
	} else if(options.element === null) {
		// This means that the element option was specified, but no element was found
		console.log("SimpleMDE: Error. No textarea was found.");
		return;
	}

	initTexts(this);

	// Auto render
	this.render();

	SimpleMDE.instances.push(this);
}

function initTexts(editor) {
	// Merging the insertTexts, with the given options
	editor.options.insertTexts = extend({}, insertTexts, editor.options.insertTexts || {});

	// Merging the blockStyles, with the given options
	editor.options.blockStyles = extend({}, blockStyles, editor.options.blockStyles || {});
}

function downloadFa() {
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = "https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css";
	document.getElementsByTagName("head")[0].appendChild(link);
}

/**
 * Render editor to the given element.
 */
SimpleMDE.prototype.render = function() {
	var options = this.options;

	if(this._rendered && this._rendered === this.element) {
		return;
	}

	spellchecker.enable(CodeMirror, options.placeholders);

	//Set lang state
	this.lang = {
		list: options.modes,
		current: options.startMode
	};
	if(!this.lang.current) {
		this.lang.current = this.autodetectLanguage(this.element.value);
	}

	this.codemirror = CodeMirror.fromTextArea(this.element, {
		mode: modes.getSpellCheckMode(this.lang.current),
		backdrop: modes.getMode(this.lang.current),
		theme: "paper",
		tabSize: (options.tabSize !== undefined) ? options.tabSize : 2,
		indentUnit: (options.tabSize !== undefined) ? options.tabSize : 2,
		indentWithTabs: (options.indentWithTabs !== false),
		lineNumbers: options.lineNumbers === true,
		autofocus: (options.autofocus === true),
		extraKeys: {
			"Ctrl-Space": "autocomplete"
		},
		lineWrapping: (options.lineWrapping !== false),
		allowDropFileTypes: ["text/plain"],
		styleSelectedText: (options.styleSelectedText !== undefined) ? options.styleSelectedText : true
	});

	//Add codemirror and simplemde to textarea
	this.element.codemirror = this.codemirror;
	this.element.simplemde = this;


	this.gui = {};
	if(this.options.isToolsbarEnabled) {
		this.gui.toolbar = toolbar.createToolbar(this);
	}
	if(this.options.isTagsbarEnabled) {
		this.tagsbar = [];
		for(var index = 0; index < options.placeholders.length; index++) {
			var obj = options.placeholders[index];
			this.tagsbar.push({
				name: obj.name,
				description: obj.description,
				group: obj.group,
				action: toggles.addText
			});
		}
		this.gui.tagsbar = tagsbar.createTagsbar(this);
	}

	//Set size of CodeMirror editor
	setSize(this);

	if(options.enableAutocompletion) {
		autocomplete.enable(this);
	}

	//Reset editor to mode applicable for current text
	this.resetLangToCurrentText();


	//End rendering
	this._rendered = this.element;

	// Fixes CodeMirror bug (#344)
	var temp_cm = this.codemirror;
	setTimeout(function() {
		temp_cm.refresh();
	}.bind(temp_cm), 0);
};

SimpleMDE.prototype.resetLangToCurrentText = function() {
	var inputTextMode = this.autodetectLanguage();
	var currentMode = this.lang.current;
	if(inputTextMode !== currentMode) {
		var inputLang = lang.languages[inputTextMode];
		inputLang.setMode(this);
	}
};

function setSize(editor) {
	switch(editor.options.size) {
		case("Small"):
			{
				editor.codemirror.getWrapperElement().className += " CodeMirror-small";
				break;
			}
		case("Standard"):
			{
				editor.codemirror.getWrapperElement().className += " CodeMirror-standard";
				break;
			}
		default:
			{
				throw "Unknown size of SimpleMde " + editor.options.size;
			}
	}
}

SimpleMDE.prototype.autodetectLanguage = function(text) {
	if(text === null || text === undefined) {
		text = this.value();
	}
	if(text.match("/<\w+>/g")) {
		return lang.languages.HTML.name;
	} else {
		if(this.lang.list.indexOf(lang.languages.Markdown.name) !== -1) {
			return lang.languages.Markdown.name;
		} else {
			return lang.languages.PlainText.name;
		}
	}
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


module.exports = SimpleMDE;