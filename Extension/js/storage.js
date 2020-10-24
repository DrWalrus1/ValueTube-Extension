
function getOptions() {
	return {
		blacklist : (localStorage.getItem("Blacklist") === "true"),
		whitelist : (localStorage.getItem("Whitelist") === "true"),
		disableComments : (localStorage.getItem("VTDisableComments") === "true"),
		developerMode : (localStorage.getItem("DeveloperMode") === "true"),
		developerNotifications : (localStorage.getItem("DeveloperNotifications") === "true"),
	}
}

/**
 * Saves users options using the Storage.sync API
 */
function save_options() {
	let options = getOptions();
	chrome.storage.sync.set(options, function () {
		console.log("Options have been saved.");
	});
}
  
/**
 * Restores users options from storage using the Storage.sync API
 */
function restore_options() {
	chrome.storage.sync.get({
		disableComments : false,
		developerMode : false,
		developerNotifications : false,
	}, function (items) {
		disableComments.checked = items.disableComments;
		developerMode.checked = items.developerMode;
		developerNotifications.checked = items.developerNotifications;
		console.log("Options have been restored.");
	});
}
  
/**
 * Resets user options to default
 */
function reset_options() {
	chrome.storage.sync.set({
	disableComments : false,
	developerNotifications : false,
	// Add remaining options
	}, function  () {
	alert("ValueTube Options have been reset.");
	});
}
