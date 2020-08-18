
#### How to run the "example.html" document
1. Open Command Prompt and use cd to change the directory to the location of the git on your computer.
2. Run python -m http.server
3. Open your web browser and nagivate to [localhost:8000](http://localhost:8000/example.html)
4. Enter a search term into the search bar.
5. Check the console for the data of the YouTube videos.


## Extension

The _Extension_ folder contains the ValueTube Test Extension.  

#### How to Load Extension into chrome
1. Visit [chrome://extensions](chrome://extensions)
2. Enable _Developer Mode_
3. Click _Load unpacked_
4. Select Extension folder

Learn more about how it was done [here](https://developer.chrome.com/extensions/getstarted).

## Server

The _Server_ folder contains the ValueTube API Source Code.

#### Requirements
* NodeJS

```
npm install express
npm install mongoose
npm install body-parser (for Testing purposes)
```