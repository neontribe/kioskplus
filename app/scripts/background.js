'use strict';

// listen to main frame web requests
if ( options.useWebRequestsAPI ) {
	chrome.webRequest.onBeforeRequest.addListener(function (details) {
		log("evaluating request", details);
		if ( details.url.indexOf(options.allowedHost) === -1 ) {
			return {
				redirectUrl: options.redirectURL
			}
		}
	}, {
		urls: ["<all_urls>"],
		types: ["main_frame"]
	}, ["blocking"]);
}