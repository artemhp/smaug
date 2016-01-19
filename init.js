var storedCoordinates = [];
var currentCoordinate;
var storedCoordinatesArray = [];
var storedCoordinatesTrapArray = [];

var arrowsArray = [
    locale.coordinates.north,
    locale.coordinates.east,
    locale.coordinates.south,
    locale.coordinates.west
];

smaugGet(null, function(a){
    console.log(a);
});

// If you need to remove statistics.
//chrome.storage.local.remove("statistics");

smaugGet(['statistics', 'storedCoordinatesTraps', 'coordinates'], function(a){
    if (!a.statistics){
        var statisticsObj = {
            'storedCoordinates': [],
            'daily': {
            }
        };
        smaugSet({
            'statistics': statisticsObj
        }, function(){
            console.log("Statistics has been created");
        });
    }
    if (!a.storedCoordinatesTraps) {
        smaugSet({
            'storedCoordinatesTraps': []
        }, function(){
            console.log("Traps array has been created");
        });
    }
    if (!a.coordinates) {
        smaugSet({
            'coordinates': []
        }, function(){
            console.log("Coordinates array has been created");
        });
    }
});

//smaugGet('travelClothesEnable', function(a){
//    if (!a.travelClothesEnable){
//        smaugSet({
//            'travelClothesEnable': false
//        }, function(){
//            console.log("Statistics has been created");
//        });
//    }
//});

smaugGet('clothes', function(a){
    if (!a.clothes){
        var clothesObj = {
            'combat': 781545,
            'travel': 781545,
            'beverage1': 2503330,
            'beverage2': 2503330,
            'beverage3': 2503330,
            'beverage4': 2274,
            'svitokHealth': 130105,
            'svitokHealthPic': '/images/items/scroll_heal_10.gif'
        };
        smaugSet({
            'clothes': clothesObj
        }, function(){
            console.log("Clothes has been created");
        });
    }
});

smaugGet('exit', function(a){
    if (!a.hasOwnProperty("exit")){
        smaugSet({
            'exit': false
        }, function(){
            console.log("Property for Alarm has been Created");
        });
    }
});
//
//window.onerror = function(message, url, line) {
//    console.log(message);
//    console.log(url);
//    console.log(line);
//};