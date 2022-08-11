// Listens to any DOM updates and appends the OEmbed widget if necessary

const SOUNDCLOUD_WIDGET_MAX_WIDTH = "300px";
const INJECTION_DIV_MAP = {
    "ra.co": "div .jBqnIi",
    "edmtrain.com": "div .customSlider"
}
var updatedSet;

// Initialize
chrome.runtime.onMessage.addListener((m) => {
    if (document.getElementById("music-stream-auto-embedder-init") !== null) return;
    let statusDiv = document.createElement("div");
    statusDiv.setAttribute("id", "music-stream-auto-embedder-init");
    document.body.appendChild(statusDiv);

    updatedSet = new Set();
    
    // Check for valid URLs on DOM updates
    document.addEventListener("DOMContentLoaded", () => createWidgets());
    document.addEventListener("DOMNodeInserted", () => createWidgets());
});
  

function createWidgets() {
    if (updatedSet == undefined) return;
    const links = document.querySelectorAll("a[href*='soundcloud']");
    Array.from(links)
        .filter((link) => !updatedSet.has(link.href) && link.offsetParent !== null)
        .forEach((link) => {
            const endpoint = "https://soundcloud.com/oembed?" + new URLSearchParams({
                url: link.href,
                maxwidth: SOUNDCLOUD_WIDGET_MAX_WIDTH
            });
            updatedSet.add(link.href);
            fetch(endpoint)
                .then((response) => {
                    return response.text();
                })
                .then((text) => {
                    appendWidget(link, JSON.parse(text));
                });
        });
}

function appendWidget(link, json) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = json.html;

    const domain = window.location.hostname;
    
    const parentSelector = INJECTION_DIV_MAP[domain] ? INJECTION_DIV_MAP[domain] : "div";
    const parentElement = link.closest(parentSelector) ? link.closest(parentSelector) : link.closest("div");
    
    if (parentElement != null) {
        parentElement.appendChild(wrapper);
    }
}