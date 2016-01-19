function travelSolution(chosenArrow) {

    if (getHealthBarWidth()) {

        // Search Person. If somebody - path through
        var moveSearchPerson = searchPersons();
        var moveSearchMob = searchMob();
        var moveSearchTreasure = searchTreasure();

        function detectTrap(){
            var getSrc = getImageOfLocation(getTravelFrame());
            if(getSrc.search("trap") >= 0){
                //console.log("trap");
                //console.log(currentCoordinate);
                smaugGet(['storedCoordinatesTraps'], function(a){
                    var currentArray = a.storedCoordinatesTraps;
                    var testTrap = currentArray.indexOf(currentCoordinate.local);
                    if (testTrap < 0) {
                        currentArray.push(currentCoordinate.local);
                        smaugSet({
                            'storedCoordinatesTraps': currentArray
                        }, function(){
                            //console.log("Traps has been added");
                        });
                    }
                });

            }
        }

        detectTrap();

        if (moveSearchPerson) {
            chosenArrow.click();
            return true;
        }

        // Detect Treasure
        if (moveSearchTreasure) {
            if (moveSearchTreasure.type == "locked") {
                checkInitDaily(moveSearchTreasure.type, moveSearchTreasure.count, function(){
                    moveSearchTreasure.item.click();
                });
            } else {
                checkInitDaily(moveSearchTreasure.type, moveSearchTreasure.count, function(){
                    moveSearchTreasure.item.click();
                });
            }
            return false;
        }

        if (moveSearchMob) {
            return false;
        }

        if (getHealthBarWidth() == "100%") {
            chosenArrow.click();
            return true;
        }

    } else {
        getHealthTab().click();
        return false;
    }
}

function actionOnTravelFrame() {
    if (speed() > 30) {

        // Get Coordinates
        currentCoordinate = getCoordinates();
        // Get Available Arrows
        var availableArrows = getAvailableArrows(analyseArrow);
        // Choose Coordinates
        var chosenArrow = chooseCoordinates(availableArrows);

        // Save Coordinates
        smaugGet('localCoordinate', function (a) {
            if (a.localCoordinate !== currentCoordinate.local) {
                // It is definitely not after refresh
                saveCoordinates(currentCoordinate, function () {
                    travelSolution(chosenArrow);
                });
            } else {
                travelSolution(chosenArrow)
            }
        });

    }

    // Check if it is time to exit
    smaugGet('exit', function (act) {
        if (act.exit == true) {
            chrome.runtime.sendMessage({action: "clearAlarm"}, function (response) {
                console.log("callback");
                console.log(response.success);
                smaugSet({
                    'exit': false
                }, function () {
                    document.location.href = '../cgi/exit.php';
                });
            });
        }
    });

}