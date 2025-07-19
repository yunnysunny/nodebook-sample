const { DataStream } = require('./data-stream');
const { readDataDelay } = require('./data-source');

exports.getStream = async function () {
    const stream = new DataStream();
    let hasMore = true;
    const readFun = readDataDelay(1000);
    let begin = 0;
    const size = 1;
    while (hasMore) {
        const data = await readFun(begin, size);
        if (data.length === 0) {
            hasMore = false;
        } else {
            stream.push(...data);
            begin += size;
        }
    }
    stream.push(null);
    return stream;
};
