let disableComments = document.getElementById("blockCommentsInput");
let developerMode = document.getElementById("enableDeveloperMode");
let developerNotifications = document.getElementById("enableDeveloperNotifications");

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



disableComments.onchange = function() {
  if (disableComments.checked == true) {
      localStorage.setItem("VTDisableComments", "true");
  } else {
      localStorage.setItem("VTDisableComments", "false");
  }
  console.log("Disable comments value: " + disableComments.checked);
  console.log("Local storage comments value: " + localStorage.getItem("VTDisableComments"));
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
