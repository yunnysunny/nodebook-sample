const { parentPort, workerData } = require('worker_threads');
console.log('a from parent', workerData.a);
parentPort.on('message', data => {
    parentPort.postMessage(' worker recive: ' + data);
});