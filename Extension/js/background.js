'use strict';

chrome.runtime.onInstalled.addListener(function(details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });


  if (details.reason == "install") {
    // this logic executes
  } else if(details.reason == "update") {
    // perform some logic
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "IsCurator")
      sendResponse({farewell: localStorage.getItem("VTCuratorMode")});
    else if (request.greeting == "SubmitVT")
      sendCuratorData(request.data);
    else if (request.greeting == "DisableComments")
      sendResponse({farewell: localStorage.getItem("VTDisableComments")})
    else if (request.greeting == "FilterHome") {
      // TODO: Send to API
      sendFilterData(request.data);
      // sendResponse({farewell: true, data: request.data});
    }
});

function sendCuratorData(JForm) {
  var submit = new XMLHttpRequest();
  submit.open("POST", "https://api.valuetube.net/curator", true);
  submit.setRequestHeader("Content-Type", "application/json");
  submit.send(JSON.stringify(JForm));
  submit.onload = function() {
    if (submit.status != 200) { // analyze HTTP status of the response
      return false; // e.g. 404: Not Found
    } else { // show the result
      // TODO: Error Handling
      return true; // response is the server
    }
  }
    
  submit.onreadystatechange = function() {
    if (submit.readyState === 4) {
      createCuratorNotification(JSON.parse(submit.response));
    }
  }
}

function sendFilterData(videoIDs) {
  var submit = new XMLHttpRequest();
  submit.open("POST", "https://api.valuetube.net/filter", true);
  submit.setRequestHeader("Content-Type", "application/json");
  submit.send(JSON.stringify({videoIDs : videoIDs}));
  submit.onload = function() {
    if (submit.status != 200) { // analyze HTTP status of the response
      return false; // e.g. 404: Not Found
    } else { // show the result
      // TODO: Error Handling
      return true; // response is the server
    }
  }
  
  submit.onreadystatechange = function() {
    if (submit.readyState === 4) {
      console.log(submit.response);
    }
  }

}

function createNotification(data) {
  let img = data["video"]["imgURL"] || 'ValueTube48.png';
}

/**
 * 
 * @param {Object} object 
 */
async function createCuratorNotification(object) {
  if (object["confirmation"] == "success") {
    var url = await getImage(object["video"]["imgURL"]);
      var notificationOptions = {
        type: 'basic',
        iconUrl: url,
        title: 'Video Added!',
        message: "Video: \"" + object["video"]["title"] + "\" has been added to the database."
      };
      chrome.notifications.create("CuratorSuccess", notificationOptions);
  } else if (object["confirmation"] == "fail") {
    if (object["error"]["code"] == 501) {
      var notificationOptions = {
        type: 'basic',
        iconUrl: '../images/ValueTube48.png',
        title: 'Video already exists!',
        message: "Video: \"" + object["snippet"]["title"] + "\" has already been added to the database."
      };
      chrome.notifications.create("CuratorFail", notificationOptions);
    }
  }
}

async function getImage(url) {
  var outside;
  var proxy = "https://cors-anywhere.herokuapp.com/";
  return fetch(proxy + url)
    .then(response => response.blob())
    .then(images => {
      outside = URL.createObjectURL(images)
      return outside;
    })
}

function createUpdateNotification() {
  chrome.browserAction.setBadgeText({"text": "1"});
  browser.browserAction.setBadgeBackgroundColor({color: "red"})
}
