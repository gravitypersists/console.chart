// this script is a content script that injects code on each page to make a console.chart()

// script to be injected:
function customConsole() {
    // dispatches a custom event so the content script can interact with injected script
    window.console.chart = function(msg) {
        var event = new CustomEvent("consoleChart", {"detail":msg});
        window.dispatchEvent(event)
    };
}

// inject script
var script = document.createElement('script');
var code   = document.createTextNode('(' + customConsole + ')();');
script.appendChild(code);
(document.body || document.head).appendChild(script);


// event listener from event in injected script
window.addEventListener("consoleChart", function(e) {
    chrome.extension.sendMessage(e.detail);
}, true);


chrome.extension.onMessage.addListener( function(request, sender) {
    if (request === "reset") {
        chartData = [{key:"Stream0", values:[]}];
        chrome.extension.sendMessage(chartData);
    };
});