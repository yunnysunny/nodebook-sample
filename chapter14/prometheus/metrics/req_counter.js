const client = require('prom-client');
const { commonLabels, commonLabelNames } = require('../config');
const counter = new client.Counter({
    name: 'req_count',
    help: 'http request count',
    labelNames: ['path', 'status', ...commonLabelNames],
});
exports.addReqCount = function (path, status) {
    counter.inc({ ...commonLabels, path, status }); // Increment by 1
};
