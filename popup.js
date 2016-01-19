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
            'beverage1': inputBeverage1.value,
            'beverage2': inputBeverage2.value,
            'beverage3': inputBeverage3.value,
            'beverage4': inputBeverage4.value,
            'svitokHealth': svitokHealth.value,
            'svitokHealthPic': svitokHealthPic.value,
            'reload': reload.checked
        }
    }, function () {
        console.log("Clothes has been Changed!");
    });

    smaugSendRequest(wearLink + inputTravelClothes.value);

    if (delayInMinutes.value) {
        chrome.extension.sendMessage({action: "delay", delayInMinutes: delayInMinutes.value}, function (response) {
        });
    }

}, false);

// When Click Reset Button
buttonReset.addEventListener("click", function () {
    chrome.storage.local.remove("coordinates");
    chrome.storage.local.remove("storedCoordinatesTraps");
}, false);

// When Click Reset Button
buttonStart.addEventListener("click", function () {
    smaugSet({
        'action': "go"
    }, function () {
        console.log("Now Smaug is ready to Kill");
    });
}, false);

smaugGet(["clothes", "statistics"], function (a) {
    document.getElementById("combatClothes").value = a.clothes.combat;
    document.getElementById("travelClothes").value = a.clothes.travel;
    document.getElementById("beverage1").value = a.clothes.beverage1;
    document.getElementById("beverage2").value = a.clothes.beverage2;
    document.getElementById("beverage3").value = a.clothes.beverage3;
    document.getElementById("beverage4").value = a.clothes.beverage4;
    document.getElementById("svitokHealth").value = a.clothes.svitokHealth;
    document.getElementById("svitokHealthPic").value = a.clothes.svitokHealthPic;

    if (a.clothes.reload == true) {
        document.getElementById("reload").checked = true;
    }

    document.getElementById("_today-gold").innerHTML = a.statistics.daily[smaugDateFormat()][locale.goldId];
    document.getElementById("_today_combat").innerHTML = a.statistics.daily[smaugDateFormat()]["creature"];
    var getTodayExp = parseInt(a.statistics.daily[smaugDateFormat()]["experience"]);



    if (a.statistics.daily[smaugDateFormatYesterday(1)]) {
        document.getElementById("_yesterday-gold").innerHTML = a.statistics.daily[smaugDateFormatYesterday(1)][locale.goldId];
        var getYesterdayExp = parseInt(a.statistics.daily[smaugDateFormatYesterday(1)]["experience"]);
        var getYesterdayCombats = parseInt(a.statistics.daily[smaugDateFormatYesterday(1)]["creature"]);
        console.log("Exp:");
        document.getElementById("_total_exp").innerHTML = (getTodayExp - getYesterdayExp);
        document.getElementById("_yesterday_combat").innerHTML = getYesterdayCombats;
    } else {
        document.getElementById("_yesterday-gold").innerHTML = "0";
        document.getElementById("_total_exp").innerHTML = "0";
        document.getElementById("_yesterday_combat").innerHTML = "0"
    }

    console.log(a.statistics.daily);

    var iterateStat = 0;
    var totalGold = 0;
    var totalMobs = 0;
    for (var stat in a.statistics.daily) {
        if (a.statistics.daily.hasOwnProperty(stat)) {
            if (a.statistics.daily[stat][locale.goldId]) {
                totalGold += a.statistics.daily[stat][locale.goldId];
            }
            if (a.statistics.daily[stat]["creature"]){
                totalMobs += a.statistics.daily[stat]["creature"];
            }
        }
        iterateStat++;
    }
    console.log(totalGold);
    console.log(iterateStat);

    document.getElementById("_total_mobs").innerHTML = totalMobs;
    document.getElementById("_total-days").innerHTML = iterateStat;
    document.getElementById("_total_gold").innerHTML = totalGold;



});

smaugGet("action", function (a) {
    console.log(a);
    if (a.action == "go") {
        buttonStart.disabled = true;
    } else {
        buttonStop.disabled = true;
    }
});