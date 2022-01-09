const hello = require('./build/Release/addon').hello;

const { parentPort } = require('worker_threads');
parentPort.on('message', data => {
    parentPort.postMessage(hello() + ' worker recive: ' + data);
});