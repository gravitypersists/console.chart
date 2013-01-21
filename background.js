var data = {};
var hasChanged = {};
chrome.extension.onMessage.addListener(function (newData, sender) {
    var tab = sender.tab.id;
    if (!data[tab]) { 
        data[tab] = [{key:"Stream0", values:[]}]; 
        hasChanged[tab] = false;
    }
    data[tab][0].values.push(newData);
    hasChanged[tab] = true;
});

chrome.extension.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (message) {
        var tab = message.id;
        if (message.type === "get") {
            // this ensures we only respond if the data has changed
            if (data[tab] && hasChanged[tab]) {
                hasChanged[tab] = false;
                port.postMessage(data[tab]);
            }
        } else if (message.type === "reset") {
            data[tab] = [{key:"Stream0", values:[]}];
            port.postMessage(data[tab]);
        }
    });
});