let curatorInput = document.getElementById('curatorInput');
let videoID;

//get videoID
chrome.tabs.query({active: true, currentWindow: true}, ([currentTab]) => {
    let url_string = currentTab.url;
    let url = new URL(url_string);
    videoID = url.searchParams.get("v");
    //TODO: Add check to add ValueTube Section
})



curatorInput.onclick = function(element) {
    if (curatorInput.checked == true) {
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
};