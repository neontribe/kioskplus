// Saves options to localStorage
function save_options(e) {
	e.preventDefault();
	var options = {};

	options.unwrapExternalLinks = Boolean($("[name='unwrapExternalLinks']:checked").val());
	options.catchExternalLinks = Boolean($("[name='catchExternalLinks']:checked").val());
	options.useWebRequestsAPI = Boolean($("[name='useWebRequestsAPI']:checked").val());
	options.allowedHost = $("[name='allowedHost']").val();
	options.elementsToRemove = $("[name='elementsToRemove']").val().split(",");
	options.timeout = Boolean($("[name='timeout']:checked").val());
	options.timeoutAfter = $("[name='timeoutAfter']").val();
	options.warningPeriod = $("[name='warningPeriod']").val();
	options.debug = Boolean($("[name='debug']:checked").val());

	chrome.storage.local.set({ "options": options }, function () {
		// Update status to let user know options were saved
		$("#status").fadeIn();
		setTimeout(function () {
			$("#status").fadeOut();
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
		$("[name='debug']").attr("checked", options.debug);
	});
}

document.addEventListener("DOMContentLoaded", restore_options);
document.querySelector("#save").addEventListener("click", save_options);
