const windowMessages = {
    SendCurator : "SubmitVT",
    FilterHome : "FilterHome",
    SearchPage : "SearchPage",
    GetCategories : "GetCategories"
};
let categoryArray = [];
chrome.runtime.sendMessage({greeting : "GetCategories"}, function(response) {
    categoryArray = response.farewell;
});
const page = {
    HOME : "https://www.youtube.com/",
    TRENDING : "https://www.youtube.com/feed/trending",
    SUBSCRIPTIONS : "https://www.youtube.com/feed/subscriptions",
    SEARCH : "https://www.youtube.com/results",
    VIDEO : "https://www.youtube.com/watch",
    CHANNEL : ["https://www.youtube.com/c", "https://www.youtube.com/user"], // FIXME: Multiple urls
    PLAYLIST : "https://www.youtube.com/playlist",
    MIX : "https://www.youtube.com/watch?v=&list="
};

let primaryInner = document.getElementById("primary-inner");

//Checks on initial visit to youtube page
window.onload = function() {
    OnPageChange();
};

//Checks on page change (YouTube does partial loads and can be detected by 'yt-navigate-start' and 'yt-navigate-finish')
window.addEventListener('yt-navigate-finish', OnPageChange);

/**
 * 
 * @param {URL} url 
 */
function getVideoID(url = new URL(window.location.href)) {
    return (new URLSearchParams(url.search)).get('v');
}

// FIXME
function OnPageChange() {
    switch (window.location.href) {
        case (page.HOME):
            window.postMessage(windowMessages.FilterHome, '*');
            break;
        // case (page.TRENDING):
            // FilterTrendingPage();
            // break;
        // case (page.SUBSCRIPTIONS):
            // FilterSubscriptionsPage();
            // break;
        default:
            if ( (window.location.href).includes(page.VIDEO)) {
                chrome.runtime.sendMessage({greeting: "IsCurator"}, function(response) {
                    if (!document.getElementById("VTCurator") && response.farewell == "true") {
                        createCuratorDiv();
                    }
                });
                chrome.runtime.sendMessage({greeting: "DisableComments"}, function(response) {
                    if (response.farewell == "true") {
                        removeComments();
                    }
                });

                GetRecommendationFeedIDs();

                if ( (window.location.href).includes("&list=")) {
                    GetPlaylistIDs();
                }

            } else if ((window.location.href).includes(page.SEARCH)) {
                window.postMessage(windowMessages.SearchPage, '*');
            } else if ( (window.location.href).includes(page.CHANNEL[0]) || (window.location.href).includes(page.CHANNEL[1])) {
                if ( (window.location.href).includes("/videos")) {
                    // VIDEOS PAGE
                    console.log(FilterChannelVideoPage());
                } else {
                    console.log(FilterChannelHomePage());
                }
            } else if ( (window.location.href).includes(page.PLAYLIST)) {
                GetPlaylistPageIDs();
            }
    }
}

// ------------------ CURATOR FUNCTIONS ---------------------

/**
 * Used in curator mode, this function iterates through and creates checkboxes
 * @param {Array<String>} categoryArray 
 */
function addCategories(categoryArray) {
    let innerHTML = "<div id=\"categories\" style=\"column-count:2;\">";
    categoryArray.forEach(element => {
        innerHTML += "<input type=\"checkbox\" id=\"" + element + "\" name=\"filters[]\" value=\"" + element + "\"><label for=\"" + element + "\">" + element + "</label><br>";
    });

    innerHTML += "</div>";
    return innerHTML;
}

/**
 * This behemoth of a function does one simple task, it creates the Curator Div when Curator Mode has been enabled.
 * NOTE: This is only for creating training data for the neural network.
 */
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
    VTForm.setAttribute("method", "post");
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

    paperButton.setAttribute("onclick", "window.postMessage('" + windowMessages.SendCurator + "', '*')");

    buttonRenderer.appendChild(paperButton);

    let formattedString = document.createElement("yt-formatted-string");
    formattedString.setAttribute("class", "style-scope ytd-subscribe-button-renderer")
    formattedString.setAttribute("style", "");
    
    paperButton.appendChild(formattedString);
    formattedString.innerHTML = "Submit";
    
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
// ------------------ END CURATOR FUNCTION ------------------

