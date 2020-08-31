const categoryArray = ["Alcohol", "Comedy", "Conspiracy", "Drugs", "Educational", "Gambling", "Gaming", "Horror", "LGBT", "Memes", "Movies", "Music", "News", "Politics", "Promotional", "Relationships", "Religion", "Self-harm", "Sports", "Suggestive content", "Thrill Seeking", "Tutorial", "TV Shows", "Violence", "Vlog", "Weaponry"];
let primaryInner = document.getElementById("primary-inner");

window.onload = function() {
    chrome.runtime.sendMessage({greeting: "IsCurator"}, function(response) {
        if (!document.getElementById("VTCurator") && response.farewell == "true") {createCuratorDiv();}
    })
};
function createCuratorDiv() {
    if (document.getElementById("VTCurator")) {
        return;
    }
    let primaryInner = document.getElementById("primary-inner");
    let curatorDiv = document.createElement("div");
    curatorDiv.setAttribute('id', 'VTCurator');
    curatorDiv.setAttribute('class', 'style-scope ytd-watch-flexy');
    let metaIndex;
    for (let index = 0; index < primaryInner.childNodes.length; index++) {
        if (primaryInner.childNodes[index].id ==="meta") {
            metaIndex = index;
            break;
        }
    }
    primaryInner.insertBefore(curatorDiv, primaryInner.childNodes[metaIndex+1]);

    curatorDiv = document.getElementById("VTCurator");
    // Now we are modifying inside curatorDiv
    let a = document.createElement("ytd-video-secondary-info-renderer");
    a.setAttribute('class', 'style-scope ytd-watch-flexy');
    curatorDiv.appendChild(a);
    // clear autogenerated content
    a.innerHTML = "";

    let VTForm = document.createElement("form");
    VTForm.setAttribute("id", "VTForm");
    VTForm.setAttribute("name", "VTForm");
    VTForm.setAttribute("enctype", "multipart/form-data");
    VTForm.setAttribute("action", "https://api.valuetube.net/curator")
    VTForm.setAttribute("method", "post");
    VTForm.setAttribute("target", "_blank");
    a.appendChild(VTForm);

    let heading = document.createElement("h2");
    heading.innerHTML = "ValueTube Curator";
    heading.setAttribute('class', 'title style-scope ytd-video-primary-info-renderer');
    heading.setAttribute("style", "padding-bottom:5px;");
    VTForm.appendChild(heading);
    let b = document.createElement("ytd-expander");
    b.setAttribute('class', 'style-scope ytd-video-secondary-info-renderer');
    b.setAttribute('style', '--ytd-expander-collapsed-height:80px;');
    b.setAttribute('collapsed', '""');
    VTForm.appendChild(b);
    let content;
    //Add show more and show less button
    for (let index = 0; index < b.childNodes.length; index++) {
        if (b.childNodes[index].id == "content") {
            content = b.childNodes[index];
        } else if (b.childNodes[index].id == "less") {
            let less = document.createElement("yt-formatted-string");
            less.setAttribute('class', 'less-button style-scope ytd-video-secondary-info-renderer');
            less.setAttribute('slot', 'less-button');
            less.setAttribute('role', 'button');
            b.childNodes[index].appendChild(less);
            less.innerHTML = "Show Less";
        } else if (b.childNodes[index].id == "more") {
            let more = document.createElement("yt-formatted-string");
            more.setAttribute('class', 'less-button style-scope ytd-video-secondary-info-renderer');
            more.setAttribute('slot', 'more-button');
            more.setAttribute('role', 'button');
            b.childNodes[index].appendChild(more);
            more.innerHTML = "Show More";
        }
    }
    let c = document.createElement("div");
    c.setAttribute('id', 'content')
    c.setAttribute('class', 'style-scope ytd-expander');
    content.appendChild(c);
    // d will contain checkboxes
    let d = document.createElement("yt-formatted-string");
    d.setAttribute('class', 'content style-scope ytd-video-secondary-info-renderer');
    d.setAttribute('force-default-style', '""');
    d.setAttribute('split-lines', '""');
    c.appendChild(d);
    d.innerHTML = addCategories(categoryArray);

    //secondary info renderer
    let infoRenderer = document.createElement("div");
    infoRenderer.setAttribute("class", "style-scope ytd-video-secondary-info-renderer");
    VTForm.appendChild(infoRenderer);
    infoRenderer.innerHTML = "";

    
    // Submit button
    let buttonDiv = document.createElement("div");
    buttonDiv.setAttribute("class", "style-scope ytd-video-secondary-info-renderer");
    
    infoRenderer.appendChild(buttonDiv);

    let buttonRenderer = document.createElement("ytd-subscribe-button-renderer");
    buttonRenderer.setAttribute("class", "style-scope ytd-video-secondary-info-renderer");
    buttonRenderer.setAttribute("use-keyboard-focused", "");
    buttonRenderer.setAttribute("style", "display:flow-root; text-align:right;");

    buttonDiv.appendChild(buttonRenderer);
    buttonRenderer.innerHTML = "";

    let paperButton = document.createElement("paper-button");
    paperButton.setAttribute("noink", "");
    paperButton.setAttribute("id", "VTSubmitButton");
    paperButton.setAttribute("class", "style-scope ytd-subscribe-button-renderer");
    paperButton.setAttribute("role", "button");
    paperButton.setAttribute("tabindex", "0");
    paperButton.setAttribute("animated", "");
    paperButton.setAttribute("elevation", "0");
    paperButton.setAttribute("aria-disabled", "false");
    paperButton.setAttribute("style", "background-color: #00a6ff; display: inline-block; margin-right: 40px;");

    paperButton.setAttribute("onclick", "window.postMessage('SubmitVT', '*')");

    buttonRenderer.appendChild(paperButton);

    let formattedString = document.createElement("yt-formatted-string");
    formattedString.setAttribute("class", "style-scope ytd-subscribe-button-renderer")
    formattedString.setAttribute("style", "");
    
    paperButton.appendChild(formattedString);
    formattedString.innerHTML = "Submit";
    
}

