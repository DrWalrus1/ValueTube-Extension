let disableComments = document.getElementById("blockCommentsInput");
let developerMode = document.getElementById("enableDeveloperMode");
let developerNotifications = document.getElementById("enableDeveloperNotifications");
let advancedFilter = document.getElementById("ToggleAdvancedFilterInput");

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

/**
 * @param {String} sectionID
 * @param {Array<String>} categories 
 */
function createCategorySliders(sectionID, categories = JSON.parse(localStorage.getItem("categories"))) {
  let section = document.getElementById(sectionID);
  if (section.children.length > 0) {
    return;
  }
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
  slider.onclick = function () {
    const $valueSpan = $('#' + id + 'Span');
    const $value = $('#' + id + "Slider");
    $valueSpan.html($value.val());
    $value.on('input change', () => {

      $valueSpan.html($value.val());
    });
    document.getElementById(id+"Span").innerHTML = this.value;
  }
  // TODO: Set value to what is stored or 50;
  // slider.value = 0;

  let span = document.createElement("span");
  span.id = id+"Span";
  span.className = "d-table-cell font-weight-bold text-primary ml-2 mt-1 valueSpan";
  span.innerHTML = slider.value;
  let label = document.createElement("label");
  label.className = "d-table-cell";
  label.setAttribute("for", id+"Slider");
  label.innerHTML = category + ":";
  
  let div = document.createElement("div");
  div.className = "d-table justify-content-left my-3";
  div.style = "margin-top: 5px;";
  
  div.appendChild(label);
  div.appendChild(slider);
  div.appendChild(span);
  return div;
}

createCategorySliders("filterSection");