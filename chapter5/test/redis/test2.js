const Redis = require('ioredis');
/**
 * 如果不传参数默认连接127.0.0.1:6379端口
 * */
const redis = new Redis();

redis.pipeline().set('foo', 'bar').get('foo').exec(function (err, results) {
    console.log('chain', err, results);
});

redis.pipeline().set('foo', 'bar').get('foo', function (err, result) {
    console.log('get foo', err, result);
}).exec(function (err, results) {
    console.log('with single callback', err, results);
});

redis.pipeline([
    ['set', 'foo', 'bar'],
    ['get', 'foo']
]).exec(function (err, results) {
    console.log('array params', err, results);
});