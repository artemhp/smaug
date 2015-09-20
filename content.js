var storedCoordinates = [];
var currentCoordinate;
var storedCoordinatesArray = [];
var arrowsArray = [
    locale.coordinates.north,
    locale.coordinates.east,
    locale.coordinates.south,
    locale.coordinates.west
];

function actionOnTravelFrame(){
    if (speed() > 30) {
        //console.log("Speed " + speed() + " is enough!");

        // Get Coordinates
        var currentCoordinate = getCoordinates();
        //console.log("Current Coordinate:" + currentCoordinate);

        // Get Available Arows
        var availableArrows = getAvailableArrows(analyseArrow);
        //console.log("Available Arrows:" + availableArrows);

        // Choose Coordinates
        var chosenArrow = chooseCoordinates(availableArrows);
        //console.log(chosenArrow['title']);

        // Save Coordinates
        smaugGet('localCoordinate', function(a){
            if (a.localCoordinate !== currentCoordinate.local) {
                // It is definetelty not after refresh
                saveCoordinates(currentCoordinate, function(){
                    move(chosenArrow)
                });
            } else {
                move(chosenArrow)
            }
        });

    }
}

(function loop() {
    var rand = Math.random() * (5000 - 2000) + 2000;
    setTimeout(function() {

        if (getTravelFrame()) {
            //console.log("getTravelFrame");
            smaugGet('coordinates', function(a){

                if (Object.keys(a).length === 0) {
                    storedCoordinates = [];
                } else {
                    storedCoordinates = a.coordinates;
                }
                storedCoordinatesArray = storedCoordinates.map(function(el){
                    return el.local;
                });

                //console.log("Stored Coordinates Array");
                //console.log(storedCoordinatesArray.length);

                ////////// Action
                actionOnTravelFrame();
            });

        } else if (getArmyFrame()) {
            var randArmy = Math.floor(Math.random() * 3);
            var unit = getUnitNode(getArmyFrame(), army[randArmy]);
            //console.log(unit);
            unit.click();

            if (getExitLink()) {
                //console.log("Combat has been finished");
                getExitLink().click();
            }
        }
        loop();
    }, rand);
}());

//setTimeout(function () {
//    //var maze = new Maze();
//
//    // this specific loop helps to randomize setInterval between 1 and 3 seconds
//    // http://stackoverflow.com/questions/6962658/randomize-setinterval-how-to-rewrite-same-random-after-random-interval
//    (function loop() {
//        var rand = Math.random() * (3000 - 1000) + 1000;
//        setTimeout(function () {
//            if (option.action == "go") {
//                if (getTravelFrame()) {
//                    console.log('It is Travel Frame');
//                    if (speed() > 30) {
//                        console.log("Speed " + speed() + " is enough!");
//
//                        // Get Coordinates
//                        var currentCoordinate = getCoordinates();
//                        console.log("Current Coordinate:");
//                        console.log(currentCoordinate);
//                        var availableArrows = getAvailableArrows(analyseArrow);
//                        console.log("Available Arrows:");
//                        console.log(availableArrows);
//                        //
//                        //// Choose Coordinates
//                        //var chosenArrow = chooseCoordinates(availableArrows);
//                        //
//                        //// Save Coordinates
//                        //saveCoordinates(currentCoordinate, function(){});
//                        //
//                        //
//                        //// Detect Person. If somebody - path through
//                        //if (searchPersons()) {
//                        //    move(chosenArrow);
//                        //} else {
//                        //    if (!searchTreasure && !searchMob()) {
//                        //        move(chosenArrow);
//                        //    }
//                        //}
//
//                    }
//                } else {
//
//                    var armyFrame = getArmyFrame();
//                    var randArmy = Math.floor(Math.random() * 3);
//
//                    try {
//
//                        var armySelector = "#" + army[randArmy] + " .ArmyShow .cp[onclick][valign=middle]";
//                        var chooseArmy = armyFrame.document.querySelectorAll(armySelector);
//                        chooseArmy[chooseArmy.length - 1].click();
//
//                        armyFrame.location.reload();
//                    }
//                    catch (err) {
//                        armyFrame.location.reload();
//                    }
//                    if (window.frames[locale.mainFrame].frames[locale.combatFrame].document.querySelector("#la a")) {
//                        if (window.frames[locale.mainFrame].frames[locale.combatFrame]) {
//                            window.frames[locale.mainFrame].frames[locale.combatFrame].document.querySelector("#la a").click();
//                        }
//                    }
//
//                }
//            }
//            loop();
//        }, rand);
//    }());
//
//}, 5000);
//
//setInterval(function () {
//    var c = locale.coordinates;
//    if (arrowsArray[0] == c.north) {
//        arrowsArray = [c.south, c.west, c.north, c.east];
//    } else {
//        arrowsArray = [c.north, c.east, c.south, c.west];
//    }
//}, 3600000);
//
////setInterval(function () {
////    reloadMap();
////}, 28800000);
////
////setInterval(function () {
////    if (option.action == "go") {
////        changeWear();
////    }
////}, 30000);