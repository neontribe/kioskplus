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
	var timeoutID, intervalID, publicMethods = {};

	publicMethods.startTimer = function () {
		$("body").off("click.timeout");
		if ( options.debug ) {
			console.log("Starting " + options.timeoutAfter + " seconds countdown");
		}
		if ( !timeoutID ) {
			timeoutID = setTimeout(warning, options.timeoutAfter*1000);
			$("body").on("click.timeout", resetTimer);
		}
	};

	function resetTimer() {
		$("body").off("click.timeout");
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

		$("body").off("click.timeout");
		$("#timer").html(counter);

		if ( !$("#modal").length ) {
			var content = options.warningMessage.replace("[tp]", Math.round(options.timeoutAfter/60)).replace("[wp]", options.warningPeriod),
				$modal = $("<div id='modal'><p>" + content + "</p><p id='timer'>" + counter + "</p><button id='#continue'>Continue</button></div>");
			$modal.appendTo("body");
			$modal.leanModal({ closeButton: "#modal button", whenClosed: resetTimer }).trigger("open_modal");
		} else {
			$("#modal").trigger("open_modal");
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
				$("#timer").html(counter);
			}
		}, 1000);
	}

	return publicMethods;
})();

function slideshow() {
	var $body = $("body"),
		counter = options.totalSlides,
		animID;

	$body.html("<ul id='kioskSlideshow'></ul>").css("display", "block").addClass("slideshowReady");

	for(var i = 1; i <= options.totalSlides; i++) {
		$body.find("#kioskSlideshow").append("<li style='background:url(" + chrome.extension.getURL("images/slides/" + i + ".jpg") + ");'></li>");
	}

	$("#kioskSlideshow li").css("transition", "opacity 1s linear");

	animID = setInterval(function() {
		var prev = (counter - 1) % options.totalSlides;
		$("#kioskSlideshow li").eq(prev).removeClass("fadeIn").addClass("fadeOut");
		var current = counter % options.totalSlides;
		$("#kioskSlideshow li").eq(current).removeClass("fadeOut").addClass("fadeIn");
		counter++;
	}, 3000);
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