function GetSection() {
    return document.getElementById("contents");
}

//  ------------------ PLAYLIST PAGE FUNCTIONS ------------------

function GetPlaylistPageIDs() {
    const playlistVidSection = document.getElementsByTagName("ytd-playlist-video-list-renderer")[0];

    const vidsList = playlistVidSection.getElementsByTagName("ytd-playlist-video-renderer");
    
    for (let elem of vidsList) {
        let link = elem.getElementsByTagName("a")[0].getAttribute('href');
        let videoID = getVideoID(new URL(link, "https://www.youtube.com"));
        FilterPlaylistPage({"vID": videoID, "videoObject": elem});
    };

    let observer = new MutationObserver(mutations => {
        for(let mutation of mutations) {
             for(let addedNode of mutation.addedNodes) {
                 if (addedNode.tagName === "YTD-PLAYLIST-VIDEO-RENDERER") {                   
                    let link = addedNode.getElementsByTagName("a")[0].getAttribute('href');
                    let videoID = getVideoID(new URL(link, "https://www.youtube.com"));
                    FilterPlaylistPage({"vID": videoID, "videoObject": addedNode});
                  }
              }
         }
     });
     observer.observe(playlistVidSection, { childList: true, subtree: true });
}

function GetPlaylistIDs() {
    const playlistVidSection = document.getElementsByTagName("ytd-playlist-panel-renderer")[0];

    const vidsList = playlistVidSection.getElementsByTagName("ytd-playlist-panel-video-renderer");

    for (let elem of vidsList) {
        let link = elem.getElementsByTagName("a")[0].getAttribute('href');
        let videoID = getVideoID(new URL(link, "https://www.youtube.com"));
        FilterPlaylistPage({"vID": videoID, "videoObject": elem});
    };
}

function FilterPlaylistPage(obj) {
    console.log(obj);
}

// ------------------ END PLAYLIST PAGE FUNCTION ------------------

//  ------------------ RECOMMENDATION FEED FUNCTIONS ------------------

function GetRecommendationFeedIDs() {
    const recommendedSection = document.getElementsByTagName("ytd-watch-next-secondary-results-renderer")[0];

    let observer = new MutationObserver(mutations => {
        for(let mutation of mutations) {
             for(let addedNode of mutation.addedNodes) {
                 if (addedNode.tagName === "YTD-COMPACT-VIDEO-RENDERER") {
                                       
                    let link = addedNode.getElementsByTagName("a")[0].getAttribute('href');
                    let videoID = getVideoID(new URL(link, "https://www.youtube.com"));
                    FilterRecommendationFeed({"vID": videoID, "videoObject": addedNode});
                  }
              }
         }
     });
     observer.observe(recommendedSection, { childList: true, subtree: true });
}

function FilterRecommendationFeed(obj) {
    console.log(obj);
}

//  ------------------ END RECOMMENDATION FEED FUNCTIONS ------------------

function addCommentMessage(commentSection) {
    let itemSection = document.createElement("ytd-item-section-renderer");
    itemSection.id = "sections";
    itemSection.setAttribute("initial-count", "2");
    itemSection.class = "style-scope ytd-comments";

    commentSection.appendChild(itemSection);

    itemSection = commentSection.getElementsByTagName("ytd-item-section-renderer")[0];
    for (let index = 0; index < itemSection.childNodes.length; index++) {
        if (itemSection.childNodes[index].id === "contents") {
            contents = itemSection.childNodes[index];
            break;
        }
    }

    messageRenderer = document.createElement("ytd-message-renderer");
    messageRenderer.class = "style-scope ytd-item-section-renderer";
    contents.appendChild(messageRenderer);

    ytdMessageRenderer = contents.childNodes[0];

    spanText = document.createElement("span");
    spanText.dir = "auto";
    spanText.class = "style-scope yt-formatted-string";
    spanText.innerHTML = "Comments are disabled by the ValueTube Extension.";

    for (let index = 0; index < ytdMessageRenderer.childNodes.length; index++) {
        if (ytdMessageRenderer.childNodes[index].id === "message") {
            message = ytdMessageRenderer.childNodes[index];
            break;
        }
    }

    message.appendChild(spanText);
    
}

