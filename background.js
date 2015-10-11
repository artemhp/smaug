function smaugSet(obj, result) {
    chrome.storage.sync.set(obj, function () {
        result();
    });
}

var sendMessage = function (message, sendResponse) {
    chrome.tabs.query({url: "http://fantasyland.ru/main.php"}, function (tabs) {
        if (sendResponse) {
            chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
        } else {
            chrome.tabs.sendMessage(tabs[0].id, message);
        }
    });
};

chrome.alarms.create("refreshForSecure", {periodInMinutes: 6});
chrome.alarms.create("drinkBeverage", {periodInMinutes: 32});
chrome.alarms.create("useHealth", {periodInMinutes: 5});

//delayInMinutes

chrome.alarms.onAlarm.addListener(function (alarm) {

    if (alarm.name == "refreshForSecure") {
        sendMessage({action: "reload"}, function () {
        });
    } else if (alarm.name == "drinkBeverage") {
        sendMessage({action: "drinkBeverage"}, function () {
        });
    }
    else if (alarm.name == "useHealth") {
        sendMessage({action: "useHealth"}, function () {
        });
    } else if (alarm.name == "initDelay") {
        sendMessage({action: "initDelay"}, function () {
        });
    }

});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "combat") {
            chrome.browserAction.setIcon({path: 'icon-combat.png'});
        } else if (request.action === "travel") {
            chrome.browserAction.setIcon({path: 'icon.png'});
        } else if (request.action === "delay") {
            chrome.alarms.create("initDelay", {delayInMinutes: parseFloat(request.delayInMinutes)*60});
            console.log("alarm created" + (parseFloat(request.delayInMinutes)*60));
        } else if (request.action === "clearAlarm"){
            //chrome.alarms.clear("initDelay");
        } else if (request.action === "getAlarm") {

        }
    });