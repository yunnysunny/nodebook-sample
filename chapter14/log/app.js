const requestLog = require('@yunnysunny/request-logging').default;
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const {
    slogger,
    port,
    kafkaSchedule,
} = require('./config');
const { setTimeout } = require('timers/promises');

const app = express();
app.enable('trust proxy');

app.set('port', port);
app.use(requestLog({
    onReqFinished: (data) => {
        kafkaSchedule.addData(data);
    },
}));

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '1mb'
}));

app.use(express.static(path.join(__dirname, 'public')));
const codes = [1, 2, 3];
app.use('/', async (req, res) => {
    const duration = Math.random() * 1000;
    await setTimeout(duration);
    const resCode = duration > 500 ? codes[Math.floor(Math.random() * 3)] : 0;
    res.set('res-code', '' + resCode);
    res.send('hello world');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found:' + req.path);
    (err).status = 404;
    next(err);
});

// error handlers
app.use(function (err, req, res, next) {
    const status = err.status;
    if (status === 404) {
        return res.status(404).send(err.message || '未知异常');
    }
    res.status(status || 500);
    slogger.error('发现应用未捕获异常', err);
    res.send({
        msg: err.message || '未知异常',
        code: 0xffff
    });
});

const server = http.createServer(app);

server.listen(port);
server.on('error', (err) => {
    slogger.error('发现应用启动异常', err);
});
function onListening () {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    slogger.info('Listening on ' + bind);
}
server.on('listening', onListening);

setInterval(() => {
    const path = ['/a', '/b', '/c'][Math.floor(Math.random() * 3)];
    const options = {
        port,
        host: '127.0.0.1',
        method: 'GET',
        path,
    };

    const req = http.request(options, (res) => {
        res.on('data', (chunk) => {
            // console.log(`BODY: ${chunk}`);
        });
    });
    req.end();
}, 1000);
