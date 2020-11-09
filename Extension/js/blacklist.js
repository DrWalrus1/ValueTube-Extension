let input = document.getElementById("blackListInput");
let resultsArea = document.getElementById("resultsArea");
addButton();

function addButton() {
    let buttonDiv = document.getElementById("buttonDiv");
    buttonDiv.innerHTML = "";
    
    let button = document.createElement("button");
    button.id = "blackListBtn";
    button.className = "btn btn-primary btn-sm";
    button.innerText = "Search";
    button.type = "submit";
    button.onclick = function () {
        button.style += "background-color:blue;";
        searchYoutuber(input.value);
    }
    buttonDiv.appendChild(button);
}

function createOptionDiv(name, imageSrc) {
    let optionDiv = document.createElement("div");
    optionDiv.className = "option";
    optionDiv.tabIndex = "0";
    let avatar = document.createElement("img");
    avatar.src = imageSrc;
    avatar.className = "avatar";

    let span = document.createElement("span");
    span.style = "display:inline-block;";
    let channelName = document.createElement("h5");
    channelName.innerText = name;
    span.appendChild(channelName);
    
    
    let infoDiv = document.createElement("div");
    infoDiv.appendChild(avatar);
    infoDiv.appendChild(span);

    let button = document.createElement("button");
    button.className = "blacklistButton";
    button.innerText = "Add";
    let buttonDiv = document.createElement("div");
    buttonDiv.appendChild(button);

    optionDiv.appendChild(infoDiv);
    optionDiv.appendChild(buttonDiv);
    return optionDiv;
}

/**
 * 
 * @param {String} name 
 */
async function searchYoutuber(name) {
    let request = new XMLHttpRequest();
    resultsArea.innerHTML = "";
    request.open('GET', 'https://api.valuetube.net/filter/youtuber?channelName=' + name);
    request.setRequestHeader("Content-Type", "application/json");
    // request.setRequestHeader("Access-Control-Allow-Origin", "*");
  	request.send();

  	request.onload = function() {
		if (request.status != 200) { // analyze HTTP status of the response
			return false; // e.g. 404: Not Found
		} else { // show the result
			return true; // response is the server
		}
  	}
  
	request.onreadystatechange = async function() {
		if (request.readyState === 4) {
			let response = JSON.parse(request.response);
			if (response) {
                for (const i of response.result) {
                    let imgURL = await getImage(i.thumbnailURL);
                    let channelTitle = i.title;
                    let newOption = createOptionDiv(channelTitle, imgURL);
                    resultsArea.appendChild(newOption);
                }
			} else {
				console.error("Something went wrong. Please try again");
			}
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
		});
}

input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchYoutuber(this.value);
    }
})