// Count Similar Items in Array
function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === what) count++;
    }
    return count;
}

function smaugDateFormat() {
    var getDate = new Date();
    var formatDate = (getDate.getMonth()+1) + "/" + getDate.getDate() + "/" + getDate.getFullYear();
    return (new Date(formatDate).getTime());
}

function smaugDateFormatYesterday(param) {
    var getDate = new Date();
    getDate.setDate(getDate.getDate()-param);
    var formatDate = (getDate.getMonth()+1) + "/" + getDate.getDate() + "/" + getDate.getFullYear();
    return (new Date(formatDate).getTime());
}