
setTimeout(function () {
    (function loop() {
        var rand = Math.random() * (2000 - 1000) + 1000;
        setTimeout(function() {
            if (getTravelFrame()) {

                chrome.runtime.sendMessage({action: "travel"});

                smaugGet('action', function(act) {
                    if (act.action == "go") {
                        smaugGet('coordinates', function(a){

                            if (!a.coordinates) {
                                storedCoordinates = [];
                            } else {
                                storedCoordinates = a.coordinates;
                            }

                            if (storedCoordinates.length > 300) {
                                storedCoordinates = [];
                                chrome.storage.local.remove("coordinates");
                            }

                            // Try to avoid this
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

                chrome.runtime.sendMessage({action: "combat"});

                var randArmy = Math.floor(Math.random() * 3);
                var unit = getUnitNode(getArmyFrame(), locale.army[randArmy]);

                if (unit) {
                    unit.click(function(){});
                }

                //console.log(getHealthNode(getArmyFrame()).getAttribute("style"));
                if (getHealthNode(getArmyFrame())) {
                    var healthCheck = parseInt(getHealthNode(getArmyFrame()).getAttribute("style").match(/\d+/)[0]);
                    if (healthCheck < 35) {

                        smaugGet(['clothes'], function(act) {
                            console.log(act.svitokHealthPic);
                            window.frames[locale.mainFrame].frames[locale.armyFrame].document.querySelectorAll("[src='"+act.clothes.svitokHealthPic+"']")[0].click()
                        });

                    }
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

        smaugGet(['action', 'clothes'], function(act) {
            if (act.action == "go" && act.clothes.reload == true) {
                location.reload();
            }
        });


    } else if (request.action === "drinkBeverage") {

        if (getTravelFrame()) {
            smaugGet(['clothes', 'action'], function(act) {
                if (act.action == "go" && getTravelFrame()) {
                    if (act.clothes.beverage1) {
                        smaugSendRequest(locale.drinkLink + act.clothes.beverage1, function(){
                            console.log("Beverage has been drinked");
                        });
                    }
                    if (act.clothes.beverage2) {
                        smaugSendRequest(locale.drinkLink + act.clothes.beverage2, function(){
                            console.log("Beverage has been drinked");
                        });
                    }
                    if(act.clothes.beverage3) {
                        smaugSendRequest(locale.drinkLink + act.clothes.beverage3, function(){
                            console.log("Beverage has been drinked");
                        });
                    }

                }
            });
        }


    }  else if (request.action === "useHealth") {
        smaugGet(['clothes', 'action'], function(act) {

                if(act.action == "go" && act.clothes.svitokHealth && getTravelFrame()) {
                    smaugSendRequest(locale.drinkLink + act.clothes.svitokHealth, function(){});
                    smaugSendRequest(locale.drinkLink + act.clothes.svitokHealth, function(){});
                    smaugSendRequest(locale.drinkLink + act.clothes.svitokHealth, function(){});
                    smaugSendRequest(locale.drinkLink + act.clothes.svitokHealth, function(){});
                    smaugSendRequest(locale.drinkLink + act.clothes.svitokHealth, function(){});
                    smaugSendRequest(locale.drinkLink + act.clothes.svitokHealth, function(){});
                    smaugSendRequest(locale.drinkLink + act.clothes.svitokHealth, function(){});
                    smaugSendRequest(locale.drinkLink + act.clothes.svitokHealth, function(){});
                }

        });
    } else if (request.action === "initDelay") {
        smaugSet({
            'exit': true
        }, function(){
            console.log("If not in combat - Quit");
        });
    }
});