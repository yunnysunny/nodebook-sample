var log4js = require('log4js');
var mongoose = require('mongoose');
var Redis = require('ioredis');
var slogger = require('node-slogger');

var configObj = require('../config.json');
var settings = require('./lib/settings').init(configObj);
exports.port = settings.loadNecessaryInt('port');

//保证配置文件中的debugfilename属性存在，且其所在目录在当前硬盘中存在
var debugFile = settings.loadNecessaryFile('debuglogfilename', true);
var traceFile = settings.loadNecessaryFile('tracelogfilename', true);
var errorFile = settings.loadNecessaryFile('errorlogfilename', true);
var debugLogger,traceLogger,errorLogger;

log4js.configure({
    appenders: [
        {type: 'console'},
        {type: 'dateFile', filename: debugFile, 'pattern': 'dd', backups: 10, category: 'debug'}, //
        {type: 'dateFile', filename: traceFile, 'pattern': 'dd', category: 'trace'},
        {type: 'file', filename: errorFile, maxLogSize: 1024000, backups: 10, category: 'error'}
    ],
    replaceConsole: true
});
debugLogger = exports.debuglogger = log4js.getLogger('debug');
traceLogger = exports.tracelogger = log4js.getLogger('trace');
errorLogger = exports.errorlogger = log4js.getLogger('error');


slogger.init({
    debugLogger:debugLogger,
    traceLogger:traceLogger,
    errorLogger:errorLogger
});


let mongoConfig = settings.loadNecessaryObject('mongoConfig');
mongoose.Promise = global.Promise;
mongoose.connect(mongoConfig.url, mongoConfig.option); // connect to database

const redisConfig = settings.loadNecessaryObject('redisConfig');
const clusterRedis = redisConfig.cluster;
if (clusterRedis instanceof Array) {
    delete redisConfig.cluster;
    exports.redisClient = new Redis.Cluster(clusterRedis,redisConfig);
} else {
    exports.redisClient = new Redis(redisConfig);
}

