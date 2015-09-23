var reloadMap = function () {
    smaugRemove('coordinates', function () {
        //console.log('Remove Coordinates');
        location.reload();
    });
};

function changeWear() {
    if (getTravelFrame()) {
        smaugGet('travelClothes', function (a) {
            smaugSendRequest(locale.wearLink + a["travelClothes"])
        });
    }
}

function getCoordinates() {
    // get coordinates fro markup and parse L-0 (10, 19) will be 10, 19
    // split coordinates for left and top
    var parseCoordinates = getCoordinateNode(getTravelFrame()).innerHTML.match(/(\d+, \d+)/gi);
    var coordinatesToArray = parseCoordinates[0].split(", ");

    return {
        local: parseCoordinates[0].toString(),
        left: parseInt(coordinatesToArray[0]),
        top: parseInt(coordinatesToArray[1])
    }
}

function analyseArrow(param) {

    var obj = {};
    var coordinatesTop = getCoordinates().top;
    var coordinatesLeft = getCoordinates().left;

    // By ID set direction name and coordinates we will follow.
    // According to local coordinates count what coordinates of arrow.

    if (param == locale.coordinates.west) {
        obj.direction = "west";
        obj.nextCoordinates = (coordinatesLeft - 1) + ", " + coordinatesTop;
    } else if (param == locale.coordinates.east) {
        obj.direction = "east";
        obj.nextCoordinates = (coordinatesLeft + 1) + ", " + coordinatesTop;
    } else if (param == locale.coordinates.north) {
        obj.direction = "north";
        obj.nextCoordinates = coordinatesLeft + ", " + (coordinatesTop - 1);
    } else {
        obj.direction = "south";
        obj.nextCoordinates = coordinatesLeft + ", " + (coordinatesTop + 1);
    }

    // How much this coordinates repeats we can know comparing
    // coordinate with array in storage.
    //console.log(storedCoordinatesArray.length);
    var nextCoordinatesRepeats = countInArray(storedCoordinatesArray, obj.nextCoordinates);

    //-------------------------------------------------------
    // Analyze ----------------------------------------------
    //-------------------------------------------------------

    var patternGo = new RegExp(locale.move);
    var patternKey = new RegExp(locale.door);

    // get element with ID of arrow
    var elem = getArrowNode(getTravelFrame(), obj.direction);
    obj.elem = elem;

    if (patternGo.test(elem.getAttribute("title"))) {
        // We can Go
        obj.status = "open";
        obj.coordinateRate = nextCoordinatesRepeats;

    } else if (patternKey.test(elem.getAttribute("title"))) {
        // It is door
        obj.status = "door";
        obj.coordinateRate = nextCoordinatesRepeats + 3;

    } else {
        // it is wall and we can't go
        obj.status = "close";
        obj.coordinateRate = 5000000000;
    }

    return obj;
}

function saveCoordinates(coordinate, callback) {
    //console.log(coordinate.local);
    storedCoordinates.push(coordinate);
    smaugSet({
        'localCoordinate': coordinate.local,
        'coordinates': storedCoordinates
    }, function () {
        //console.log("Local Coordinate Saved");
        callback();
    });
}

function searchMob() {
    var mob = getMobNode(getTravelFrame());
    if (mob.length > 0) {

        smaugGet('statistics', function(a) {
            var currentDate = smaugDateFormat();

            if (a.statistics.daily[currentDate]) {
                // Case when current date in statistics exist
                a.statistics.daily[currentDate]['creatures'] = parseInt(a.statistics.daily[currentDate]['creatures']) + 1;
            } else {
                // Case when current date in statistics doesn't exist
                a.statistics.daily[currentDate] = {};
                a.statistics.daily[currentDate]['creatures'] = 1;
            }

            // General Statistics
            if (a.statistics.creatures) {
                a.statistics.creatures = parseInt(a.statistics.creatures) + 1;
            } else {
                a.statistics.creatures = 1;
            }

            smaugSet({
                'statistics': a.statistics
            }, function () {
                smaugGet('clothes', function (cloth) {
                    smaugSendRequest(locale.wearLink + cloth.clothes.combat, function(request){
                        if (request.status === 200) {
                            mob[0].click();
                        }
                    });
                });
            });

        });

        //smaugSendRequest(locale.wearLink + localStorage["combatClothes"], function(request){
        //    if (request.status === 200) {
        //        // --------------------------------------------
        //        // Statistics Mobs Found
        //        // --------------------------------------------
        //        if (localStorage["statisticsMobsAttacks"]) {
        //            localStorage["statisticsMobsAttacks"] = parseInt(localStorage["statisticsMobsAttacks"]) + 1;
        //        } else {
        //            localStorage["statisticsMobsAttacks"] = 1;
        //        }
        //        mob[0].click();
        //    }
        //});
        return true;
    } else {
        return false;
    }
}

