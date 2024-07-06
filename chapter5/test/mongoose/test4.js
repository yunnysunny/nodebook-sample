const async = require('async');
const mongoose = require('mongoose');
require('./conn');//代码6.2.2.1对应的代码
const Article = mongoose.model('article', require('./schemas/article_schema'));
const User = mongoose.model('user', require('./schemas/user_schema'));

const nameRand = 'name' + Math.random();
const nick = 'nick' + Math.random();
let articleId = '';
let userId = null;

async.waterfall([
    function (next) {
        new User({
            nickname: nick,
            avatar_url: 'https://r1.ykimg.com/0510000058CAE99E73A29660000456DB'
        }).save(function (err, item) {
            if (err) {
                console.error('插入用户失败', err);
                return next(err);
            }
            userId = item._id;
            next(false);
        });
    },
    function (next) {
        new Article({
            name: nameRand,
            _author: userId
        }).save(function (err, item) {
            if (err) {
                console.error('插入文章失败', err);
                return next(err);
            }
            articleId = item._id.toString();
            next(false);
        });
    },
    function (next) {
        Article.findOne({ name: nameRand }, 'name -_id', function (err, item) {
            if (err) {
                return console.error('findOne', err);
            }
            console.log('findOne', item && item.name === nameRand);
        });
        Article.find({ name: /^name/ }).select('_author').lean().exec(function (err, items) {
            if (err) {
                return console.error('find', err);
            }
            console.log('find', items);
        });
        Article.findById(articleId, { name: 1 }, function (err, item) {
            if (err) {
                return console.error('findById', err);
            }
            console.log('findById', item);
        });
        Article
            .findById(articleId)
            .select('name _author')
            .populate('_author', 'nickname -_id')
            .exec(function (err, item) {
                if (err) {
                    return console.error('findById', err);
                }
                console.log('populate', item);
            });
        next(false);
    }
]);
