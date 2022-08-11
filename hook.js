// Main hook, listens for browsing activity then adds main listener 
// without this hook, main.js logic will not always inject appropriately

chrome.tabs.onUpdated.addListener(function (tabId , info) {
    if (info.status === "complete") {
        sendInitMessage(tabId);
    }
});

const sendInitMessage = (tabId) => {
    chrome.tabs.sendMessage(tabId,
        { music_stream_auto_embedder: "init" }
    );
} 