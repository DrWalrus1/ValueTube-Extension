let disableComments = document.getElementById("blockCommentsInput");
let developerMode = document.getElementById("enableDeveloperMode");
let developerNotifications = document.getElementById("enableDeveloperNotifications");
let advancedFilter = document.getElementById("ToggleAdvancedFilterInput");
let curatorInput = document.getElementById('curatorInput');

if (localStorage.getItem("VTDisableComments") == "true") {
  disableComments.checked = true;
}

if (localStorage.getItem("DeveloperMode") == "true") {
  developerMode.checked = true;
  document.getElementById("developerOptions").style.visibility = "visible";
}

if (localStorage.getItem("DeveloperNotifications") == "true") {
  developerNotifications.checked = true
}

if (localStorage.getItem("advancedFilter") == "true") {
  advancedFilter.checked = true;
  document.getElementById("advancedFilter").style.display = "block";
}

if (localStorage.getItem("VTCuratorMode") == "true") {
	curatorInput.checked = true;
}

advancedFilter.onchange = function() {
  if (advancedFilter.checked == true) {
    localStorage.setItem("advancedFilter", "true");
    document.getElementById("advancedFilter").style.display = "block";
  } else {
    localStorage.setItem("advancedFilter", "false");
    document.getElementById("advancedFilter").style.display = "none";
  }
}

disableComments.onchange = function() {
  if (disableComments.checked == true) {
      localStorage.setItem("VTDisableComments", "true");
  } else {
      localStorage.setItem("VTDisableComments", "false");
  }
  save_options();
};

developerMode.onchange = function() {
  if (developerMode.checked == true) {
    localStorage.setItem("DeveloperMode", "true");
    document.getElementById("developerOptions").style.visibility = "visible";
  } else {
    localStorage.setItem("DeveloperMode", "false");
    document.getElementById("developerOptions").style.visibility = "hidden";
  }
  console.log("Developer Mode value: " + developerMode.checked);
  console.log("Local Storage developer mode value: " + localStorage.getItem("DeveloperMode"));
  save_options();
}

developerNotifications.onchange = function() {
  if (developerNotifications.checked == true) {
      localStorage.setItem("DeveloperNotifications", "true");
  } else {
      localStorage.setItem("DeveloperNotifications", "false");
  }
  console.log("Developer notifications value: " + developerNotifications.checked);
  console.log("Local Storage developer notifications value: " + localStorage.getItem("DeveloperNotifications"));
  save_options();
};

curatorInput.onchange = function() {
	if (curatorInput.checked == true) {
		localStorage.setItem("VTCuratorMode", "true");
		modifyYoutubeTabsInWindows("Curator");
	} else {
		localStorage.setItem("VTCuratorMode", "false");   
	}
	modifyYoutubeTabsInWindows("Curator");
};

/**
 * Triggers the extension to search all tabs in
 * all windows to create or remove the curator input
 * div.
 */
function modifyYoutubeTabsInWindows(data) {
	chrome.windows.getAll({"populate": true, "windowTypes" :["normal"]}, function(windowArray) {
		// Iterate through windows
		for (let i = 0; i < windowArray.length; i++) {
			// Iterate through tabs in window
			for (let x = 0; x < windowArray[i].tabs.length; x++) {
				if (windowArray[i].tabs[x].url.includes("youtube.com")) {
          if (data == "Curator") {
            if (localStorage.getItem("VTCuratorMode") == "true") {
              SetCuratorDiv(true, windowArray[i].tabs[x].id);
            } else {
              SetCuratorDiv(false, windowArray[i].tabs[x].id);
            }
          } else if (data == "AdvFilters") {
            SetVideosDisplay(windowArray[i].tabs[x].id);
          }
				}
			}
		}
	})
}

/**
 * 
 * @param {Boolean} state 
 * @param {Number} tabID
 */
