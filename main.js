// Listens to any DOM updates and appends the OEmbed widget if necessary

// const throws error due to page updates
var SOUNDCLOUD_WIDGET_MAX_WIDTH = "300px";
var INJECTION_DIV_MAP = {
    "ra.co": "div .jBqnIi",
    "edmtrain.com": "div .customSlider"
}


document.addEventListener("DOMNodeInserted", () => {
    createWidget();
});

function createWidget() {
    console.log("Create widget");
    const links = document.querySelectorAll("a[href*='soundcloud.com']");
    Array.from(links)
        .filter((link) => !updatedSet.has(link.href))
        .forEach((link) => {
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