// Main hook, listens for browsing activity then adds main listener 
// without this hook, main.js will not always inject appropriately

const updatedSet = new Set();

chrome.tabs.onUpdated.addListener(function (tabId , info) {
    if (info.status === "complete") {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ["main.js"]
        });
    }
});