var async = require('async');

async.waterfall([
    function(callback) {
        setTimeout(function() {
            callback(false,2+3)
        },100);
    },
    function(sum,callback) {
        setTimeout(function() {
            callback(false,sum-1)
        },100);
    },
    function(left,callback) {
        setTimeout(function() {
            callback(false,left * 2)
        },100);
    }
],function(err,result) {
    console.log(err,result);
});