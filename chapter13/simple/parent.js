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
    // 子线程崩溃时，会抛出异常，触发 error 事件，这里可以重新触发线程的创建过程，保证线程一直在线
    console.error('worker emmit error', err);
});
worker.on('exit', (code) => {
    //线程退出事件
});
