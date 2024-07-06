const { Readable } = require('stream');

class MyReadable extends Readable {
    constructor (options) {
        super(options);
    }

    _read () {
        console.log('_read has been called');
        const index = Math.random() * 0xff;
    // this.push(Buffer.from([index & 0xff]));//加上这句代码，可以让缓冲区中一直有数据
    }
}

const reader = new MyReadable({
    highWaterMark: 4,
});
const initSize = 6;
for (let i = 0; i < initSize; i++) {
    const pushResult = reader.push(Buffer.from([i & 0xff]));
    if (!pushResult) {
        console.warn('reach highwater, you have better not to push', i);
    }
}
reader.pause();//这句话没有任何意义，因为代码中有 readable 事件监听，pause 函数调用将会被忽略
reader.on('readable', function () {
    console.log('flow mode', reader.readableFlowing);
    console.log('get data', reader.read());
});

console.log('now', reader.readableFlowing);
