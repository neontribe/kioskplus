'use strict';

log("Kioskplus running.");

// Create custom :external selector
$.expr[':'].external = function (obj) {
	return obj.href && !obj.href.match(/^mailto\:/) && (obj.hostname !== location.hostname);
};

// Find all external links
var externalLinks = $("a:external");
log(externalLinks);

// Unwrap all external links
if ( options.unwrapExternalLinks ) {
	externalLinks.contents().unwrap();
}

// Catch clicks to external links
if ( options.catchExternalLinks ) {
	$("body").on("click", "a:external", function (evt) {
		evt.preventDefault();
		evt.stopImmediatePropagation();
		log("Prevented navigation from", evt.target);
	});
}

// Remove all targets from links to stop new tabs
externalLinks.attr("target", null);

// Remove any elements given in the options
if ( options.elementsToRemove.length ) {
	$(options.elementsToRemove.join(", ")).remove();
}
