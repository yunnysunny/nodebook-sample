var log4js = require('log4js');
var mongoskin = require('mongoskin');
var redis = require('redis');
var slogger = require('node-slogger');
var cluster = require('cluster');

var configObj = require('../config.json');
var settings = require('./lib/settings').init(configObj);
exports.port = settings.loadNecessaryInt('port');

//保证配置文件中的debugfilename属性存在，且其所在目录在当前硬盘中存在
var debugFile = settings.loadNecessaryFile('debuglogfilename', true);
var traceFile = settings.loadNecessaryFile('tracelogfilename', true);
var errorFile = settings.loadNecessaryFile('errorlogfilename', true);
var debugLogger,traceLogger,errorLogger;

if (cluster.isMaster) {

    // Init master logger
    log4js.configure({
        appenders: [
            { 
                // Adding only one, "clustered" appender. 
                type: "clustered",

                // Add as many "normal" appenders as you like. 
                // They will all be used once the "clustered" master appender receives a loggingEvent
                appenders: [
                    { type: 'console' },
                    {type: 'dateFile', filename: debugFile, 'pattern': 'dd', backups: 10, category: 'debug'}, //
                    {type: 'dateFile', filename: traceFile, 'pattern': 'dd', category: 'trace'},
                    {type: 'file', filename: errorFile, maxLogSize: 1024000, backups: 10, category: 'error'}
                ]
            }
        ]
    });

    // Init logger like you used to
    logger = log4js.getLogger("master");
console.log('this is master==========');
 debugLogger = exports.debuglogger = log4js.getLogger('debug');
 traceLogger = exports.tracelogger = log4js.getLogger('trace');
 errorLogger = exports.errorlogger = log4js.getLogger('error');

} else {

    // Init worker loggers, adding only the clustered appender here.
    log4js.configure({
        appenders: [
            {type: "clustered"}
        ]
    });


    // Init logger like you used to
    logger = log4js.getLogger("worker_" + cluster.worker.id);

    console.info('message: from worker ' + cluster.worker.id);
    debugLogger = traceLogger = errorLogger = logger;

}

// log4js.configure({
//     appenders: [
//         {type: 'console'},
//         {type: 'dateFile', filename: debugFile, 'pattern': 'dd', backups: 10, category: 'debug'}, //
//         {type: 'dateFile', filename: traceFile, 'pattern': 'dd', category: 'trace'},
//         {type: 'file', filename: errorFile, maxLogSize: 1024000, backups: 10, category: 'error'}
//     ],
//     replaceConsole: true
// });


slogger.init({
    debugLogger:debugLogger,
    traceLogger:traceLogger,
    errorLogger:errorLogger
});


var dbConfig = settings.loadNecessaryObject('db');//保证配置文件中的db属性存在
if (dbConfig.url instanceof Array) {
    exports.db = mongoskin.db(dbConfig.url, dbConfig.dbOption, dbConfig.relsetOption);
} else {
    exports.db = mongoskin.db(dbConfig.url, dbConfig.dbOption);
}

var redisConfig = settings.loadNecessaryObject('redis');//保证配置文件中的redis属性存在
exports.redis = redis.createClient(redisConfig.port, redisConfig.host);

