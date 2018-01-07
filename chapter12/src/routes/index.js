var express = require('express');
var router = express.Router();
var user = require('../controllers/user_controller');
const article = require('../controllers/article_controller');

/* 显示登陆. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/user/login', user.loginWithDb);
// router.post('/user/login-with-db',user.loginWithDb);
router.get('/user/admin',user.admin);

router.get('/article',article.show);
router.post('/article/add',article.add);

module.exports = router;
