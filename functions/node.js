var getHealthTab = function () {
  return window.frames["loc"].frames["show_info"].document.querySelector(
    locale.healthTab
  );
};

var getTravelFrame = function () {
  return window.frames[locale.mainFrame].frames[locale.noCombatFrame];
};

var getCoordinateNode = function (travelFrame) {
  return travelFrame.document.getElementById(locale.coordinatesText);
};

var getMobNode = function (travelFrame) {
  return travelFrame.document
    .getElementById("plrs")
    .querySelectorAll(locale.attack);
};

var getCharNode = function (travelFrame) {
  return travelFrame.document
    .getElementById("plrs")
    .querySelectorAll(locale.player);
};

var getImageOfLocation = function (travelFrame) {
  if (travelFrame && travelFrame.document.querySelector(".cssLocImage")) {
    return travelFrame.document.querySelector(".cssLocImage").src;
  } else {
    return false;
  }
};

var getBugSearch = function (travelFrame) {
  if (travelFrame && travelFrame.document.querySelector("td i a")) {
    return travelFrame.document.querySelector("td i a");
  } else {
    return false;
  }
};

var getItemNode = function (travelFrame) {
  return travelFrame.document.getElementById("picks");
};

var getInputCaptcha = function (travelFrame) {
  return travelFrame.document.getElementById("value");
};

var getSpeedNode = function (travelFrame) {
  return travelFrame.document.getElementById("hru");
};

var getArrowNode = function (travelFrame, arrow) {
  return travelFrame.document.getElementById(locale.coordinates[arrow])
    .firstElementChild;
};

var getHealthBarWidth = function () {
  var getHealthBarNode = window.frames[locale.mainFrame].frames[
    locale.showInfoFrame
  ].document.querySelector(locale.healthLine);
  if (getHealthBarNode) {
    return getHealthBarNode.style.width;
  } else {
    return false;
    //window.frames[locale.mainFrame].frames[locale.showInfoFrame].document.querySelector(locale.healthTab).click();
  }
};

var getArmyFrame = function () {
  return window.frames[locale.mainFrame].frames[locale.armyFrame];
};

var getHealthNode = function (combatFrame) {
  return combatFrame.document.querySelector("#hp_col44322");
};

var getExpNode = function () {
  if (window.frames[locale.mainFrame].frames[locale.showInfoFrame]) {
    return window.frames[locale.mainFrame].frames[
      locale.showInfoFrame
    ].document.querySelector(locale.expLine);
  } else {
    return false;
  }
};

var getCombatField = function () {
  return window.frames[locale.mainFrame].frames[locale.combatFrame];
};

var getUnitNode = function (armyFrame, armyType) {
  var armySelector = "#" + armyType + " .ArmyShow td > div";
  var chooseArmy = armyFrame.document.querySelectorAll(armySelector);
  return chooseArmy[chooseArmy.length - 1];
};

//var getUnitNode = function(armyFrame){
//    return armyFrame.document.querySelector("");
//};

var getExitLink = function (combatFrame) {
  var laa = combatFrame.document.querySelector("#la a");
  return laa;
};
