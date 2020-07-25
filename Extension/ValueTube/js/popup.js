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
    //TODO: Add check to add ValueTube Section
})



curatorInput.onclick = function(element) {
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