var STR_RAND = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

exports.create = function (len) {
    len = len || 4;
    var resultStr = '';
    const length = STR_RAND.length;
    var random = null;
    for (var i = 0; i < len; i++) {
        random = Math.floor(Math.random() * length);
        resultStr += STR_RAND.substring(random - 1, random);
    }
    return resultStr;
}