
// Each tab's data is stored in this bg script, the keys in this object are the tabIds
var data = {};

// an object which keeps track of whether the data has changed, will be used
// to determine if other portions of extension should receive a response to update
var hasChanged = {};

chrome.extension.onMessage.addListener(function (newData, sender) {
    var tab = sender.tab.id;
    if (!data[tab]) { 
        data[tab] = [{key:"Stream0", values:[]}]; 
        hasChanged[tab] = false;
    }
    data[tab][0].values.push({x:data[tab][0].values.length+1, y:newData});
    hasChanged[tab] = true;
});

chrome.extension.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (message) {
        var tab = message.id;
        if (message.type === "get") {
            // The extension script is asking for data
            if (data[tab] && hasChanged[tab]) {
                hasChanged[tab] = false;
                port.postMessage(data[tab]);
            }
        } else if (message.type === "reset") {
            // Somebody pressed the "reset" button, most likely
            data[tab] = [{key:"Stream0", values:[]}];
            port.postMessage(data[tab]);
        }
    });
});