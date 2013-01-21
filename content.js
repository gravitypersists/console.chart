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

// each page has it's own chartData. 
// This will eventually support multiple streams, which is why it's like this
//var chartData = [{key:"Stream0", values:[]}];
var x = 0;

// event listener from event in injected script
window.addEventListener("consoleChart", function(e) {
    //chartData[0].values.push({x:x, y:e.detail});
    chrome.extension.sendMessage({x:x, y:e.detail});
    x++;
}, true);


chrome.extension.onMessage.addListener( function(request, sender) {
    console.log("r:"+request);
    if (request === "reset") {
        chartData = [{key:"Stream0", values:[]}];
        chrome.extension.sendMessage(chartData);
    };
});