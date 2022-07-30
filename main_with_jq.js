// importScripts("jquery-3.6.0.min.js") //undefined
// require("jquery-3.6.0.min.js")

console.log("EXECUTE");

var script = document.createElement('script');
script.type = 'text/javascript';
script.async = true;
script.onload = function(){
    console.log("hi");
    injectWidget();
};
// script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.js';
script.src = chrome.runtime.getURL("/jquery-3.6.0.min.js");
console.log(script.src);
document.getElementsByTagName('head')[0].appendChild(script);

// injectWidget();

function injectWidget() {
    var links = $("a[href*='soundcloud.com']");
    console.log("injectWidget");
    Array.from(links).forEach((a) => {
        let endpoint = "https://soundcloud.com/oembed?" + new URLSearchParams({
            url: a.href,
            maxwidth: DEFAULT_PLAYER_WIDTH
        })
        fetch(endpoint)
        .then((r) => {
            return r.text();
        })
        .then((t) => {
            let json = JSON.parse(t);
            $(json.html).appendTo(a);
        });
    });
}

// doesnt do anything
// let obs = new MutationObserver(function (mutations, observer) {
//     console.log("mutated");
//     injectWidget();
// });
// obs.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });

// Also doesn't seem to work
// window.addEventListener ("load", execute, false);

// doesn't work because it's a content script it seems
// chrome.tabs.onUpdated.addListener(function (tabId , info) {
//     if (info.status === 'complete') {
//        execute();
//        console.log(complete);
//     }
// });
  