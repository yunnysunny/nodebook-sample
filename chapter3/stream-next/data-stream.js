const { Readable } = require('stream');
class DataStream extends Readable {
    constructor (options) {
        super({
            ...options,
            objectMode: true,
        });
    }

    _read () {

    }
}

exports.DataStream = DataStream;
