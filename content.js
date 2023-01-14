setTimeout(function () {
  (function loop() {
    var rand = Math.random() * (2000 - 1000) + 1000;
    setTimeout(function () {
      if (
        getTravelFrame() &&
        getImageOfLocation(getTravelFrame()) !==
          "https://fantasyland.ru/images/places/Global/arena.jpg" &&
        getImageOfLocation(getTravelFrame()) !==
          "https://www.fantasyland.ru/images/places/ICastle/castle.png"
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
              storedCoordinatesArray = Object.keys(storedCoordinates);
              storedCoordinatesTrapArray = a.storedCoordinatesTraps;
              actionOnTravelFrame();
            });
          }
        });
      }

      // Refused to run the JavaScript URL because it violates
      // the following Content Security Policy directive:
      // "script-src 'self' 'wasm-unsafe-eval'".
      // Either the 'unsafe-inline' keyword, a hash ('sha256-...'),
      // or a nonce ('nonce-...') is required to enable inline execution.
      // Note that hashes do not apply to event handlers,
      // style attributes and javascript: navigations unless the 'unsafe-hashes' keyword is present.

      // if (
      //   getImageOfLocation(getTravelFrame()) ===
      //   "https://www.fantasyland.ru/images/places/ICastle/castle.png"
      // ) {
      //   console.log(getBugSearch(getTravelFrame()));
      //   // location.href = "javascript:regimeTo(10); void 0";
      // }

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
