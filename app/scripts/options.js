// Saves options to localStorage
function save_options(e) {
	e.preventDefault();
	var options = {};

	$("#save").text("Saving...").attr("disabled", true);

	options.unwrapExternalLinks = Boolean($("[name='unwrapExternalLinks']:checked").val());
	options.catchExternalLinks = Boolean($("[name='catchExternalLinks']:checked").val());
	options.useWebRequestsAPI = Boolean($("[name='useWebRequestsAPI']:checked").val());
	options.allowedHost = $("[name='allowedHost']").val();
	options.elementsToRemove = $("[name='elementsToRemove']").val().split(",");
	options.timeout = Boolean($("[name='timeout']:checked").val());
	options.timeoutAfter = $("[name='timeoutAfter']").val();
	options.warningPeriod = $("[name='warningPeriod']").val();
	options.warningMessage = $("[name='warningMessage']").val();
	options.totalSlides = $("[name='totalSlides']").val();
	options.slideDelay = $("[name='slideDelay']").val();
	options.transitionDuration = $("[name='transitionDuration']").val();
	options.slideshowTagline = $("[name='slideshowTagline']").val();
	options.debug = Boolean($("[name='debug']:checked").val());

	chrome.storage.local.set({ "options": options }, function () {
		// Let user know options were saved
		$("#save").text("Options saved");
		setTimeout(function () {
			$("#save").text("Save").attr("disabled", false);
		}, 1500);
	});
}

// Restores elements to saved value from localStorage
function restore_options() {
	var options;
	chrome.storage.local.get("options", function (result) {
		options = result.options;
		$("[name='unwrapExternalLinks']").attr("checked", options.unwrapExternalLinks);
		$("[name='catchExternalLinks']").attr("checked", options.catchExternalLinks);
		$("[name='useWebRequestsAPI']").attr("checked", options.useWebRequestsAPI);
		$("[name='allowedHost']").val(options.allowedHost);
		$("[name='elementsToRemove']").val(options.elementsToRemove);
		$("[name='timeout']").attr("checked", options.timeout);
		$("[name='timeoutAfter']").val(options.timeoutAfter);
		$("[name='warningPeriod']").val(options.warningPeriod);
		$("[name='warningMessage']").val(options.warningMessage);
		$("[name='totalSlides']").val(options.totalSlides);
		$("[name='slideDelay']").val(options.slideDelay);
		$("[name='transitionDuration']").val(options.transitionDuration);
		$("[name='slideshowTagline']").val(options.slideshowTagline);
		$("[name='debug']").attr("checked", options.debug);
	});
}

document.addEventListener("DOMContentLoaded", restore_options);
document.querySelector("#save").addEventListener("click", save_options);
