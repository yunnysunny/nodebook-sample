const { Transform, Readable, Writable } = require('stream');
class InputStream extends Readable {
    _read () {
        //
    }
}
class OutputStream extends Writable {
    constructor (options) {
        super(options);
        this.data = [];// 调试用
    }

    _write (chunk, encoding, callback) {
        this.data.push(chunk);
        callback();
    }
}
class MyTransform extends Transform {
    _transform (chunk, encoding, callback) {
        const filterData = [];
        for (const byte of chunk) {
            if (byte % 2 === 0) {
                filterData.push(byte);
            }
        }
        if (filterData.length > 0) {
            this.push(Buffer.from(filterData));
        }
        callback();
    }
}
const inputStream = new InputStream();
const outputStream = new OutputStream();
const myTransform = new MyTransform();
inputStream.pipe(myTransform).pipe(outputStream);
const count = 6;
function readData (i) {
    if (i < count) {
        inputStream.push(Buffer.from([i & 0xff]));
        setTimeout(() => {
            readData(i + 1);
        }, 100);
    } else {
        inputStream.push(null);
    }
}
readData(0);

myTransform.on('data', function (data) {
    console.log('transform 得到的转化数据', data);
});
outputStream.on('finish', function () {
    console.log('流写结束了');
    console.log(outputStream.data);
});
