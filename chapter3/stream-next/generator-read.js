const { readDataDelay } = require('./data-source');

exports.getData = async function * () {
    let begin = 0;
    const size = 1;
    const readFun = readDataDelay(1000);
    let hasMore = true;
    while (hasMore) {
        const data = await readFun(begin, size);
        if (data.length === 0) {
            hasMore = false;
        } else {
            yield * data;
            begin += size;
        }
    }
};
