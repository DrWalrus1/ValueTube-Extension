let changeColor = document.getElementById('changeColor');
let videoID;

//get videoID
chrome.tabs.query({active: true, currentWindow: true}, ([currentTab]) => {
    let url_string = currentTab.url;
    let url = new URL(url_string);
    videoID = url.searchParams.get("v");
})

chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
    let color = element.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {
              code: 'let ybody = document.getElementById("content");' +
              'ybody.style.backgroundColor = "' + color + '";'
        });
    });
};