function getAvailableArrows(analyseArrow) {
    var arrows = [];
    var i = 0;
    for (arrowsArray; i < arrowsArray.length; i++) {
        arrows.push(analyseArrow(arrowsArray[i]));
    }
    return arrows;
}

// Sort all Arrows and decide which to choose by coefficient
function chooseCoordinates(getArrows) {
    // Sort all coordinates by it's coefficient
    getArrows.sort(function (a, b) {
        if (a.coordinateRate > b.coordinateRate)
            return 1;
        if (a.coordinateRate < b.coordinateRate)
            return -1;
        return 0;
    });
    return getArrows[0].elem;
}

function searchPersons() {
    return getCharNode(getTravelFrame()).length > 1;
}

function searchTreasure() {
    var picks = getItemNode(getTravelFrame());
    if (picks) {
        if (picks.innerHTML !== "") {

            var foundItemNode = picks.querySelector(locale.pick);
            var foundLockNode = picks.querySelector(locale.unlock);

            if (foundItemNode) {
                var countFoundItem = parseInt(picks.querySelector("input[type=text]").value);
                return {
                    item: foundItemNode,
                    type: picks.querySelector("input").id,
                    count: countFoundItem
                };
            } else if (foundLockNode) {
                return {
                    type: 'locked',
                    item: foundLockNode
                };
            } else {
                return false;
            }

        } else {
            return false;
        }
    } else {
        return false;
    }
}

function speed() {
    var parseSpeed = getSpeedNode(getTravelFrame()).innerHTML.match(/(\d+)/gi);
    return parseInt(parseSpeed[0]);
}

function move(chosenArrow) {

    //smaugGet('clothes', function (cloth) {
    //    smaugSendRequest(locale.wearLink + cloth.clothes.combat, function(request){
    //        if (request.status === 200) {
    //            //mob[0].click();
    //        }
    //    });
    //});

    if (getHealthBarWidth()) {
        if (getHealthBarWidth() == "100%") {

            // Detect Person. If somebody - path through
            var moveSearchPerson = searchPersons();
            var moveSearchMob = searchMob();
            var moveSearchTreasure = searchTreasure();

            if (moveSearchPerson) {
                chosenArrow.click();
                return true;
            }

            // Detect Treasure
            if (moveSearchTreasure) {
                //console.log(moveSearchTreasure);
                //smaugGet(null, function(a){
                //    console.log(a);
                //});
                if (moveSearchTreasure.type == "locked") {
                    moveSearchTreasure.item.click();
                } else {
                    smaugGet('statistics', function (a) {

                        var currentItemType = moveSearchTreasure.type;
                        var currentItemCount = moveSearchTreasure.count;
                        var currentDate = smaugDateFormat();
                        var currentDailyType;
                        var currentDailyCount;

                        // Daily Statistics
                        if (a.statistics.daily[currentDate]) {
                            // Case when current date in statistics exist
                            currentDailyType = a.statistics.daily[currentDate][currentItemType];
                            if (currentDailyType) {
                                currentDailyCount = parseInt(currentDailyType.count) + parseInt(currentItemCount);
                            } else {
                                a.statistics.daily[currentDate][currentItemType] = {};
                                currentDailyCount = parseInt(currentItemCount);
                            }

                            a.statistics.daily[currentDate][currentItemType] = currentDailyCount;
                            debugger;
                        } else {
                            // Case when current date in statistics doesn't exist
                            a.statistics.daily[currentDate] = {};
                            a.statistics.daily[currentDate][currentItemType] = parseInt(currentItemCount);
                            debugger;
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
                            //moveSearchTreasure.item.click();
                        });

                    });
                }
                return false;
            }


            if (moveSearchMob) {
                return false;
            }



            chosenArrow.click();
            return true;
        }
    } else {
        getHealthTab().click();
        return false;
    }
}