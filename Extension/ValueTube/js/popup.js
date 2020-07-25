let curatorInput = document.getElementById('curatorInput');
let videoID;

//get videoID
chrome.tabs.query({active: true, currentWindow: true}, ([currentTab]) => {
    let url_string = currentTab.url;
    let url = new URL(url_string);
    videoID = url.searchParams.get("v");
    //TODO: Add check to add ValueTube Section
})



