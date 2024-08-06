const { Slogger } = require('node-slogger');
const fs = require('fs');
const { Kafka } = require('kafkajs');
const { KafkaJsProducer } = require('queue-schedule');
const configObj = require('./config.json');
const { JsonConfig } = require('config-settings');
const settings = new JsonConfig({ configObject: configObj });

exports.CUSTOM_HEADER_KEY_MY_ID = 'my-id';
exports.port = settings.loadNecessaryInt('port');
exports.TO_FORMAT_FIELD = 'myformat';
exports.FORMAT_SUFFIX = '_format';
//保证配置文件中的debugfilename属性存在，且其所在目录在当前硬盘中存在

const errorFile = settings.loadNecessaryFile('errorLogFile', true);

const slogger = new Slogger({
    streams: {
        error: fs.createWriteStream(errorFile)
    }
});
exports.slogger = slogger;

const kafkaConfig = settings.loadNecessaryVar('kafkaConfig.connection');
const topic = settings.loadNecessaryVar('kafkaConfig.topic');
const client = new Kafka(kafkaConfig);
exports.kafkaSchedule = new KafkaJsProducer({
    topic: topic,
    delayInterval: 1000,
    client
});

process.on('unhandledRejection', err => {
    // eslint-disable-next-line no-console
    slogger.error('unhandledRejection:', err);
});