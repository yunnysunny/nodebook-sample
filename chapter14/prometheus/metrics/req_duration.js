const client = require('prom-client');
const { commonLabels, commonLabelNames } = require('../config');
const labelNames = ['path', ...commonLabelNames];
const gauge = new client.Gauge({
    name: 'req_duration',
    help: 'request duration',
    labelNames
});
const histogram = new client.Histogram({
    name: 'req_duration_histogram',
    help: 'request duration histogram',
    buckets: [10, 20, 40, 60, 80, 100, 120, 140, 160, 180],
    labelNames
});
const summary = new client.Summary({
    name: 'req_duration_summary',
    help: 'request duration summary',
    percentiles: [0.01, 0.1, 0.5, 0.9, 0.99],
    labelNames,
});
exports.collectDuration = function (path, duration) {
    const labels = { ...commonLabels, path };
    gauge.set(labels, duration);
    histogram.observe(labels, duration);
    summary.observe(labels, duration);
};
