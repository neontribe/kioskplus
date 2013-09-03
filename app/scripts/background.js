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
	'use strict';
	console.log("background init");
	var lastUrl;

	// listen to main frame web requests
	if ( options.useWebRequestsAPI ) {
		chrome.webRequest.onBeforeRequest.addListener(
			function (details) {
				console.log("evaluating request", details);
				if ( details.url.indexOf(options.allowedHost) === -1 ) {
					return {
						redirectUrl: lastUrl
					}
				}
				// record the last allowed URL, because we can assume that
				// if was valid and the last page they loaded
				lastUrl = details.url;
				console.log("Last allowed URL", lastUrl);
			},
			{
				urls: ["<all_urls>"],
				types: ["main_frame"]
			},
			["blocking"]
		);
	}
}
