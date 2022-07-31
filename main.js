// Listens to any DOM updates and appends the OEmbed widget if necessary
console.log("main.js called");
const SOUNDCLOUD_WIDGET_MAX_WIDTH = "300px";
const INJECTION_DIV_MAP = {
    "ra.co": "div .jBqnIi",
    "edmtrain.com": "div .customSlider"
}
var updatedSet;

// Initialize
chrome.runtime.onMessage.addListener((m) => {
    console.log(m);

    // Check for URLs on DOM updates
    if (document.getElementById("music-stream-auto-embedder-init") !== null) return;
    let statusDiv = document.createElement("div");
    statusDiv.setAttribute("id", "music-stream-auto-embedder-init");
    document.body.appendChild(statusDiv);
    console.log("added status div");

    // TODO fix refreshing on edmtrain
    updatedSet = new Set();
    
    document.addEventListener("DOMNodeInserted", () => createWidget());
    console.log("added listener");
});
  

function createWidget() {
    if (updatedSet == undefined) return;
    const links = document.querySelectorAll("a[href*='soundcloud.com']");
    Array.from(links)
        .filter((link) => !updatedSet.has(link.href) && link.offsetParent !== null)
        .forEach((link) => {
            console.log("start request");
            const endpoint = "https://soundcloud.com/oembed?" + new URLSearchParams({
                url: link.href,
                maxwidth: SOUNDCLOUD_WIDGET_MAX_WIDTH
            })
            updatedSet.add(link.href);
            fetch(endpoint)
                .then((response) => {
                    return response.text();
                })
                .then((text) => {
                    console.log("append widget");
                    appendWidget(link, JSON.parse(text));
                });
    });
}

function appendWidget(link, json) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = json.html;

    const domain = window.location.hostname;
    
    const parentSelector = INJECTION_DIV_MAP[domain] ? INJECTION_DIV_MAP[domain] : "div";
    link.closest(parentSelector).appendChild(wrapper);
    console.log("appended");
}