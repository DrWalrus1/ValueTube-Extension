const categoryArray = ["Alcohol", "Conspiracy", "Drugs", "Educational", "Gambling", "Gaming", "Horror", "LGBT", "Memes", "Politics", "Relationships", "Religion", "Self-harm", "Sports", "Suggestive content", "Thrill Seeking", "Violence", "Weaponry", "News", "Music"];
let primaryInner = document.getElementById("primary-inner");

chrome.runtime.sendMessage({greeting: "IsCurator"}, function(response) {
    if (!document.getElementById("VTCurator") && response.farewell == "true") {createCuratorDiv();}
})

// 

function createCuratorDiv() {
    // TODO: Add check to see if curator element already exists 
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
    // TODO: set attributes
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
    paperButton.setAttribute("class", "style-scope ytd-subscribe-button-renderer");
    paperButton.setAttribute("role", "button");
    paperButton.setAttribute("tabindex", "0");
    paperButton.setAttribute("animated", "");
    paperButton.setAttribute("elevation", "0");
    paperButton.setAttribute("aria-disabled", "false");
    paperButton.setAttribute("style", "background-color: #00a6ff; display: inline-block; margin-right: 40px;");
    paperButton.setAttribute("onclick", "console.log(document.getElementById('VTForm'))"); //TODO: Pass data to VT API

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
        innerHTML += "<input type=\"checkbox\" id=\"" + element + "\" name=\"" + element + "\"><label for=\"" + element + "\">" + element + "</label><br>";
    });

    innerHTML += "</div>";
    return innerHTML;
}

function removeCuratorDiv() {
    for (let index = 0; index < primaryInner.childNodes.length; index++) {
        if (primaryInner.childNodes[index].id === "VTCurator") {
            primaryInner.removeChild(primaryInner.childNodes[index]);
            break;
        }
    }
}

function CollectFormData() {
    const formData = new FormData(document.querySelector('form'));
    for (var pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
    }
}

/* HTML LAYOUT
<div id="VTCurator" class="style-scope ytd-watch-flexy">
    <ytd-video-secondary-info-renderer class="style-scope ytd-watch-flexy">
        <h2 class="title style-scope ytd-video-primary-info-renderer">ValueTube Curator</h2>
        <ytd-expander class="style-scope ytd-video-secondary-info-renderer" style="--ytd-expander-collapsed-height:80px;" collapsed="">
            <!--css-build:shady-->
            <div id="content" class="style-scope ytd-expander">
                <yt-formatted-string class="content style-scope ytd-video-secondary-info-renderer" force-default-style="" split-lines="">
                    <span dir="auto" class="style-scope yt-formatted-string">If you want more MEME REVIEW click HERE: </span>
                </yt-formatted-string>
            </div>
        
            <paper-button id="less" aria-expanded="true" noink="" class="style-scope ytd-expander" hidden="" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false">
            <!--css-build:shady-->
            </paper-button>
            <paper-button id="more" aria-expanded="false" noink="" class="style-scope ytd-expander" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false" hidden="">
            <!--css-build:shady-->
            </paper-button>
        </ytd-expander>
    </ytd-video-secondary-info-renderer>
    <div id="top-row" class="style-scope ytd-video-secondary-info-renderer">
        <ytd-video-owner-renderer class="style-scope ytd-video-secondary-info-renderer">
            <!--css-build:shady-->
            <a class="yt-simple-endpoint style-scope ytd-video-owner-renderer" tabindex="-1">
                <yt-img-shadow id="avatar" width="48" class="style-scope ytd-video-owner-renderer no-transition">
                    <!--css-build:shady-->
                    <img id="img" class="style-scope yt-img-shadow" alt="" width="48">
                </yt-img-shadow>
            </a>
            <div id="upload-info" class="style-scope ytd-video-owner-renderer">
                <ytd-channel-name id="channel-name" wrap-text="" class="style-scope ytd-video-owner-renderer">
                    <!--css-build:shady-->
                    <div id="container" class="style-scope ytd-channel-name">
                        <div id="text-container" class="style-scope ytd-channel-name">
                            <yt-formatted-string id="text" title="" class="style-scope ytd-channel-name">
                                <!--css-build:shady-->
                            </yt-formatted-string>
                        </div>
                        <paper-tooltip fit-to-visible-bounds="" offset="10" class="style-scope ytd-channel-name" role="tooltip" tabindex="-1">
                            <!--css-build:shady-->
                            <div id="tooltip" class="hidden style-scope paper-tooltip">
                            </div>
                        </paper-tooltip>
                    </div>
                    <ytd-badge-supported-renderer class="style-scope ytd-channel-name" disable-upgrade="" hidden="">
                    </ytd-badge-supported-renderer>
                </ytd-channel-name>
                <yt-formatted-string id="owner-sub-count" class="style-scope ytd-video-owner-renderer">
                    <!--css-build:shady-->
                </yt-formatted-string>
            </div>
            <div id="sponsor-button" class="style-scope ytd-video-owner-renderer">
            </div>
            <div id="analytics-button" class="style-scope ytd-video-owner-renderer">
            </div>
        </ytd-video-owner-renderer>
        <div id="subscribe-button" class="style-scope ytd-video-secondary-info-renderer">
            <ytd-subscribe-button-renderer class="style-scope ytd-video-secondary-info-renderer" use-keyboard-focused="">
                <!--css-build:shady-->
                <paper-button noink="" class="style-scope ytd-subscribe-button-renderer" role="button" tabindex="0" animated="" elevation="0" aria-disabled="false" style="background-color: #317ce6;">
                    <!--css-build:shady-->
                    <yt-formatted-string class="style-scope ytd-subscribe-button-renderer" style="">Submit<!--css-build:shady--></yt-formatted-string>
                    <paper-ripple class="style-scope paper-button">
                        <!--css-build:shady-->
                        <div id="background" class="style-scope paper-ripple"></div>
                        <div id="waves" class="style-scope paper-ripple"></div>
                    </paper-ripple>
                </paper-button>
                <div id="notification-preference-toggle-button" class="style-scope ytd-subscribe-button-renderer" hidden=""></div>
                <div id="notification-preference-button" class="style-scope ytd-subscribe-button-renderer" hidden=""></div>
            </ytd-subscribe-button-renderer>
        </div>
    </div>
</div>
*/