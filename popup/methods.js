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

function checkInitDaily (type, count, callback) {
    smaugGet('statistics', function (a) {
        var dateFormat = smaugDateFormat();

        if (!a.statistics["daily"][dateFormat]){
            a.statistics["daily"][dateFormat] = {};
            a.statistics["daily"][dateFormat][type] = count;
            a.statistics["daily"][dateFormat]["experience"] = getExpNode().innerHTML.match(/\d+$/)[0];
            smaugSet({
                'statistics': a.statistics
            }, function () {
                callback();
            });
        } else {
            console.log(a.statistics["daily"][dateFormat][type]);
            if (!a.statistics["daily"][dateFormat][type]) {
                a.statistics["daily"][dateFormat][type] = count;
                smaugSet({
                    'statistics': a.statistics
                }, function () {
                    callback();
                });
            } else {
                a.statistics["daily"][dateFormat][type] = a.statistics["daily"][dateFormat][type] + count ;
                smaugSet({
                    'statistics': a.statistics
                }, function () {
                    callback();
                });
            }
        }

    });
}