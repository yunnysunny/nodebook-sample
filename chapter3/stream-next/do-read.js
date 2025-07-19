const { getStream: getStreamBlocked } = require('./blocked-read');
const { getStream: getStreamCallback } = require('./callback-read');
const { getData } = require('./generator-read');
const { webStream } = require('./web-stream-read');

async function main () {
    console.log(new Date(), 'begin blocked');
    const streamBlocked = await getStreamBlocked();
    for await (const data of streamBlocked) {
        console.log(new Date(), data);
    }
    console.log(new Date(), 'end blocked');

    console.log(new Date(), 'begin callback');
    const streamCallback = await getStreamCallback();
    for await (const data of streamCallback) {
        console.log(new Date(), data);
    }
    console.log(new Date(), 'end callback');

    console.log(new Date(), 'begin generator');
    const streamGenerate = getData();
    for await (const data of streamGenerate) {
        console.log(new Date(), data);
    }
    console.log(new Date(), 'end generator');

    console.log(new Date(), 'begin web stream');
    for await (const data of webStream) {
        console.log(new Date(), data);
    }
    console.log(new Date(), 'end web stream');
}

main().catch(console.error);
