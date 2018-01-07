const crypto = require('crypto');
const {UserModel} = require('../models/index');


const passwordValid = exports.passwordValid = function(passwordInput,passwordDb) {
    return crypto.createHash('sha256').update(passwordInput).digest('base64') === passwordDb;
}

exports.loginCheck = function(username,password,callback) {
    UserModel.findOne({account:username},function(err,item) {
        if (err) {
            console.error('查询用户时失败',err);
            return callback({msg:'查询用户时失败',code:1});
        }
        if (!item) {
            return callback({code:2,msg:'当前用户不存在'});
        }
        if (!passwordValid(password,item.passwd)) {
            return callback({code:3,msg:'用户名或者密码错误'});
        }
        item.passwd = undefined;
        callback({code:0,data:item});
    });
};