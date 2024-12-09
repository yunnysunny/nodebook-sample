const { Readable } = require('stream');

class MyReadable extends Readable {
    _read () {
        console.log('_read has been called');
    }
}

const reader = new MyReadable();
const initSize = 6;
for (let i = 0; i < initSize; i++) {
    reader.push(Buffer.from([i & 0xff]));
}
reader.on('readable', function () {
    console.log('get data');
});

//
reader.on('data', (chunk) => {
    console.log('流模式2', reader.readableFlowing);
    console.log('data event', chunk);
});

console.log('流模式', reader.readableFlowing);