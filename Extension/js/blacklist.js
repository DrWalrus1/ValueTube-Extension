addButton();

function addButton() {
    let buttonDiv = document.getElementById("buttonDiv");
    buttonDiv.innerHTML = "";
    
    let button = document.createElement("button");
    button.id = "blackListBtn";
    button.className = "btn btn-primary btn-sm";
    button.innerText = "Search";
    button.onclick = function () {
        button.style += "background-color:blue;";
        console.log("hello");
    }
    buttonDiv.appendChild(button);
}

function createOptionDiv(name, imageSrc) {
    let div = document.createElement("div");
    div.onclick = function() {
        this.style = 'background-color:dodgerblue;color: white;';
    }
    div.tabIndex = "-1";
    let avatar = document.createElement("img");
    avatar.src = imageSrc;
    avatar.className = "avatar";

    let span = document.createElement("span");
    span.style = "display:inline-block;";
    let channelName = document.createElement("p");
    channelName.innerHTML = name;
    span.innerHTML = channelName;
}

async function searchYoutuber(name) {

}

async function getImage(url) {
	var outside;
	var proxy = "https://cors-anywhere.herokuapp.com/";
	return fetch(proxy + url)
		.then(response => response.blob())
		.then(images => {
	  		outside = URL.createObjectURL(images)
	  		return outside;
		});
}