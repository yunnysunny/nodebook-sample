const client = require('prom-client');
const gauge = new client.Gauge({ name: 'req_duration', help: 'request duration' });
const histogram = new client.Histogram({
    name: 'req_duration_histogram',
    help: 'request duration histogram',
    buckets: [10, 20, 40, 60, 80, 100, 120, 140, 160, 180]
});
const summary = new client.Summary({
    name: 'req_duration_summary',
    help: 'request duration summary',
    percentiles: [0.01, 0.1, 0.5, 0.9, 0.99],
});
exports.collectDuration = function (duration) {
    gauge.set(duration); // Set to 10
    histogram.observe(duration);
    summary.observe(duration);
};
