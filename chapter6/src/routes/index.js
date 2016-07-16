var express = require('express');
var router = express.Router();
var user = require('../controllers/user_controller');

/* 显示登陆. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/user/login', user.login);
router.get('/user/admin',user.admin);

module.exports = router;
