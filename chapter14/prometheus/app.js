const http = require('http');
const client = require('prom-client');
const { addReqCount } = require('./metrics/req_counter');
const { collectDuration } = require('./metrics/req_duration');
const { commonLabels } = require('./config');

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({
    labels: commonLabels,
});
const port = Number(process.env.LISTEN_PORT) || 3001;
const SAMPLES = [20, 50, 80, 80, 100, 100, 100, 120, 120, 140, 160];
const SAMPLES_LEN = SAMPLES.length;
const STATUS = [200, 200, 200, 200, 304, 488, 510, 511];
const STATUS_LEN = STATUS.length;
http.createServer((req, res) => {
    const duration = SAMPLES[Math.floor(Math.random() * SAMPLES_LEN)];
    const begin = Date.now();
    setTimeout(function () {
        const url = req.url;
        console.log('url', url, req.headers['user-agent']);
        const path = url.split('?')[0];
        if (req.url === '/metrics') {
            client.register.metrics().then(function (str) {
                res.end(str);
            }).catch(function (err) {
                res.end(err);
            });
            return;
        }
        const status = res.statusCode = STATUS[Math.floor(Math.random() * STATUS_LEN)];
        addReqCount({ path, status });
        collectDuration({
            path,
            duration: Date.now() - begin,
            status,
        });
        res.end(JSON.stringify({
            url,
            method: req.method,
        }));
    }, duration);
}).listen(port, '0.0.0.0');

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