const client = require('prom-client');
const { commonLabels, reqLabelsNames } = require('../config');
const counter = new client.Counter({
    name: 'req_count',
    help: 'http request count',
    labelNames: reqLabelsNames,
});
exports.addReqCount = function ({ path, status }) {
    counter.inc({ ...commonLabels, path, status }); // Increment by 1
};
