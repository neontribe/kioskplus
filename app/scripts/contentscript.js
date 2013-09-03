"use strict";
var options = {};

// Load options
chrome.storage.local.get("options", function (result) {
	if ( result.options ) {
		options = result.options;
		init();
	} else {
		if ( options.debug ) {
			console.log("Error, cannot load extension options.");
		}
	}
});

// Listen for changes to options and re-initialise
chrome.storage.onChanged.addListener(function(changes, namespace) {
	console.log(changes);
	if ( changes.options && changes.options.newValue ) {
		options = changes.options.newValue;
	}
	init();
});

// Create custom :external selector
$.expr[':'].external = function (obj) {
	return obj.href && !obj.href.match(/^mailto\:/) && (obj.hostname !== location.hostname);
};

// Timeout module
var timeout = (function () {
	var timeoutID, publicMethods = {};

	publicMethods.startTimer = function () {
		if ( options.debug ) {
			console.log("Starting " + options.timeoutAfter + " seconds countdown");
		}
		timeoutID = setTimeout(warning, options.timeoutAfter*1000);
		$("body").one("click.timeout", resetTimer);
	};

	function resetTimer() {
		clearTimeout(timeoutID);
		publicMethods.startTimer();
	}

	function warning() {
		console.log("warning");
		$("body").off("click.timeout");
		//alert("Timeout!");

		var $modal = $("<div id='modal'><p>Timeout!</p></div>");
		$modal.appendTo("body");
		$modal.leanModal().trigger("open_modal");
	}

	return publicMethods;
})();

// Main
function init() {

	if ( options.debug ) {
		console.log("Kioskplus content script initialising");
	}

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
			if ( options.debug ) {
				console.log("Prevented navigation from", evt.target);
			}
		});
	}

	// Remove all targets from links to stop new tabs
	externalLinks.attr("target", null);

	// Remove any elements given in the options
	if ( options.elementsToRemove.length ) {
		var $condemned = $(options.elementsToRemove.join(", "));
		if ( options.debug ) {
			console.log("Removing " + $condemned.length + " elements");
		}
		$condemned.remove();
	}

	// Inactivity timeout
	if ( options.timeout ) {
		timeout.startTimer();
	}
}
