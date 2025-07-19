const { readDataDelay } = require('./data-source');
const { DataStream } = require('./data-stream');

function readData (begin, size, callback) {
    readDataDelay(1000)(begin, size).then(data => {
        callback(null, data);
    }).catch(err => {
        callback(err);
    });
}

exports.getStream = function () {
    const stream = new DataStream();
    let begin = 0;
    const size = 1;
    function read () {
        readData(begin, size, (err, data) => {
            if (data.length === 0) {
                stream.push(null);
                return;
            }
            if (err) {
                stream.emit('error', err);
            } else {
                stream.push(...data);
                begin += size;
                read();
            }
        });
    }
    read();
    return stream;
};