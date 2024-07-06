
/*
 * GET users listing.
 */

exports.list = function (req, res) {
    res.send('respond with a resource');
};

exports.showSign = function (req, res) {
    res.render('user/sign');
};

exports.doSign = function (req, res) {
    const name = req.query.name;
    const email = req.query.email;
    res.send('恭喜' + name + '注册成功，你的邮箱为:' + email);
};

exports.showSign2 = function (req, res) {
    res.render('user/sign2');
};

exports.doSign2 = function (req, res) {
    const name = req.body.name;
    if (!name) {
        res.send({ code: 1, msg: '账号不能为空' });
        return;
    }
    const email = req.body.email;
    if (!email) {
        res.send({ code: 2, msg: '邮箱不能为空' });
        return;
    }
    res.send({ code: 0 });
};