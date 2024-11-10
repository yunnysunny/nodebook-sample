const { Duplex } = require('stream');
class PostHouse extends Duplex {
    constructor (options) {
        super(options);
        this.postingLetters = [];
    }

    _write (_chunk, _encoding, callback) {
        this.postingLetters.push(_chunk);
        callback();
    }

    _read () {
        //
    }

    receiveLetter (letter) {
        this.push(letter);
    }
}

const postHouse = new PostHouse({
    objectMode: true, // 以对象模式工作, 方便传递字符串
});
postHouse.on('data', function (data) {
    console.log('收到信', data);
});
postHouse.receiveLetter('信件1');// 使用字符串格式插入可读流数据
postHouse.write('要寄出的信件x');
console.log(postHouse.postingLetters);
