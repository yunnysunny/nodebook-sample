const { Readable } = require('stream');

class MyReadable extends Readable {
    constructor (options) {
        super(options);
    }

    _read () {
        console.log('_read has been called');
        const index = Math.random() * 0xff;
        this.push(Buffer.from([index & 0xff]));
    }
}

const reader = new MyReadable({
    highWaterMark: 4,
});
const DATA = '中国雄起加油'.split('');
const initSize = 6;
for (let i = 0; i < initSize; i++) {
    const pushResult = reader.push(DATA[i]);
    if (!pushResult) {
        console.warn('reach highwater, you have better not to push', i);
    }
}
console.log(reader.read());
