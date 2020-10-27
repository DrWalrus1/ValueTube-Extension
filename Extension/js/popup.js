let blackListSwitch = document.getElementById("bListSwitch");
let whiteListSwitch = document.getElementById("wListSwitch");
let filterSwitch = document.getElementById("FilterSwitch");

if (localStorage.getItem("AreFiltersEnabled") == "true") {
    filterSwitch.checked = true;
}

if (localStorage.getItem("Blacklist") == "true") {
	blackListSwitch.checked = true;
}

if (localStorage.getItem("Whitelist") == "true") {
	whiteListSwitch.checked = true;
}

filterSwitch.onchange = function() {
    if (filterSwitch.checked == true) {
        localStorage.setItem("AreFiltersEnabled", "true");
    } else {
        localStorage.setItem("AreFiltersEnabled", "false");
    }
    SetIsEnabledInWindows();
}

blackListSwitch.onchange = function() {
	if (blackListSwitch.checked == true) {
		localStorage.setItem("Blacklist", "true");
		whiteListSwitch.checked = false;
		whiteListSwitch.onchange();
	} else {
		localStorage.setItem("Blacklist", "false");
	}
	save_options();
}

whiteListSwitch.onchange = function() {
	console.log("changed");
	if (whiteListSwitch.checked == true) {
		localStorage.setItem("Whitelist", "true");
		blackListSwitch.checked = false;
		blackListSwitch.onchange();
	} else {
		localStorage.setItem("Whitelist", "false");
	}
	save_options();
}

function SetIsEnabledInWindows() {
    chrome.windows.getAll({"populate": true, "windowTypes" :["normal"]}, function(windowArray) {
		// Iterate through windows
		for (let i = 0; i < windowArray.length; i++) {
			// Iterate through tabs in window
			for (let x = 0; x < windowArray[i].tabs.length; x++) {
				if (windowArray[i].tabs[x].url.includes("youtube.com")) {
                    if (localStorage.getItem("AreFiltersEnabled") == "true") {
                        SetIsEnabled(true, windowArray[i].tabs[x].id);
                    } else {
                        SetIsEnabled(false, windowArray[i].tabs[x].id);
                    }
                }
            }
        }
    })
}

/**
 * 
 * @param {Boolean} state 
 * @param {Number} tabID
 */
function SetIsEnabled(state, tabID) {
	if (state) {
		chrome.tabs.executeScript(
			tabID,
			{
				code : "isEnabled = true;"
			}
			
		);
	} else {
		chrome.tabs.executeScript(
			tabID,
			{
				code : "isEnabled = false;"
			}
			
		);
	}
}

// chrome.storage.local.onChange.addListener(function(changes, storageName){
//     chrome.browserAction.setBadgeText({"text": "1"});
// })


function activeToAvailable () {
    var active = document.getElementsByClassName('active');
    var available = document.getElementsByClassName('available');
    var activeSelect = document.getElementById('act')
    var availableSelect = document.getElementById('ava')
    var option = document.getElementsByTagName('option');

        for (x of option) {
            if (x.selected == true && !activeSelect.contains(x)){
                activeSelect.appendChild(x);}
        }; 
    }


    
function availableToActive () {

    var active = document.getElementsByClassName('active');
    var available = document.getElementsByClassName('available');
    var activeSelect = document.getElementById('act')
    var availableSelect = document.getElementById('ava')
    var option = document.getElementsByTagName('option');

    for (x of option) {
        if (x.selected == true && !availableSelect.contains(x)){
            availableSelect.appendChild(x);}
    }; 

}