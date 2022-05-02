const http = require('http');
const client = require('prom-client');
const { addReqCount } = require('./metrics/req_counter');
const { collectDuration } = require('./metrics/req_duration');

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();
const port = Number(process.env.LISTEN_PORT) || 3001;
const SAMPLES = [20, 50, 80, 80, 100, 100, 100, 120, 120, 140, 160];
const SAMPLES_LEN = SAMPLES.length;
http.createServer((req, res) => {
    const duration = SAMPLES[Math.floor(Math.random() * SAMPLES_LEN)];
    const begin = Date.now();
    setTimeout(function () {
        console.log('url', req.url);
        addReqCount();
        collectDuration(Date.now() - begin);
        if (req.url === '/metrics') {
            client.register.metrics().then(function (str) {
                res.end(str);
            }).catch(function (err) {
                res.end(err);
            });
            return;
        }
        res.end('Hello World');
    }, duration);
}).listen(port);