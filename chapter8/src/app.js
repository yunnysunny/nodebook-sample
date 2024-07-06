const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
//var logger = require('morgan');
const log4js = require('log4js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

const testRotes = require('./routes/test');
const routes = require('./routes/index');
const calculatorRoutes = require('./routes/calculator');
const authFilter = require('./filters/auth_filter');
const config = require('./config');
const tracelogger = config.tracelogger;
const errorlogger = config.errorlogger;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', config.port);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(log4js.connectLogger(tracelogger, { level: log4js.levels.INFO }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'GG##@$',
    cookie: { domain: 'localhost' },
    key: 'express_chapter7',
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
        client: config.redis,
        ttl: 3600 * 72,
        db: 2,
        prefix: 'session:chapter7:'
    })

}));
app.use('/test', testRotes);
app.use('/calculator', calculatorRoutes);
app.use(authFilter);
app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
