"use strict";
var options = {};

// Load options
chrome.storage.local.get("options", function (result) {
	if ( result.options ) {
		options = result.options;
		init();
	} else {
		// if we can't load options, populate them with some defaults
		var options = {
			// remove links to external sites
			// e.g. 'This is <a href="http://www.google.com">link</a>.'
			// becomes 'This is a link.'
			unwrapExternalLinks: true,

			// Listen to clicks that try and go to external sites
			// and stop them quietly
			catchExternalLinks: true,

			// Listen to web requests at the chrome extension level, and
			// redirect them back to the last allowed page
			useWebRequestsAPI: false,

			// URLs containing this domain are allowed
			allowedHost: "archivealive.org",

			// array of element selectors, each of which will be removed
			// from all pages
			elementsToRemove: [".socials"],

			// Timeout related
			timeout: true,
			timeoutAfter: 300,
			warningPeriod: 20,

			// Whether or not to show debug messages in the dev console
			debug: true
		};
		chrome.storage.local.set({ "options": options }, function () {
			init();
		});
	}
});

// Listen to changes on options and re-initialise
chrome.storage.onChanged.addListener(function(changes, namespace) {
	console.log(changes);
	if ( changes.options && changes.options.newValue ) {
		options = changes.options.newValue;
	}
	console.log("options changed");
	init();
});


// Main
function init() {
	'use strict';
	var lastUrl;

	if ( options.debug ) {
		console.log("Background script initialising");
	}

	// listen to main frame web requests
	if ( options.useWebRequestsAPI ) {

		chrome.webRequest.onBeforeRequest.addListener(
			function (details) {
				if ( options.debug ) {
					console.log("Evaluating request", details);
				}
				if ( details.url.indexOf(options.allowedHost) === -1 ) {
					return {
						redirectUrl: lastUrl
					}
				}
				// record the last allowed URL, because we can assume that
				// if was valid and the last page they loaded
				lastUrl = details.url;
				if ( options.debug ) {
					console.log("Last allowed URL", lastUrl);
				}
			},
			{
				urls: ["<all_urls>"],
				types: ["main_frame"]
			},
			["blocking"]
		);

	}
}
