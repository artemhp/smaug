var storedCoordinates = [];
var currentCoordinate;
var storedCoordinatesArray = [];
var arrowsArray = [
    locale.coordinates.north,
    locale.coordinates.east,
    locale.coordinates.south,
    locale.coordinates.west
];

smaugGet(null, function(a){
    console.log(a);
});

//chrome.storage.local.remove("statistics");
smaugGet('statistics', function(a){
    if (!a.statistics){
        var statisticsObj = {
            'storedCoordinates': [],
            'itemsFound': {
            },
            'steps': 0,
            'daily': {
            }
        };

        //statisticsObj.itemsFound[moveSearchTreasure.type] = moveSearchTreasure.count;
        //statisticsObj.daily[smaugDateFormat()] = {};

        smaugSet({
            'statistics': statisticsObj
        }, function(){
            console.log("Statistics has been created");
        });
    }
});

smaugGet('clothes', function(a){
    if (!a.clothes){

        var clothesObj = {
            'combat': 777596,
            'travel': 777596
        };

        smaugSet({
            'clothes': clothesObj
        }, function(){
            console.log("Clothes has been created");
        });

    }
});

//smaugSet({
//    'clothes.combat': 777596
//}, function(){});

function actionOnTravelFrame(){
    if (speed() > 30) {
        //console.log("Speed " + speed() + " is enough!");

        // Get Coordinates
        var currentCoordinate = getCoordinates();
        //console.log("Current Coordinate:" + currentCoordinate);

        // Get Available Arrows
        var availableArrows = getAvailableArrows(analyseArrow);
        //console.log("Available Arrows:" + availableArrows);

        // Choose Coordinates
        var chosenArrow = chooseCoordinates(availableArrows);
        //console.log(chosenArrow['title']);

        // Save Coordinates
        smaugGet('localCoordinate', function(a){
            if (a.localCoordinate !== currentCoordinate.local) {
                // It is definitely not after refresh
                saveCoordinates(currentCoordinate, function(){
                    move(chosenArrow);
                });
            } else {
                move(chosenArrow)
            }
        });

    }
}
setTimeout(function () {
    (function loop() {
        var rand = Math.random() * (2000 - 1000) + 1000;
        setTimeout(function() {
            if (getTravelFrame()) {
                smaugGet('action', function(act) {
                    if (act.action == "go") {
                        smaugGet('coordinates', function(a){

                            if (!a.coordinates) {
                                storedCoordinates = [];
                            } else {
                                storedCoordinates = a.coordinates;
                            }

                            if (storedCoordinates.length > 600) {
                                storedCoordinates = [];
                                chrome.storage.local.remove("coordinates");
                            }

                            storedCoordinatesArray = storedCoordinates.map(function(el){
                                return el.local;
                            });

                            ////////// Action
                            actionOnTravelFrame();
                        });
                    }
                });
            }
            loop();
        }, rand);
    }());

    (function loop() {
        var rand = Math.random() * (15000 - 10000) + 10000;
        setTimeout(function() {
            if (getArmyFrame()) {
                var randArmy = Math.floor(Math.random() * 3);
                var unit = getUnitNode(getArmyFrame(), locale.army[randArmy]);

                if (unit) {
                    unit.click(function(){});
                }

                getArmyFrame().location.reload();
                getCombatField().location.reload();

                if (getExitLink(getCombatField())) {
                    getExitLink(getCombatField()).click();
                }
            }
            loop();
        }, rand);
    }());

}, 5000);

setInterval(function () {
    smaugGet(['action', 'clothes'], function(act) {
        if (act.action == "go") {
            smaugSendRequest(locale.wearLink + act.clothes.travel, function(){
                console.log("Clothes weared");
            });
        }
    });
}, 30000);

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
    if (request.action === "reload") {
        location.reload();
    } else if (request.action === "drinkBeverage") {

        smaugGet(['clothes', 'action'], function(act) {
            if (act.action == "go") {
                smaugSendRequest("http://fantasyland.ru/cgi/inv_wear.php?id=" + act.clothes.beverage, function(){
                    console.log("Beverage has been drinked");
                });
            }
        });

    }
});