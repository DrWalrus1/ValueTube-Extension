'use strict';
const API_PAGES = {
  curator : "https://api.valuetube.net/curator",
  filter : "https://api.valuetube.net/filter",
  categories : "https://api.valuetube.net/mongo/categories"
}

chrome.runtime.onStartup.addListener(function() {
  updateCategories();
});

chrome.runtime.onInstalled.addListener(function(details) {
  updateCategories();
  var contextMenuItem = {
    "id": "ValueTube",
    "title": "Check video against filters",
    "contexts": ["link"],
    "targetUrlPatterns": ["*://www.youtube.com/watch*"]
  };
  
  chrome.contextMenus.create(contextMenuItem);
  
  chrome.contextMenus.onClicked.addListener(function(clickData) {
    if (clickData.menuItemId == "ValueTube" && clickData.linkUrl) {
      let vID = getVideoID(new URL(clickData.linkUrl));
      sendFilterData([vID]);
    }
  });

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
    switch (request.greeting) {
      case "IsCurator":
        sendResponse({farewell: localStorage.getItem("VTCuratorMode")});
        break;
      case "SubmitVT":
        (async () => {
          const response = await sendCuratorData(request.data);
          console.log(response);
          sendResponse({farewell : response});
        })();
        
        return true;
        break;
      case "DisableComments":
        sendResponse({farewell: localStorage.getItem("VTDisableComments")});
        break;
      case "Filter":
        (async () => {
          const response = await sendFilterData(request.data);
          console.log(response);
          sendResponse({farewell : response});
        })();
        return true;
        break;
      case "GetCategories":
        sendResponse({farewell: JSON.parse(localStorage.getItem("categories"))});
        break;
      default:
        sendResponse({farewell: "Unknown message received by extension."});
        break;
      
    }      
    return true; 
});

/**
 * 
 * @param {URL} url 
 */
function getVideoID(url) {
  return (new URLSearchParams(url.search)).get('v');
}

/**
 * Sends Curator Data to ValueTube API
 * @param {Object} JForm 
 */
function sendCuratorData(JForm) {
  return new Promise((resolve, reject) => {
    var submit = new XMLHttpRequest();
    submit.open("POST", API_PAGES.curator, true);
    submit.setRequestHeader("Content-Type", "application/json");
    submit.send(JSON.stringify(JForm));
    submit.onload = function() {
      if (submit.status != 200) { // analyze HTTP status of the response
        return false; // e.g. 404: Not Found
      } else { // show the result
        // TODO: Error Handling
        // return true; // response is the server
      }
    }
      
    submit.onreadystatechange = function() {
      if (submit.readyState === 4) {
        createCuratorNotification(JSON.parse(submit.response));
        resolve (JSON.parse(submit.response));
      }
    }
  });
}

/**
 * Sends an string array of videoIDs via an XMLHttpRequest to ValueTube API
 * @param {Array<String>} videoIDs 
 */
function sendFilterData(videoIDs) {
  return new Promise((resolve, reject)=> {
    var submit = new XMLHttpRequest();
    submit.open("POST", API_PAGES.filter, true);
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
        resolve(JSON.parse(submit.response));
      }
    }
  });
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

function updateCategories() {
  let request = new XMLHttpRequest();
  request.open('GET', API_PAGES.categories);
  request.setRequestHeader("Content-Type", "application/json");
  request.send();

  request.onload = function() {
    if (request.status != 200) { // analyze HTTP status of the response
      return false; // e.g. 404: Not Found
    } else { // show the result
      // TODO: Error Handling
      return true; // response is the server
    }
  }
  
  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      let response = JSON.parse(request.response);
      if (response.confirmation != "success") {
        console.error("Failed to retreive categories.");
      } else {
        chrome.storage.sync.set({
          categories : response.categories
        }, function() {
          localStorage.setItem("categories", JSON.stringify(response.categories));
          console.log("Categories Updated.");
        });
      }
    }
  }
}