const path = require('path');
const { Worker } = require('worker_threads');

const worker = new Worker(
    path.join(__dirname, './worker.js'), {
        workerData: { a: 1 }
    }
);
worker.postMessage('begin');
worker.on('message', (msg) => {
    console.log('info from child', msg);
});
worker.on('error', (err) => {
    console.log('worker emit an error', err);
});
