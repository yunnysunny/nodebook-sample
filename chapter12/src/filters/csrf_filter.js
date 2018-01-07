var csurf = require('csurf')();

module.exports = function(app) {
    app.use(function (req, res, next) {
        csurf(req, res, next);
    });
    app.use(function (req, res, next) {
        res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
        next();
    });
};