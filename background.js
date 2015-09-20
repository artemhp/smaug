function smaugSet (obj, result) {
    chrome.storage.sync.set(obj, function(){
        result();
    });
}

//smaugSet({
//    'statistics': {
//        'clothes': {
//            'combatClothes': ''
//        },
//        'statistics' : {
//            memory: 0,
//            'mobsFound' : 0,
//            steps: 0,
//            objects : {
//
//            }
//        }
//    }
//}, function(){
//    console.log("Statistics Updated");
//});