function removeComments() {
    const commentSection = document.getElementsByTagName("ytd-comments")[0];

    let observer = new MutationObserver(mutations => {
        for(let mutation of mutations) {
             for(let addedNode of mutation.addedNodes) {
                 if (addedNode.parentElement === commentSection && addedNode.nodeName === "YTD-ITEM-SECTION-RENDERER") {
                    observer.disconnect();
                    addedNode.parentNode.removeChild(addedNode);
                    addCommentMessage(commentSection);
                  }
              }
         }
     });
     observer.observe(commentSection, { childList: true, subtree: true });
}

function GetSearchPageVideoIDs() {
    let videoIDs = [];
    let videoObjects = [];
    let searchDiv = document.getElementsByTagName("ytd-search")[0];
    let section = searchDiv.getElementsByTagName("ytd-section-list-renderer")[0];

    for (let i = 0; i < section.children.length; i++) {
        if (section.children[i].id == "contents") {
            let contents = section.children[i];
            // Iterate through item section renderers... (collections of video renderers)
            for (let x = 0; x < contents.getElementsByTagName("ytd-item-section-renderer").length; x++) {
                let obj = SearchItemSectionRenderer(contents.getElementsByTagName("ytd-item-section-renderer")[x]);
                videoIDs.concat(obj["videoIDs"]);
                videoObjects.concat(obj["videoObjects"]);
            }
            break;
        }
    }

    return {videoIDs, videoObjects};
}

function SearchItemSectionRenderer(itemSection) {
    let videoIDs = [];
    let videoObjects = [];
    let items;
    for (let i = 0; i < itemSection.children.length; i++) {
        if (itemSection.children[i].id == "contents") {
            items = itemSection.children[i].children;
            break;
        }
    }

    for (let i = 0; i < items.length; i++) {
        if (items[i].tagName == "YTD-VIDEO-RENDERER") {
            videoIDs.push(getVideoID(new URL(items[i].getElementsByTagName("a")[0].href)));
            videoObjects.push(items[i])
        }
    }
    return {videoIDs, videoObjects};


}

/**
 * This function collects every videos ID from the YouTube Homepage
*/
function GetHomePageVideoIDs() {
    let contents = GetSection();
    let videoIDs = [];
    let videoObjects = [];
    // TODO: Depending on users options remove posts
    // let sections = contents.getElementsByTagName("ytd-rich-section-renderer");
    let videos = contents.getElementsByTagName("ytd-rich-item-renderer");
    for (let index = 0; index < videos.length; index++) {
        let link = videos[index].getElementsByTagName("a")[0].getAttribute("href");
        let videoID =  getVideoID(new URL(link, "https://www.youtube.com"));
        // If first link is a channel ID (e.g. youtube posts)
        if (videoID == null) {
            continue;
        }
        videoIDs.push(videoID);
        videoObjects.push({"vID" : videoID, "element" : videos[index]});
    }
    return {videoIDs, videoObjects};
}

/**
 * This function gets the Form Data from curator and merges that with the videoID.
 */
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

// ------------------ CHANNEL PAGE FUNCTIONS -------------------------

//HOME
function FilterChannelHomePage() {
    let sections = GetSection().querySelectorAll("ytd-item-section-renderer");
    let videoIDs = [];
    let videoObjects = [];
    sections.forEach(element => {
        for (let i = 0; i < element.children.length; i++) {
            if (element.children[i].id == "contents") {
                let sectionContents = element.children[i];
                let results;
                switch (sectionContents.children[0].tagName) {
                    case "YTD-CHANNEL-VIDEO-PLAYER-RENDERER":
                        results = GetFeaturedVideoID(sectionContents.children[0]);
                        videoIDs.push(results.vID)
                        videoObjects.push(results.element);
                        break;
                    case "YTD-SHELF-RENDERER":
                        results = ChannelSearchShelf(sectionContents.children[0]);
                        videoIDs = videoIDs.concat(results.videoIDs);
                        videoObjects = videoObjects.concat(results.videoObjects);
                        break;
                    default:
                        console.error("Error: Unexpected Section TagName Found.");
                        break;
                }
            }
        } 
    });
    return {"videoIDs": videoIDs, "videoObjects": videoObjects};
}

