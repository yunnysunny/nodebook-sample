const articleService = require('../services/article_service');

exports.show = function (req, res) {
    res.render('article/add_article');
};

exports.add = function (req, res) {
    articleService.add(req.body, function (result) {
        res.send(result);
    });
};