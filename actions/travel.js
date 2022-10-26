function travelSolution(chosenArrow) {
  if (getHealthBarWidth()) {
    // Search Person. If somebody - path through
    var moveSearchPerson = searchPersons();
    var moveSearchMob = searchMob();
    var moveSearchTreasure = searchTreasure();

    detectTrap();

    if (!searchPersons()) {
      chosenArrow.click();
      return true;
    } else {
      // Detect Treasure
      if (moveSearchTreasure) {
        if (moveSearchTreasure.type == "locked") {
          checkInitDaily(
            moveSearchTreasure.type,
            moveSearchTreasure.count,
            function () {
              if (searchPersons()) {
                moveSearchTreasure.item.click();
              }
            }
          );
        } else {
          checkInitDaily(
            moveSearchTreasure.type,
            moveSearchTreasure.count,
            function () {
              if (searchPersons()) {
                moveSearchTreasure.item.click();
              }
            }
          );
        }
        return true;
      }

      if (moveSearchMob) {
        return true;
      }

      if (getHealthBarWidth() == "100%") {
        chosenArrow.click();
        return true;
      }
    }
  } else {
    if (getHealthTab()) {
      getHealthTab().click();
    }
    return false;
  }
}

function actionOnTravelFrame() {
  if (speed() > 8) {
    // Get Coordinates
    currentCoordinate = getCoordinates();
    // Get Available Arrows
    var availableArrows = getAvailableArrows(analyseArrow);
    // Choose Coordinates
    var chosenArrow = chooseCoordinates(availableArrows);

    // Save Coordinates
    smaugGet("localCoordinate", function (a) {
      if (a.localCoordinate !== currentCoordinate.local) {
        // It is definitely not after refresh
        saveCoordinates(currentCoordinate, function () {
          travelSolution(chosenArrow);
        });
      } else {
        travelSolution(chosenArrow);
      }
    });
  }

  // Check if it is time to exit
  smaugGet("exit", function (act) {
    if (act.exit == true) {
      chrome.runtime.sendMessage({ action: "clearAlarm" }, function (response) {
        console.log("callback");
        console.log(response.success);
        smaugSet(
          {
            exit: false,
          },
          function () {
            document.location.href = "../cgi/exit.php";
          }
        );
      });
    }
  });
}
