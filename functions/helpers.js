// Count Similar Items in Array
function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === what) count++;
    }
    return count;
}