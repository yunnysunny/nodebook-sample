const name = 'req-res-demo';
const Server = require('./Server')
const Client = require('./Client')
const ACTION_CALC = 'actionCalc';
//服务器端代码
const server = new Server({//在内部使用 `name` 字段拼接 socket 地址
    name,
});

server.ready((err) => {
    if (err) {
        return console.error(err);
    }
    console.log('服务端创建成功');
});
server.on(ACTION_CALC,function(message,reply) {
    const data = message.data;
    reply({
        data: data.a + data.b, 
        seq: message.seq, 
        action: message.action
    });
});
//客户端代码
const client = new Client({
    name,
});
client.ready(function(err) {
    if (err) {
        return console.error(err);
    }
    console.log('客户端创建成功');
});
client.send({
    action: ACTION_CALC,
    data: {a:1,b:2},
    seq: 1,
},function(err,res) {
    console.log('服务端返回数据',err,res);
});