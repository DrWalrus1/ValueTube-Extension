let disableComments = document.getElementById("blockCommentsInput");

if (localStorage.getItem("VTDisableComments") == "true") {
  disableComments.checked = true;
} else {
  disableComments.checked = false;
}


disableComments.onclick = function() {
  if (disableComments.checked == true) {
      localStorage.setItem("VTDisableComments", "true");
  } else {
      localStorage.setItem("VTDisableComments", "false");
  }
};