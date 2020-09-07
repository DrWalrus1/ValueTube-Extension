let curatorInput = document.getElementById('curatorInput');
let videoID;

if (localStorage.getItem("VTCuratorMode") == "true") {
    document.getElementById("curatorInput").checked = true;
}

//get videoID
chrome.tabs.query({active: true, currentWindow: true}, ([currentTab]) => {
    let url_string = currentTab.url;
    let url = new URL(url_string);
    videoID = url.searchParams.get("v");
})



curatorInput.onclick = function() {
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
