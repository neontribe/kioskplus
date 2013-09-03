// Saves options to localStorage
function save_options() {
	var options = {};

	options.unwrapExternalLinks = Boolean($("[name='unwrapExternalLinks']:checked").val());
	options.catchExternalLinks = Boolean($("[name='catchExternalLinks']:checked").val());
	options.useWebRequestsAPI = Boolean($("[name='useWebRequestsAPI']:checked").val());
	options.allowedHost = $("[name='allowedHost']").val();
	options.elementsToRemove = $("[name='elementsToRemove']").val().split(",");

	chrome.storage.local.set({ "options": options }, function () {
		// Update status to let user know options were saved
		$("#status").html("Options Saved.");
		setTimeout(function () {
			$("#status").fadeOut(function () {
				$(this).html("");
			});
		}, 750);
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
	});
}

document.addEventListener("DOMContentLoaded", restore_options);
document.querySelector("#save").addEventListener("click", save_options);
