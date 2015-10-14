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
            'combat': 781545,
            'travel': 781545,
            'beverage1': 2503330,
            'beverage2': 2503330,
            'beverage3': 2503330,
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