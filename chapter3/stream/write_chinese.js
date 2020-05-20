const { Writable } = require('stream');

class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    setTimeout(function() {
      callback();
    },100);
  }
}

const writer = new MyWritable({
  highWaterMark: 6
});
const DATA = '中国雄起加油'.split('');
for (var i=0;i<6;i++) {
   const result = writer.write(DATA[i]);
   console.log('推荐下次继续写',result);
}
writer.on('drain',function() {
  console.log('现在可以放心写了');
});
writer.on('error',function(err) {
  console.error('写错误',err);
});