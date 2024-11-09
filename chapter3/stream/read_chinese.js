const { Readable } = require('stream');
// const data = 'abcdefghijklmnopqrstuvwxyz'.split('');
class MyReadable extends Readable {
    _read () {
        console.log('_read has been called');
    }
}

const reader = new MyReadable({
    highWaterMark: 4,
});
const DATA = '中国'.split('');
const initSize = 6;
for (let i = 0; i < initSize; i++) {
    const pushResult = reader.push(DATA[i]);
    if (!pushResult) {
        console.warn('reach highwater, you have better not to push', i);
    }
}
console.log(reader.read());
