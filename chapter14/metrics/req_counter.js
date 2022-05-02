const client = require('prom-client');
const counter = new client.Counter({
    name: 'req_count',
    help: 'http request count',
});
exports.addReqCount = function () {
    counter.inc(); // Increment by 1
    console.log('add one');
};
