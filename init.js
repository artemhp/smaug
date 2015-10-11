var storedCoordinates = [];
var currentCoordinate;
var storedCoordinatesArray = [];

var arrowsArray = [
    locale.coordinates.north,
    locale.coordinates.east,
    locale.coordinates.south,
    locale.coordinates.west
];

shuffle(arrowsArray);
setTimeout(function(){ shuffle(arrowsArray); }, 2000000);

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