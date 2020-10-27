let blackListSwitch = document.getElementById("bListSwitch");
let whiteListSwitch = document.getElementById("wListSwitch");


if (localStorage.getItem("Blacklist") == "true") {
	blackListSwitch.checked = true;
}

if (localStorage.getItem("Whitelist") == "true") {
	whiteListSwitch.checked = true;
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