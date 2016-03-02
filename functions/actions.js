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

        var testTrap = storedCoordinatesTrapArray.indexOf(obj.nextCoordinates);
        if (testTrap >= 0) {
            obj.coordinateRate = 1000000;
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
    if (mob.length > 0 && getHealthBarWidth() == "100%") {

        smaugGet('clothes', function (cloth) {
            smaugSendRequest(locale.wearLink + cloth.clothes.combat, function (request) {
                if (request.status === 200) {
                    smaugSet({
                        'travelClothesEnable': false
                    }, function (){
                        console.log("attack");
                        console.log(searchPersons());
                        if (searchPersons()) {
                            mob[0].click();
                        }
                    });
                }
            });
        });

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
    console.log(getCharNode(getTravelFrame()).length == 1);
    return getCharNode(getTravelFrame()).length == 1;
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
    if (getSpeedNode(getTravelFrame())){
        var parseSpeed = getSpeedNode(getTravelFrame()).innerHTML.match(/(\d+)/gi);
        if (parseSpeed) {
            return parseInt(parseSpeed[0]);
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}

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