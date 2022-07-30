const updatedSet = new Set();
document.addEventListener("DOMNodeInserted", () => {
    injectWidget();
});

function injectWidget() {
    var links = document.querySelectorAll("a[href*='soundcloud.com']");
    Array.from(links)
        .filter((a) => !updatedSet.has(a.href))
        .forEach((a) => {
            let endpoint = "https://soundcloud.com/oembed?" + new URLSearchParams({
                url: a.href,
                maxwidth: "300px"
            })
            updatedSet.add(a.href);
            fetch(endpoint)
                .then((r) => {
                    return r.text();
                })
                .then((t) => {
                    let json = JSON.parse(t);
                    let wrapper = document.createElement("div");
                    wrapper.innerHTML = json.html;
                    a.appendChild(wrapper);
                });
    });
}
