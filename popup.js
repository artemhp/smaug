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
            'beverage1' : inputBeverage1.value,
            'beverage2' : inputBeverage2.value,
            'beverage3' : inputBeverage3.value,
            'svitokHealth' : svitokHealth.value,
            'svitokHealthPic' : svitokHealthPic.value,
            'reload' : reload.checked
        }
    }, function () {
        console.log("Clothes has been Changed!");
    });

    smaugSendRequest(wearLink + inputTravelClothes.value);

    if (delayInMinutes.value) {
        chrome.extension.sendMessage({action: "delay", delayInMinutes: delayInMinutes.value}, function(response) {});
    }

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

smaugGet(["clothes"], function (a) {
    document.getElementById("combatClothes").value = a.clothes.combat;
    document.getElementById("travelClothes").value = a.clothes.travel;
    document.getElementById("beverage1").value = a.clothes.beverage1;
    document.getElementById("beverage2").value = a.clothes.beverage2;
    document.getElementById("beverage3").value = a.clothes.beverage3;
    document.getElementById("svitokHealth").value = a.clothes.svitokHealth;
    document.getElementById("svitokHealthPic").value = a.clothes.svitokHealthPic;

    if (a.clothes.reload == true) {
        document.getElementById("reload").checked = true;
    }

});

smaugGet("action", function (a) {
    console.log(a);
    if (a.action == "go") {
        buttonStart.disabled = true;
    } else {
        buttonStop.disabled = true;
    }
});