const client = require('prom-client');
const { commonLabels, reqLabelsNames } = require('../config');

const gauge = new client.Gauge({
    name: 'req_duration',
    help: 'request duration',
    labelNames: reqLabelsNames
});
const histogram = new client.Histogram({
    name: 'req_duration_histogram',
    help: 'request duration histogram',
    buckets: [10, 20, 40, 60, 80, 100, 120, 140, 160, 180],
    labelNames: reqLabelsNames
});
const summary = new client.Summary({
    name: 'req_duration_summary',
    help: 'request duration summary',
    percentiles: [0.01, 0.1, 0.5, 0.9, 0.99],
    labelNames: reqLabelsNames,
});
exports.collectDuration = function ({ path, duration, status }) {
    const labels = { ...commonLabels, path, status };
    gauge.set(labels, duration);
    histogram.observe(labels, duration);
    summary.observe(labels, duration);
};
