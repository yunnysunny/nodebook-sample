const { Readable } = require('stream');
const { readDataDelay } = require('./data-source');
const readFun = readDataDelay(1000);
class LegacyStream extends Readable {
    constructor (options) {
        super({ ...options, objectMode: true });
        this.start = 0;
        this.size = 1;
    }

    /**
     * 这个函数是有 bug 的，如果两个请求同时调用，
     * 通一个 start 会同时被两个请求使用，导致重复数据读取错乱
     */
    _read () {
        const size = this.size;
        readFun(this.start, size).then(data => {
            if (data.length > 0) {
                this.push(data);
                this.start += size;
            } else {
                this.push(null);
            }
        }).catch(err => {
            this.emit('error', err);
        });
    }
}

exports.LegacyStream = LegacyStream;
