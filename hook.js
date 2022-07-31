// Main hook, listens for browsing activity then adds main listener 
// without this hook, main.js logic will not always inject appropriately

chrome.tabs.onUpdated.addListener(function (tabId , info) {
    console.log("hook updated!");
    if (info.status === "complete") {
        // console.log("executing main.js!");
        // chrome.scripting.executeScript({
        //     target: {tabId: tabId},
        //     files: ["main.js"]
        // });

        //fires twice on edmtrain
        sendInitMessage(tabId);
        console.log("sent init message");
    }
});

const sendInitMessage = (tabId) => {
    chrome.tabs.sendMessage(tabId,
        { music_stream_auto_embedder: "init" }
    );
} 