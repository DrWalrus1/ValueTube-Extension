let curatorInput = document.getElementById('curatorInput');
let blackListSwitch = document.getElementById("bListSwitch");
let whiteListSwitch = document.getElementById("wListSwitch");

if (localStorage.getItem("VTCuratorMode") == "true") {
    curatorInput.checked = true;
}

if (localStorage.getItem("Blacklist") == "true") {
    blackListSwitch.checked = true;
}

if (localStorage.getItem("Whitelist") == "true") {
    whiteListSwitch.checked = true;
}

curatorInput.onchange = function() {
    if (curatorInput.checked == true) {
        localStorage.setItem("VTCuratorMode", "true");
        modifyYoutubeTabsInWindows();
    } else {
        localStorage.setItem("VTCuratorMode", "false");   
    }
    modifyYoutubeTabsInWindows();
};

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

/**
 * Triggers the extension to search all tabs in
 * all windows to create or remove the curator input
 * div.
 */
function modifyYoutubeTabsInWindows() {
    //let expression = "^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.youtube.com*(:[0-9]{1,5})?(\/.*)?$";
    chrome.windows.getAll({"populate": true, "windowTypes" :["normal"]}, function(windowArray) {
        // Iterate through windows
        for (let i = 0; i < windowArray.length; i++) {
            // Iterate through tabs in window
            for (let x = 0; x < windowArray[i].tabs.length; x++) {
                if (windowArray[i].tabs[x].url.includes("youtube.com")) {
                    if (localStorage.getItem("VTCuratorMode") == "true") {
                        SetCuratorDiv(true, windowArray[i].tabs[x].id);
                    } else {
                        SetCuratorDiv(false, windowArray[i].tabs[x].id);
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
function SetCuratorDiv(state, tabID) {
    if (state) {
        chrome.tabs.executeScript(
            tabID,
            {
                code : "createCuratorDiv();"
            }
            
        );
    } else {
        chrome.tabs.executeScript(
            tabID,
            {
                code : "removeCuratorDiv();"
            }
            
        );
    }
}

// chrome.storage.local.onChange.addListener(function(changes, storageName){
//     chrome.browserAction.setBadgeText({"text": "1"});
// })
