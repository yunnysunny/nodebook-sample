var csurf = require('csurf')();
// require('../lib/string');
// function _needSafe(path) {
//     if (path === '/article/add') {
//         return true;
//     }
//     return false;
// }
module.exports = function(app) {
    app.use(function (req, res, next) {
        // if (req.method === 'POST') {
            csurf(req, res, next);
        //     return;
        // }
        // next();
    });
    app.use(function (req, res, next) {
        res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
        next();
    });
};