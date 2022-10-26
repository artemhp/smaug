function smaugSet(obj, result) {
  chrome.storage.sync.set(obj, function () {
    result();
  });
}

function smaugGet(obj, result) {
  chrome.storage.local.get(obj, function (a) {
    result(a);
  });
}

var sendMessage = function (message, sendResponse) {
  chrome.tabs.query(
    {
      url: "https://fantasyland.ru/main.php",
    },
    function (tabs) {
      if (!tabs) {
        return false;
      }
      if (sendResponse) {
        chrome.tabs.sendMessage(tabs[0]?.id, message, sendResponse);
      } else {
        chrome.tabs.sendMessage(tabs[0]?.id, message);
      }
    }
  );
};

chrome.alarms.create("refreshForSecure", {
  periodInMinutes: 1,
});
chrome.alarms.create("drinkBeverage", {
  periodInMinutes: 1,
});
chrome.alarms.create("useHealth", {
  periodInMinutes: 5,
});
chrome.alarms.create("shuffleArrows", {
  periodInMinutes: 60,
});

//delayInMinutes

chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name == "refreshForSecure") {
    chrome.tabs.query(
      {
        url: "https://fantasyland.ru/main.php",
      },
      function (tabs) {
        smaugGet(["action", "clothes"], function (act) {
          if (act.action == "go" && act.clothes.reload == true) {
            chrome.tabs.reload(tabs[0].id);
          }
        });
      }
    );
  } else if (alarm.name == "drinkBeverage") {
    sendMessage(
      {
        action: "drinkBeverage",
      },
      function () {}
    );
  } else if (alarm.name == "useHealth") {
    sendMessage(
      {
        action: "useHealth",
      },
      function () {}
    );
  } else if (alarm.name == "initDelay") {
    sendMessage(
      {
        action: "initDelay",
      },
      function () {}
    );
  } else if (alarm.name == "shuffleArrows") {
    sendMessage(
      {
        action: "shuffleArrows",
      },
      function () {}
    );
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "combat") {
    // chrome.browserAction.setIcon({
    //   path: "icon-combat.png",
    // });
    // chrome.browserAction.setBadgeText({
    //   text: request.health.toString(),
    // });

    if (request.health < 40) {
      // chrome.browserAction.setBadgeBackgroundColor({
      //   color: "#ec1212",
      // });
    } else {
      // chrome.browserAction.setBadgeBackgroundColor({
      //   color: "#00920e",
      // });
    }
  } else if (request.action === "travel") {
    // chrome.browserAction.setIcon({
    //   path: "icon.png",
    // });
    // chrome.browserAction.setBadgeText({
    //   text: "",
    // });
  } else if (request.action === "delay") {
    chrome.alarms.create("initDelay", {
      delayInMinutes: parseFloat(request.delayInMinutes) * 1,
    });
    console.log("alarm created" + parseFloat(request.delayInMinutes) * 1);
  } else if (request.action === "clearAlarm") {
    chrome.alarms.clear("initDelay");
    sendResponse({
      success: true,
    });
  } else if (request.action === "getAlarm") {
  } else if (request.action === "captcha") {
    chrome.tabs.query(
      {
        title: "Лига Героев.",
      },
      function (tabs) {
        chrome.tabs.update(tabs[0].id, {
          active: true,
        });
      }
    );
  }
});
