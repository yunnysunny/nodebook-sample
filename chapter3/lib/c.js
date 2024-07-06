const fs = require('fs');

exports.getData = function (path, callback) {
    fs.exists(path, statCallback);

    function statCallback (exists) {
        if (!exists) {
            return callback(path + '不存在');
        }
        const stream = fs.createReadStream(path);
        let data = '';
        stream.on('data', function (chunk) {
            data += chunk;
        });
        stream.on('end', function () {
            callback(false, data);
        });
    }
};
