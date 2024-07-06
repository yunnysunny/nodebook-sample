const log4js = require('log4js');
const mongoskin = require('mongoskin');
const redis = require('redis');
const slogger = require('node-slogger');
const cluster = require('cluster');

const configObj = require('../config.json');
const settings = require('./lib/settings').init(configObj);
exports.port = settings.loadNecessaryInt('port');

//保证配置文件中的debugfilename属性存在，且其所在目录在当前硬盘中存在
const debugFile = settings.loadNecessaryFile('debuglogfilename', true);
const traceFile = settings.loadNecessaryFile('tracelogfilename', true);
const errorFile = settings.loadNecessaryFile('errorlogfilename', true);
let debugLogger, traceLogger, errorLogger;

log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'dateFile', filename: debugFile, pattern: 'dd', backups: 10, category: 'debug' }, //
        { type: 'dateFile', filename: traceFile, pattern: 'dd', category: 'trace' },
        { type: 'file', filename: errorFile, maxLogSize: 1024000, backups: 10, category: 'error' }
    ],
    replaceConsole: true
});
debugLogger = exports.debuglogger = log4js.getLogger('debug');
traceLogger = exports.tracelogger = log4js.getLogger('trace');
errorLogger = exports.errorlogger = log4js.getLogger('error');

slogger.init({
    debugLogger: debugLogger,
    traceLogger: traceLogger,
    errorLogger: errorLogger
});

const dbConfig = settings.loadNecessaryObject('db');//保证配置文件中的db属性存在
if (dbConfig.url instanceof Array) {
    exports.db = mongoskin.db(dbConfig.url, dbConfig.dbOption, dbConfig.relsetOption);
} else {
    exports.db = mongoskin.db(dbConfig.url, dbConfig.dbOption);
}

const redisConfig = settings.loadNecessaryObject('redis');//保证配置文件中的redis属性存在
exports.redis = redis.createClient(redisConfig.port, redisConfig.host);
