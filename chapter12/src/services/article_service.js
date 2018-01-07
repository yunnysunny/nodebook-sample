const slogger = require('node-slogger');
const {ArticleModel} = require('../models/index');

exports.add = function(data,callback) {
    new ArticleModel(data).save(function(err) {
        if (err) {
            slogger.error('保存文章时失败',err);
            return callback({code:1,msg:'保存文章时失败'});
        }
        callback({code:0});
    });
};