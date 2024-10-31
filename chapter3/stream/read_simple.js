const { Readable } = require('stream');

class MyReadable extends Readable {
    _read () {

    }
}

const reader = new MyReadable({
    highWaterMark: 4,
});
console.log('现有流模式', reader.readableFlowing);
console.log('在流有数据前读取', reader.read());
const data = ['a', 'b', 'c', 'd', 'e', 'f'];
const dataLen = data.length;
for (let i = 0; i < dataLen; i++) {
    const pushResult = reader.push(Buffer.from(data[i]));
    if (!pushResult) {
        console.warn('达到highWater值了，最好不要再 push 了', i);
    }
}
for (let i = 0; i < 3; i++) {
    console.log('read after push', i, reader.read());
}
// 给可读流推送 null，表示数据已经读取完毕
reader.push(null);
console.log('可读取结束后读取', reader.read());
// 因为在流结束后，调用 push 函数，下面这句会触发可读流的 error 事件
reader.push('a');
reader.on('error', (err) => {
    console.error('可读流出错', err);
});
// nodejs 中如果对于对象的 error 事件没有监听器，会导致进程触发 uncaughtException 事件
process.on('uncaughtException', (err) => {
    console.error('uncaughtException', err);
});
