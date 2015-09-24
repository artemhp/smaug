function smaugSet(obj, result) {
    chrome.storage.sync.set(obj, function () {
        result();
    });
}

//smaugSet({
//    'statistics': {
//        'clothes': {
//            'combatClothes': ''
//        },
//        'statistics' : {
//            memory: 0,
//            'mobsFound' : 0,
//            steps: 0,
//            objects : {
//
//            }
//        }
//    }
//}, function(){
//    console.log("Statistics Updated");
//});

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

chrome.alarms.onAlarm.addListener(function (alarm) {

    console.log(alarm);

    if (alarm.name == "refreshForSecure") {
        sendMessage({action: "reload"}, function(){});
    } else if (alarm.name == "drinkBeverage") {
        sendMessage({action: "drinkBeverage"}, function(){});
    }

});