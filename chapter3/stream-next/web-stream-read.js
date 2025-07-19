// 创建自定义ReadableStream
const { readDataDelay } = require('./data-source');
const { ReadableStream } = require('stream/web');
const readFun = readDataDelay(1000);
const customStream = new ReadableStream({
    // 存储当前状态和数据
    start (controller) {
        // 初始化数据
        this.start = 0;
        this.size = 1; //
    },

    // 读取数据的方法
    async pull (controller) {
        // 模拟异步数据生成（如从API、文件等获取数据）
        const data = await readFun(this.start, this.size);

        this.start += this.size;

        // 检查是否还有数据要发送
        if (data.length > 0) {
            // 发送数据
            data.forEach(item => controller.enqueue(item));
        } else {
            // 没有更多数据，结束流
            controller.close();
        }
    },

    // 处理取消的方法（可选）
    cancel (reason) {
        console.log('流被取消:', reason);
    }
});
exports.webStream = customStream;