function SetCuratorDiv(state, tabID) {
	if (state) {
		chrome.tabs.executeScript(
			tabID,
			{
				code : "createCuratorDiv();"
			}
			
		);
	} else {
		chrome.tabs.executeScript(
			tabID,
			{
				code : "removeCuratorDiv();"
			}
			
		);
	}
}

/**
 * @param {Number} tabID
 */
function SetVideosDisplay(tabID) {
  chrome.tabs.executeScript(
    tabID,
      {
        code : "UpdateVideoDisplay(" + localStorage.getItem("AdvancedFilterVals") + ");"
      }
  )
}

/**
 * @param {String} sectionID
 * @param {Array<String>} categories 
 */
function createCategorySliders(sectionID, categories = getCategories()) {
  let section = document.getElementById(sectionID);
  if (section.children.length > 0) {
    return;
  }
  let column = document.createElement("div");
  let column2 = document.createElement("div");
  let column3 = document.createElement("div");
  column.style = "display:table-column;margin-left: 5px;";
  column2.style = "display:table-column;";
  column3.style = "display:table-column;";
  section.appendChild(column);
  section.appendChild(column2);
  section.appendChild(column3);
  for (const e of categories) {
    let newDiv = createCategorySlider(e);
    section.appendChild(newDiv);
    newDiv.children[1].click();
  }
}

/**
 * 
 * @param {String} category 
 */
function createCategorySlider(category) {
  let id = category.replace('/', '').replace(' ', '');
  let slider = document.createElement("input");
  slider.id = id+"Slider";
  slider.className = "d-table-cell border-0 rangeSlider";
  slider.type = "range";
  slider.min = "0";
  slider.max = "100";
  slider.step = "10";
  let advFilterVals = (localStorage.getItem("AdvancedFilterVals") == null)?{}:JSON.parse(localStorage.getItem("AdvancedFilterVals"));
  let storedVal = advFilterVals[category];
  slider.defaultValue = (storedVal == null)?"100":storedVal;
  // slider.onclick = function () {
  //   console.log(category + " onchange outer")
  //   const $valueSpan = $('#' + id + 'Span');
  //   const $value = $('#' + id + "Slider");
  //   $valueSpan.html($value.val());
  //   $value.on('input change', () => {
  //     console.log(category + " onchange inner")
  //     $valueSpan.html($value.val());
      
  //   //   let advFilterVals = (localStorage.getItem("AdvancedFilterVals") == null)?{}:JSON.parse(localStorage.getItem("AdvancedFilterVals"));
  //   //   //console.log(advFilterVals);
  //   //   advFilterVals[category] = $value.val();
  //   //   localStorage.setItem("AdvancedFilterVals", JSON.stringify(advFilterVals));
  //   //   modifyYoutubeTabsInWindows("AdvFilters");
  //   });
  //   document.getElementById(id+"Span").innerHTML = this.value;
  // }
  slider.oninput = function () {
    document.getElementById(id+"Span").innerHTML = this.value;
    let advFilterVals = (localStorage.getItem("AdvancedFilterVals") == null)?{}:JSON.parse(localStorage.getItem("AdvancedFilterVals"));
    console.log(advFilterVals);
    advFilterVals[category] = this.value;
    localStorage.setItem("AdvancedFilterVals", JSON.stringify(advFilterVals));
    modifyYoutubeTabsInWindows("AdvFilters");
  }

  let span = document.createElement("span");
  span.id = id+"Span";
  span.className = "d-table-cell font-weight-bold text-primary ml-2 mt-1 valueSpan";
  span.innerHTML = slider.value;

  let label = document.createElement("label");
  label.className = "d-block text-right";
  label.setAttribute("for", id+"Slider");
  label.innerHTML = category + ":";

  let cellDiv = document.createElement("div");
  cellDiv.className = "d-table-cell pl-1";
  cellDiv.appendChild(label);
  
  let div = document.createElement("div");
  div.className = "d-table-row justify-content-left my-3";
  div.style = "margin-top: 5px;";
  
  div.appendChild(cellDiv);
  div.appendChild(slider);
  div.appendChild(span);
  return div;
}

createCategorySliders("filterSection");