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
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                {
                    code: 'createCuratorDiv()'
                })
        });
    } else {
        localStorage.setItem("VTCuratorMode", "false");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                {
                    code: 'removeCuratorDiv();'
                })
        });
        
    }
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

window.addEventListener('storage', function() {
    if (localStorage.getItem("VTCuratorMode") == "true") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                {
                    code: 'createCuratorDiv()'
                })
        });
    } else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                {
                    code: 'removeCuratorDiv();'
                })
        });
    }
});

// chrome.storage.local.onChange.addListener(function(changes, storageName){
//     chrome.browserAction.setBadgeText({"text": "1"});
// })
