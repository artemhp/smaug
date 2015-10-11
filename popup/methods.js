function sendMessage (message, sendResponse) {
    chrome.tabs.query({url: "http://fantasyland.ru/main.php"}, function (tabs) {
        if (sendResponse) {
            chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
        } else {
            chrome.tabs.sendMessage(tabs[0].id, message);
        }
    });
};

function sendMessageToEvent (el, message, callback) {
    el.addEventListener("click", function () {
        chrome.runtime.sendMessage({popupAction: message}, function (response) {
            callback(response);
        });
    }, false);
};

function smaugGet (obj, result) {
    chrome.storage.local.get(obj, function (a) {
        result(a);
    });
}

function smaugSet (obj, result) {
    chrome.storage.local.set(obj, function(){
        result();
    });
}

function smaugSendRequest (action, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', action, false);
    request.send(null);
    if (callback) {callback(request);}

}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function setStatisticsItem (moveSearchTreasure, callback) {
    smaugGet('statistics', function (a) {

        var currentItemType = moveSearchTreasure.type;
        var currentItemCount = moveSearchTreasure.count;
        var currentDate = smaugDateFormat();
        var currentDailyType;
        var currentDailyCount = 0;

        // Daily Statistics
        if (a.statistics.daily[currentDate]) {
            // Case when current date in statistics exist
            currentDailyType = a.statistics.daily[currentDate][currentItemType];
            if (currentDailyType) {
                currentDailyCount = parseInt(currentDailyType) + parseInt(currentItemCount);
            } else {
                a.statistics.daily[currentDate][currentItemType] = {};
                currentDailyCount = parseInt(currentItemCount);
            }
            a.statistics.daily[currentDate][currentItemType] = currentDailyCount;

        } else {
            // Case when current date in statistics doesn't exist
            a.statistics.daily[currentDate] = {};
            a.statistics.daily[currentDate][currentItemType] = parseInt(currentItemCount);
        }

        // General Statistics
        if (a.statistics.itemsFound[currentItemType]) {
            a.statistics.itemsFound[currentItemType] = parseInt(a.statistics.itemsFound[currentItemType]) + parseInt(moveSearchTreasure.count)
        } else {
            a.statistics.itemsFound[currentItemType] = {};
            a.statistics.itemsFound[currentItemType] = parseInt(moveSearchTreasure.count)
        }

        smaugSet({
            'statistics': a.statistics
        }, function () {
            callback();
        });

    });
}