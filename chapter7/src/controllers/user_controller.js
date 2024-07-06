
/*
 * GET users listing.
 */
const userModel = require('../models/user_model');
exports.login = function (req, res) {
    const _body = req.body;
    const username = _body.username;
    const password = _body.password;
    if (username === 'admin' && password === 'admin') {
        req.session.user = { account: username };
        return res.send({ code: 0 });
    }
    res.send({ code: 1, msg: '用户名或者密码错误' });
};
exports.loginWithDb = function (req, res) {
    const _body = req.body;
    const username = _body.username;
    const password = _body.password;
    if (!username) {
        return res.send({ code: 1, msg: '用户名不能为空' });
    }
    userModel.loginCheck(username, password, function (err, item) {
        if (err) {
            return res.send({ code: 1, msg: err });
        }
        req.session.user = item;
        res.send({ code: 0 });
    });
};
exports.list = function (req, res) {
    res.send('respond with a resource');
};

exports.admin = function (req, res) {
    const user = req.session.user;
    res.render('user/admin', { user: user });
};