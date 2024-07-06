const Redis = require('ioredis');
/**
 * 如果不传参数默认连接127.0.0.1:6379端口
 * */
const redis = new Redis(/*{"port" : 6379,"host" : "127.0.0.1",password: 'auth'}*/);//没有密码不需要传password参数
/*
var clusterRedis = [
    {
        "host":"127.0.0.1",
        "port":6379
    },
    {
        "host":"127.0.0.1",
        "port":6380
    }
];
var redis =  new Redis.Cluster(clusterRedis,{redisOptions:{password: 'auth'});//集群连接方式
*/

redis.set('foo', 'bar', function (err, reply) {
    console.log(err, reply);//正常情况打印 null 'OK'
});
redis.get('foo', function (err, result) {
    console.log(err, result);//正常情况打印 null 'bar'
});
