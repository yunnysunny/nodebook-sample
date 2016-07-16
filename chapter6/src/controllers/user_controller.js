
/*
 * GET users listing.
 */
exports.login = function(req, res) {
    var _body = req.body;
    var username = _body.username;
    var password = _body.password;
    if (username === 'admin' && password === 'admin') {
        req.session.user = {account:username};
        return res.send({code:0});
    }
    res.send({code:1,msg:'用户名或者密码错误'});
}
exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.admin = function(req, res) {
    var user = req.session.user;
    res.render('user/admin',{user:user});
}