let blackListSwitch = document.getElementById("bListSwitch");
let whiteListSwitch = document.getElementById("wListSwitch");
let activeSelect = document.getElementById("activeSelect");
let availableSelect = document.getElementById("availableSelect");
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
				code : "isEnabled = true;localStorage.setItem('AreFiltersEnabled', 'true');"
			}
			
		);
	} else {
		chrome.tabs.executeScript(
			tabID,
			{
				code : "isEnabled = false;localStorage.setItem('AreFiltersEnabled', 'false');"
			}
			
		);
	}
}

// chrome.storage.local.onChange.addListener(function(changes, storageName){
//     chrome.browserAction.setBadgeText({"text": "1"});
// })


async function addOptionsToSelect() {
	const simpleFilter = await getSimpleFilter();
	let active = simpleFilter.active;
	let available = simpleFilter.available;

	activeSelect.childNodes = new Array();
	availableSelect.childNodes = new Array();

	for (const i of active) {
		activeSelect.appendChild(createFilterOption(i));
	}
	for (const i of available) {
		availableSelect.appendChild(createFilterOption(i));
	}
}

function createFilterOption(filterName) {
	let value = filterName.replace('/', '').replace(' ', '');;
	let option = document.createElement("option");
	option.value = value;
	option.innerHTML = filterName;
	option.onclick = function () {
		let parentID = $(this).parent().attr("id");
		let newParentElement = activeSelect;
		if (parentID == "activeSelect") {
			newParentElement = availableSelect;
		}
		for (const child of newParentElement.childNodes) {
			if (this.innerHTML < child.innerHTML) {
				newParentElement.insertBefore(this, child)
			}
		}
		parentID = $(this).parent().attr("id");
		if (parentID != newParentElement.id) {
			newParentElement.appendChild(this);
		}
		this.selected = false;
		setSimpleFilter(getSelectedSimpleFilter());
	}

	return option;
}

function getSelectedSimpleFilter() {
	let active = [];
	let available = [];

	for (const i of activeSelect.children) {
		active.push(i.innerHTML);
	}
	for (const i of availableSelect.children) {
		available.push(i.innerHTML);
	}
	return {active, available};
}

addOptionsToSelect();