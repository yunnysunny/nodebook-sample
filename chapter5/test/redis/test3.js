var Redis = require('ioredis');
/**
 * 如果不传参数默认连接127.0.0.1:6379端口
 * */
var redis = new Redis();

redis.watch('foo');
redis.multi().set('foo', 'bar').get('foo').exec(function (err, results) {
    redis.unwatch();
    console.log('chain',err, results);
});

