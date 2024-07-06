const async = require('async');

async.waterfall([
    function (callback) {
        setTimeout(function () {
            callback(null, 2 + 3);
        }, 100);
    },
    function (sum, callback) {
        setTimeout(function () {
            callback(null, sum - 1);
        }, 100);
    },
    function (left, callback) {
        setTimeout(function () {
            callback(null, left * 2);
        }, 100);
    }
], function (err, result) {
    console.log(err, result);
});