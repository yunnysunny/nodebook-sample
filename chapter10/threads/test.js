const path = require('path');
const { Worker } = require('worker_threads');

function createWoker() {
    const worker = new Worker(
        path.join(__dirname, './worker.js')
    );
    worker.postMessage('begin');
    worker.on('message', (msg) => {
        console.log('info from child', msg);
    });
    return new Promise((resolve) => {
        setTimeout(() => {
            worker.removeAllListeners();
            worker.terminate();
            resolve();
        }, 1000);
    });
}

(async function () {
    for (var i=0;i<5;i++) {
        await createWoker();
    }
})();
