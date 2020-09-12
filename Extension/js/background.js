// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

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
    else if (request.greeting == "SubmitVT") {
      sendResponse({farewell: sendCuratorData(request.data)});
    } else if (request.greeting == "FilterHome") {
      // TODO: Send to API
      sendResponse({farewell: true, data: request.data});
    }
});

function sendCuratorData(JForm) {
  var submit = new XMLHttpRequest();
  submit.open("POST", "https://api.valuetube.net/curator", true);
  submit.setRequestHeader("Content-Type", "application/json")
  submit.send(JSON.stringify(JForm));
  submit.onload = function() {
    if (submit.status != 200) { // analyze HTTP status of the response
      return false; // e.g. 404: Not Found
    } else { // show the result
      // TODO: Error Handling
      console.log("hello");
      return true; // response is the server
    }
  }
}

function createNotification() {

}

function createUpdateNotification() {
  chrome.browserAction.setBadgeText({"text": "1"});
  browser.browserAction.setBadgeBackgroundColor({color: "red"})
}
