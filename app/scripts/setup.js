// Global options
var options = {
	// remove links to external sites
	// e.g. 'This is <a href="http://www.google.com">link</a>.'
	// becomes 'This is a link.'
	unwrapExternalLinks: true,

	// Listen to clicks that try and go to external sites
	// and stop them quietly
	catchExternalLinks: true,

	// Listen to web requests at the chrome extension level, and
	// redirect them
	useWebRequestsAPI: false,

	// The target URL to use on the above strategy
	redirectURL: "http://www.archivealive.org/",

	// URLs containing this domain are allowed
	allowedHost: "archivealive.org",

	// array of element selectors, each of which will be removed
	// from all pages
	elementsToRemove: [".socials"],

	// Whether or not to show debug messages in the dev console
	debug: true
};

// Shared functions
window.log = function () {
	log.history = log.history || [];
	log.history.push(arguments);
	if ( console && options.debug ) {
		console.log.apply(console, arguments);
	}
};