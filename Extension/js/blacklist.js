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
    let div = document.createElement("div");
    div.onclick = function() {
        this.style = 'background-color:dodgerblue;color: white;';
    }
    div.tabIndex = "0";
    let avatar = document.createElement("img");
    avatar.src = imageSrc;
    avatar.className = "avatar";

    let span = document.createElement("span");
    span.style = "display:inline-block;";
    let channelName = document.createElement("h5");
    channelName.innerText = name;
    span.appendChild(channelName);
    div.appendChild(avatar);
    div.appendChild(span);
    return div;
}

/**
 * 
 * @param {String} name 
 */
async function searchYoutuber(name) {
    name = name.replaceAll(" ", "");
    let request = new XMLHttpRequest();
    request.open('GET', 'https://api.valuetube.net/filter/youtuber?channelName=' + name);
    request.setRequestHeader("Content-Type", "application/json");
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
                let imgURL = await getImage(response.thumbnails.default.url)
                let channelTitle = response.title;
                let newOption = createOptionDiv(channelTitle, imgURL)
                resultsArea.appendChild(newOption);
				// console.log(response);
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