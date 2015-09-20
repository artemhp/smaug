var sendMessage = function (message, sendResponse) {
    chrome.tabs.query({url: "http://fantasyland.ru/main.php"}, function (tabs) {
        if (sendResponse) {
            chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
        } else {
            chrome.tabs.sendMessage(tabs[0].id, message);
        }
    });
};

var sendMessageToEvent = function (el, message, callback) {
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