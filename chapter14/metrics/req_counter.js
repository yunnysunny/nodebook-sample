const client = require('prom-client');
const { commonLabels, commonLabelNames } = require('../config');
const counter = new client.Counter({
    name: 'req_count',
    help: 'http request count',
    labelNames: ['path', ...commonLabelNames],
});
exports.addReqCount = function (path) {
    counter.inc({ ...commonLabels, path }); // Increment by 1
    console.log('add one');
};
