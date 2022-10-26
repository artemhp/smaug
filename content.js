setTimeout(function () {
  (function loop() {
    var rand = Math.random() * (2000 - 1000) + 1000;
    setTimeout(function () {
      if (
        getImageOfLocation(getTravelFrame()) ==
        "https://fantasyland.ru/images/places/Global/arena.jpg"
      ) {
        smaugGet("statistics", function (a) {
          var dateFormat = smaugDateFormat();
          if (getExpNode()) {
            a.statistics["daily"][dateFormat]["experience"] =
              getExpNode().innerHTML.match(/\d+$/)[0];
            smaugSet({ statistics: a.statistics }, function () {});
          }
        });
      }

      if (
        getTravelFrame() &&
        getImageOfLocation(getTravelFrame()) !==
          "https://fantasyland.ru/images/places/Global/arena.jpg"
      ) {
        chrome.runtime.sendMessage({ action: "travel" });
        smaugGet("action", function (act) {
          if (act.action == "go") {
            smaugGet(["coordinates", "storedCoordinatesTraps"], function (a) {
              if (!a.coordinates) {
                storedCoordinates = {};
              } else {
                storedCoordinates = a.coordinates;
              }

              // Try to avoid this
              storedCoordinatesArray = Object.keys(storedCoordinates);

              storedCoordinatesTrapArray = a.storedCoordinatesTraps;

              ////////// Action
              actionOnTravelFrame();
            });
          }
        });
      }
      loop();
    }, rand);
  })();

  (function loop() {
    var rand = Math.random() * (18000 - 10000) + 10000;
    setTimeout(function () {
      if (getArmyFrame()) {
        smaugGet("action", function (act) {
          if (act.action == "go") {
            var randArmy = Math.floor(Math.random() * 3);
            var unit = getUnitNode(getArmyFrame(), locale.army[randArmy]);

            if (unit) {
              if (getArmyFrame()) {
                unit.click();
              }
              setTimeout(function () {
                if (getArmyFrame()) {
                  getArmyFrame().location.reload();
                  getCombatField().location.reload();
                }
              }, 3000);
            }

            if (getHealthNode(getArmyFrame())) {
              var healthCheck = parseInt(
                getHealthNode(getArmyFrame())
                  .getAttribute("style")
                  .match(/\d+/)[0]
              );
              chrome.runtime.sendMessage({
                action: "combat",
                health: healthCheck,
              });

              if (healthCheck < 15) {
                smaugGet(["clothes"], function (act) {
                  if (
                    window.frames[locale.mainFrame].frames[
                      locale.armyFrame
                    ].document.querySelectorAll(
                      "[src='" + act.clothes.svitokHealthPic + "']"
                    )[0]
                  ) {
                    window.frames[locale.mainFrame].frames[
                      locale.armyFrame
                    ].document
                      .querySelectorAll(
                        "[src='" + act.clothes.svitokHealthPic + "']"
                      )[0]
                      .click();
                  }
                });
              }
            }

            if (getExitLink(getCombatField())) {
              checkInitDaily("creature", 1, function () {
                getExitLink(getCombatField()).click();
              });
            }
          }
        });
      }
      loop();
    }, rand);
  })();
}, 1000);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "reload") {
    smaugGet(["action", "clothes"], function (act) {
      if (act.action == "go" && act.clothes.reload == true) {
        location.reload();
      }
    });
  } else if (request.action === "drinkBeverage") {
    if (
      getTravelFrame() &&
      getImageOfLocation(getTravelFrame()) !==
        "https://fantasyland.ru/images/places/Global/arena.jpg"
    ) {
      smaugGet(["clothes", "action"], function (act) {
        if (act.action == "go" && getTravelFrame()) {
          if (act.clothes.beverage1) {
            // smaugSendRequest(
            //   locale.drinkLink + act.clothes.beverage1,
            //   function () {
            //     //console.log("Beverage has been drinked");
            //   }
            // );
          }
          if (act.clothes.beverage2) {
            // smaugSendRequest(
            //   locale.drinkLink + act.clothes.beverage2,
            //   function () {
            //     //console.log("Beverage has been drinked");
            //   }
            // );
          }
          if (act.clothes.beverage3) {
            // smaugSendRequest(
            //   locale.drinkLink + act.clothes.beverage3,
            //   function () {
            //     //console.log("Beverage has been drinked");
            //   }
            // );
          }
          if (act.clothes.beverage4) {
            // smaugSendRequest(
            //   locale.drinkLink + act.clothes.beverage4,
            //   function () {
            //     //console.log("Beverage has been drinked");
            //   }
            // );
          }
        }
      });
    }
  } else if (request.action === "useHealth") {
    smaugGet(["clothes", "action"], function (act) {
      if (act.action == "go" && act.clothes.svitokHealth && getTravelFrame()) {
        // smaugSendRequest(
        //   locale.drinkLink + act.clothes.svitokHealth,
        //   function () {}
        // );
        // smaugSendRequest(
        //   locale.drinkLink + act.clothes.svitokHealth,
        //   function () {}
        // );
        // smaugSendRequest(
        //   locale.drinkLink + act.clothes.svitokHealth,
        //   function () {}
        // );
        // smaugSendRequest(
        //   locale.drinkLink + act.clothes.svitokHealth,
        //   function () {}
        // );
        // smaugSendRequest(
        //   locale.drinkLink + act.clothes.svitokHealth,
        //   function () {}
        // );
        // smaugSendRequest(
        //   locale.drinkLink + act.clothes.svitokHealth,
        //   function () {}
        // );
        // smaugSendRequest(
        //   locale.drinkLink + act.clothes.svitokHealth,
        //   function () {}
        // );
        // smaugSendRequest(
        //   locale.drinkLink + act.clothes.svitokHealth,
        //   function () {}
        // );
      }
    });
  } else if (request.action === "initDelay") {
    smaugSet(
      {
        exit: true,
      },
      function () {
        console.log("If not in combat - Quit");
      }
    );
  } else if (request.action === "shuffleArrows") {
    if (
      getTravelFrame() &&
      getImageOfLocation(getTravelFrame()) !==
        "https://fantasyland.ru/images/places/Global/arena.jpg"
    ) {
      shuffle(arrowsArray);
      storedCoordinates = {};
      chrome.storage.local.remove("coordinates");
    }
  }
});
