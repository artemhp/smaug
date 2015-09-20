var current = {
    active: true,
    currentWindow: true
};

// Show Info In Window
//sendMessage({dom: "init"}, setDOMInfo);

// When Click Stop Button
buttonStop.addEventListener("click", function () {
    sendMessage({
        action: "stop"
    });
}, false);

buttonUpdate.addEventListener("click", function () {
    smaugSet({
        'combatClothes': inputCombatClothes.value,
        'travelClothes': inputTravelClothes.value
    }, function(){
        console.log("Clothes has beed Changed!");
    });

    smaugSendRequest(wearLink + inputTravelClothes.value);
}, false);

// When Click Reset Button
buttonReset.addEventListener("click", function () {
    sendMessage({action: "reset"});
}, false);

// When Click Reset Button
buttonStart.addEventListener("click", function () {
    sendMessage({action: "go"});
}, false);

smaugGet(null, function(a){
    console.log(a)
    document.getElementById("combatClothes").value = a.combatClothes;
    document.getElementById("travelClothes").value = a.travelClothes;
});