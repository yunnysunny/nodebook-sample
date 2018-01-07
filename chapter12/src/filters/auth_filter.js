const ERROR_NO_LOGIN = 0xffff0000;
module.exports = function(req, res, next) {
    var path = req.path;
    if (path === '/' || path === '/user/login') {//这些路径不需要做登陆验证
        return next();
    }
    if (req.session && req.session.user) {//已经登陆了
        res.locals.user= req.session.user;
        return next();
    }
    //以下为没有登陆的处理逻辑
    if (req.xhr) {//当前请求为ajax请求
        return res.send({code:ERROR_NO_LOGIN,msg:'尚未登陆'});
    }
    res.redirect('/');//普通请求
};