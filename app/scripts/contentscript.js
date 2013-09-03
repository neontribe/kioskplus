'use strict';
var options = {};

window.log = function () {
	log.history = log.history || [];
	log.history.push(arguments);
	if ( console && options.debug ) {
		console.log.apply(console, arguments);
	}
};

chrome.storage.local.get("options", function (result) {
	if ( result.options ) {
		options = result.options;
		init();
	} else {
		console.log("Error, cannot load extension options.");
	}
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	console.log(changes);
	if ( changes.options && changes.options.newValue ) {
		options = changes.options.newValue;
	}
	console.log("options changed");
	init();
});

function init() {

	console.log("Kioskplus running.");

	// Create custom :external selector
	$.expr[':'].external = function (obj) {
		return obj.href && !obj.href.match(/^mailto\:/) && (obj.hostname !== location.hostname);
	};

	// Find all external links
	var externalLinks = $("a:external");

	// Unwrap all external links
	if ( options.unwrapExternalLinks ) {
		externalLinks.contents().unwrap();
	}

	// Catch clicks to external links
	if ( options.catchExternalLinks ) {
		$("body").on("click", "a:external", function (evt) {
			evt.preventDefault();
			evt.stopImmediatePropagation();
			console.log("Prevented navigation from", evt.target);
		});
	}

	// Remove all targets from links to stop new tabs
	externalLinks.attr("target", null);

	// Remove any elements given in the options
	if ( options.elementsToRemove.length ) {
		$(options.elementsToRemove.join(", ")).remove();
	}
}
