var async = require('async');

async.parallel([
    function(callback) {
        setTimeout(function() {
            callback(null, 1);
        }, 200);
    },
    function(callback) {
        setTimeout(function() {
            callback(null, 2);
        }, 100);
    }
],
function(err, results) {
    console.log(err,results);
    //最终打印结果：null [1,2] 
});