function addCategories(categoryArray) {
    let innerHTML = "<div id=\"categories\" style=\"column-count:2;\">";
    categoryArray.forEach(element => {
        innerHTML += "<input type=\"checkbox\" id=\"" + element + "\" name=\"filters[]\" value=\"" + element + "\"><label for=\"" + element + "\">" + element + "</label><br>";
    });

    innerHTML += "</div>";
    return innerHTML;
}

function removeCuratorDiv() {
    primaryInner = document.getElementById("primary-inner");
    for (let index = 0; index < primaryInner.childNodes.length; index++) {
        if (primaryInner.childNodes[index].id === "VTCurator") {
            primaryInner.removeChild(primaryInner.childNodes[index]);
            break;
        }
    }
}

function getVideoID() {
    let url = new URLSearchParams(window.location.search);
    return url.get('v');
}


// TODO: Add user feedback to button
window.addEventListener("message", function(event) {
    if (event.source != window)
        return

    if (event.data && (event.data == "SubmitVT")) {
        // TODO: Error Handling
        let JForm = CreateJForm();
        chrome.runtime.sendMessage({greeting : "SubmitVT", data : JForm}, function (response) {
            if (response.farewell == true) {
                console.error("An Error occured trying to add your curated filters.");
            } else if (response.farewell == false) {
                console.log("Success! Curated Filters added.");
            }
        });
    }
})

function CreateJForm() {
    let formData = new FormData(document.forms.namedItem("VTForm")); 
    let JForm = {"vID" : getVideoID()};
        
    for (var pair of formData.entries()) {
        if (pair[0].includes("[]")) {
            if (pair[0] in JForm) {
                JForm[pair[0]].push(pair[1]);
            } else {
                JForm[pair[0]] = [pair[1]];
            }
        } else {
            JForm[pair[0]] = pair[1];
        }
    }
    return JForm;
}