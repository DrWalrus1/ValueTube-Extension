// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'www.youtube.com'}, //Extension on active on YouTube only
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "IsCurator")
      sendResponse({farewell: localStorage.getItem("VTCuratorMode")});
    else if (request.greeting == "SubmitVT") {
      sendCuratorData(request.data);
    }
});

function sendCuratorData(JForm) {
  var submit = new XMLHttpRequest();
  submit.open("POST", "https://api.valuetube.net/curator", true);
  submit.setRequestHeader("Content-Type", "application/json")
  submit.send(JSON.stringify(JForm));
  // submit.onload = function() {
  //   if (submit.status != 200) { // analyze HTTP status of the response
  //     sendResponse({farewell : false}); // e.g. 404: Not Found
  //   } else { // show the result
  //     // TODO: Error Handling
  //     sendResponse({farewell : true}); // response is the server
  //   }
  // }
}