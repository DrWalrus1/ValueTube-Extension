let categoryArray = ["Alcohol", "Conspiracy", "Drugs", "Educational", "Gambling", "Gaming", "Horror", "LGBT", "Memes", "Politics", "Relationships", "Religion", "Self-harm", "Sports", "Suggestive content", "Thrill Seeking", "Violence", "Weaponry", "News", "Music"];
let primaryInner = document.getElementById("primary-inner");

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

    let heading = document.createElement("h2");
    heading.innerHTML = "ValueTube Curator";
    heading.setAttribute('class', 'title style-scope ytd-video-primary-info-renderer');
    a.appendChild(heading);
    let b = document.createElement("ytd-expander");
    b.setAttribute('class', 'style-scope ytd-video-secondary-info-renderer');
    b.setAttribute('style', '--ytd-expander-collapsed-height:80px;');
    b.setAttribute('collapsed', '""');
    a.appendChild(b);
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
    // Iterate through category array and create checkboxes and append them to d
    d.innerHTML = "<input type=\"checkbox\" id=\"Alcohol\" value=\"Alcohol\"><label for=\"Alcohol\">Alcohol</label><br>" +
    "<input type=\"checkbox\" id=\"Comedy\" value=\"Comedy\"><label for=\"Comedy\">Comedy</label><br>" +
    "<input type=\"checkbox\" id=\"Conspiracy\" value=\"Conspiracy\"><label for=\"Conspiracy\">Conspiracy</label><br>" +
    "<input type=\"checkbox\" id=\"Drugs\" value=\"Drugs\"><label for=\"Drugs\">Drugs</label><br>" +
    "<input type=\"checkbox\" id=\"Educational\" value=\"Educational\"><label for=\"Educational\">Educational</label><br>" +
    "<input type=\"checkbox\" id=\"Gambling\" value=\"Gambling\"><label for=\"Gambling\">Gambling</label><br>" +
    "<input type=\"checkbox\" id=\"Gaming\" value=\"Gaming\"><label for=\"Gaming\">Gaming</label><br>" +
    "<input type=\"checkbox\" id=\"Horror\" value=\"Horror\"><label for=\"Horror\">Horror</label><br>" +
    "<input type=\"checkbox\" id=\"LGBT\" value=\"LGBT\"><label for=\"LGBT\">LGBT</label><br>" +
    "<input type=\"checkbox\" id=\"Memes\" value=\"Memes\"><label for=\"Memes\">Memes</label><br>" +
    "<input type=\"checkbox\" id=\"Movies\" value=\"Movies\"><label for=\"Movies\">Movies</label><br>" +
    "<input type=\"checkbox\" id=\"Music\" value=\"Music\"><label for=\"Music\">Music</label><br>" +
    "<input type=\"checkbox\" id=\"News\" value=\"News\"><label for=\"News\">News</label><br>" +
    "<input type=\"checkbox\" id=\"Politics\" value=\"Politics\"><label for=\"Politics\">Politics</label><br>" +
    "<input type=\"checkbox\" id=\"Promotional\" value=\"Promotional\"><label for=\"Promotional\">Promotional</label><br>" +
    "<input type=\"checkbox\" id=\"Relationships\" value=\"Relationships\"><label for=\"Relationships\">Relationships</label><br>" + 
    "<input type=\"checkbox\" id=\"Religion\" value=\"Religion\"><label for=\"Religion\">Religion</label><br>" +
    "<input type=\"checkbox\" id=\"Self-harm\" value=\"Self-harm\"><label for=\"Self-harm\">Self-harm</label><br>" +
    "<input type=\"checkbox\" id=\"Sports\" value=\"Sports\"><label for=\"Sports\">Sports</label><br>" +
    "<input type=\"checkbox\" id=\"Suggestive content\" value=\"Suggestive content\"><label for=\"Suggestive content\">Suggestive content</label><br>" +
    "<input type=\"checkbox\" id=\"Thrill Seeking\" value=\"Thrill Seeking\"><label for=\"Thrill Seeking\">Thrill Seeking</label><br>" +
    "<input type=\"checkbox\" id=\"Violence\" value=\"Violence\"><label for=\"Violence\">Violence</label><br>" +
    "<input type=\"checkbox\" id=\"Vlog\" value=\"Vlog\"><label for=\"Vlog\">Vlog</label><br>" +
    "<input type=\"checkbox\" id=\"Weaponry\" value=\"Weaponry\"><label for=\"Weaponry\">Weaponry</label><br>";
}


function removeCuratorDiv() {
    for (let index = 0; index < primaryInner.childNodes.length; index++) {
        if (primaryInner.childNodes[index].id === "VTCurator") {
            primaryInner.removeChild(primaryInner.childNodes[index]);
            break;
        }
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
</div>
*/