"use strict";
var options = {};

// Load options
chrome.storage.local.get("options", function (result) {
	if ( result.options ) {
		options = result.options;
		// only run on configured domain
		if ( window.top.location.hostname && window.top.location.hostname.match(options.allowedHost) ) {
			init();
		}
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
	var timeoutID, intervalID, publicMethods = {};

	publicMethods.startTimer = function () {
		$("body").off(".timeout");
		if ( options.debug ) {
			console.log("Starting " + options.timeoutAfter + " seconds countdown");
		}
		if ( !timeoutID ) {
			timeoutID = setTimeout(warning, options.timeoutAfter*1000);
			$("body").on("click.timeout touchend.timeout", resetTimer);
		}
	};

	function resetTimer() {
		$("body").off(".timeout");
		if ( timeoutID ) {
			clearTimeout(timeoutID);
			timeoutID = null;
		}
		if ( intervalID ) {
			clearInterval(intervalID);
			intervalID = null;
		}
		publicMethods.startTimer();
	}

	function warning() {
		var counter = options.warningPeriod;

		$("body").off(".timeout");
		$("#kioskModalTimer").html(counter);

		if ( !$("#kioskModal").length ) {
			var content = options.warningMessage.replace("[tp]", Math.round(options.timeoutAfter/60)).replace("[wp]", options.warningPeriod),
				$modal = $("<div id='kioskModal'><p>" + content + "</p><p id='kioskModalTimer'>" + counter + "</p><button>Continue</button></div>");
			$modal.appendTo("body");
			$modal.leanModal({ closeButton: "#kioskModal button", whenClosed: resetTimer }).trigger("open_modal");
		} else {
			$("#kioskModal").trigger("open_modal");
		}

		intervalID = setInterval(function () {
			counter--;
			if ( counter === 0 ) {
				// maximum grace period reached, fade to slideshow
				clearInterval(intervalID);
				intervalID = null;

				$("html").css("backgroundColor", "#000");
				$("body").fadeOut(2000, slideshow);

				//alert("Bam!");
			} else {
				$("#kioskModalTimer").html(counter);
			}
		}, 1000);
	}

	return publicMethods;
})();

// Slideshow
function slideshow() {
	var $body = $("body"),
		counter = options.totalSlides,
		animID;

	// Scaffold body element
	$body.html("<ul id='kioskSlideshow'></ul>").css("display", "block").addClass("slideshowReady");
	window.scrollTo(0);

	// Remove any head scripts to be on the safe side
	$("head script").remove();

	// Set up slides
	for(var i = 1; i <= options.totalSlides; i++) {
		$body.find("#kioskSlideshow").append("<li style='background-image:url(" + chrome.extension.getURL("images/slides/" + i + ".jpg") + ");'></li>");
	}

	// Transition duration
	$("#kioskSlideshow li").css("transition", "opacity " + options.transitionDuration + "s linear");

	// Home button
	$("<div id='kioskSlideshowTagline'>" + options.slideshowTagline + "</div>").appendTo($body).fadeIn(1500);

	// Cyclical animation
	animID = setInterval(function() {
		var prev = (counter - 1) % options.totalSlides,
			current = counter % options.totalSlides;
		$("#kioskSlideshow li").eq(prev).removeClass("fadeIn").addClass("fadeOut");
		$("#kioskSlideshow li").eq(current).removeClass("fadeOut").addClass("fadeIn");
		counter++;
	}, options.slideDelay * 1000);

	// Redirect to home on click
	$body.one("click touchend", function () {
		clearInterval(animID);
		$body.fadeOut(2000, function () {
			location.href = location.origin;
		});
	});
}

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
