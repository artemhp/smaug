var current = {
    active: true,
    currentWindow: true
};

// Show Info In Window
//sendMessage({dom: "init"}, setDOMInfo);

// When Click Stop Button
buttonStop.addEventListener("click", function () {
    smaugSet({
        'action': "stop"
    }, function () {
        console.log("Now Smaug is relaxing");
    });
}, false);

buttonUpdate.addEventListener("click", function () {
    smaugSet({
        'clothes': {
            'combat': inputCombatClothes.value,
            'travel': inputTravelClothes.value,
            'beverage' : inputBeverage.value
        }
    }, function () {
        console.log("Clothes has been Changed!");
    });

    smaugSendRequest(wearLink + inputTravelClothes.value);
}, false);

// When Click Reset Button
buttonReset.addEventListener("click", function () {
    chrome.storage.local.remove("statistics");
}, false);

// When Click Reset Button
buttonStart.addEventListener("click", function () {
    smaugSet({
        'action': "go"
    }, function () {
        console.log("Now Smaug is ready to Kill");
    });
}, false);

smaugGet("clothes", function (a) {
    document.getElementById("combatClothes").value = a.clothes.combat;
    document.getElementById("travelClothes").value = a.clothes.travel;
});

smaugGet("action", function (a) {
    console.log(a);
    if (a.action == "go") {
        buttonStart.disabled = true;
    } else {
        buttonStop.disabled = true;
    }
});