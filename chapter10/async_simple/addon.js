var asyncSimple = require('./build/Release/async-simple');

asyncSimple.doAsyncWork('prefix:',function(err,result) {
    console.log(err, result);
});