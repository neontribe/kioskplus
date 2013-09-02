'use strict';

var lastUrl;

// listen to main frame web requests
if ( options.useWebRequestsAPI ) {
	chrome.webRequest.onBeforeRequest.addListener(
		function (details) {
			log("evaluating request", details);
			if ( details.url.indexOf(options.allowedHost) === -1 ) {
				return {
					redirectUrl: lastUrl
				}
			}
			// record the last allowed URL, because we can assume that
			// if was valid and the last page they loaded
			lastUrl = details.url;
			log("Last allowed URL", lastUrl);
		},
		{
			urls: ["<all_urls>"],
			types: ["main_frame"]
		},
		["blocking"]
	);
}