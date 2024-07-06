const path = require('path');
const c = require('./lib/c');

c.getData(path.join(__dirname, 'test.txt'), function (err, data) {
    console.log(err, data);
});