/**
 * 
 * @param {HTMLElement} element 
 */
function GetFeaturedVideoID(element) {
    for (let i = 0; i < element.children.length; i++) {
        if (element.children[i].id == "content") {
            let content = element.children[i];
            let links = content.children[0].children[0].querySelectorAll("a");
            for (const link of links) {
                return {"vID" : getVideoID(new URL(link.href)), "element" : element};
            }
        }
    }
}

/**
 * 
 * @param {HTMLElement} shelf 
 */
function ChannelSearchShelf(shelf) {
    // TODO: Add check for if its a shelf of playlists
    for (let i = 0; i < shelf.children.length; i++) {
        if (shelf.children[i].id == "dismissable") {
            let dismissable = shelf.children[i];
            for (let x = 0; x < dismissable.children.length; x++) {
                if (dismissable.children[x].id == "contents" && dismissable.children[x].children[0].tagName == "YT-HORIZONTAL-LIST-RENDERER") {
                    let horizontalList = dismissable.children[x].children[0];
                    return ChannelSearchHorizontalList(horizontalList);
                }
            }
        }
    }
}

/**
 * 
 * @param {HTMLElement} listElement 
 */
function ChannelSearchHorizontalList(listElement) {
    let videoIDs = [];
    let videoObjects = [];
    for (let i = 0; i < listElement.children.length; i++) {
        if (listElement.children[i].id == "scroll-container") {
            let items = listElement.children[i].children[0];
            // Iterate through items
            for (let x = 0; x < items.children.length; x++) {
                // TODO: Check if its a playlist or channel renderer
                // Get links from grid element
                let links = items.children[x].getElementsByTagName("a");
                for (const link of links) {
                    videoIDs.push(getVideoID(new URL(link.href)));
                    videoObjects.push(items.children[x]);
                    break;
                }
            }
            return {videoIDs, videoObjects};
        }
    }
}

//VIDEOS
function FilterChannelVideoPage() {
    let primary = document.getElementsByTagName("ytd-two-column-browse-results-renderer");
    let videoIDs = [];
    let videoObjects = [];
    for (let i = 0; i < primary.length; i++) {
        let innerContents = primary[i].children["primary"].children[0].children["contents"].children[0].children["contents"].children[0]["children"]["items"]
        for (let index = 0; index < innerContents.childElementCount; index++) {
            let videoID = getVideoID(innerContents.children[index].getElementsByTagName("a")[0].href);
            videoIDs.push(videoIDs);
            videoObjects.push({"vID" : videoID, "element" : innerContents.children[index]});
        }
    }
    return {"videoIDs": videoIDs, "videoObjects": videoObjects};
}

// ------------------ END CHANNEL PAGE FUNCTIONS ---------------------

window.addEventListener("message", function(event) {
    if (event.source != window)
        return

    if (event.data) {
        switch (event.data) {
            case windowMessages.SendCurator:
                let JForm = CreateJForm();
                chrome.runtime.sendMessage({greeting : windowMessages.SendCurator, data : JForm});
                break;
            case windowMessages.FilterHome:
                // TODO: Need to send user filters
                let homePageInfo = GetHomePageVideoIDs();
                chrome.runtime.sendMessage({greeting : windowMessages.FilterHome, data : homePageInfo["videoIDs"]});
                break;
            case windowMessages.SearchPage:
                let searchPageVideoIDs = GetSearchPageVideoIDs()["videoIDs"];
                chrome.runtime.sendMessage({greeting : windowMessages.SearchPage, data : searchPageVideoIDs});
                break;
            default:
                console.error("An error occurred trying to communicate with the extension.");
                console.log(event);
                break;
        }
    }
})
