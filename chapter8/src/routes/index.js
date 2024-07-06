const express = require('express');
const router = express.Router();
const user = require('../controllers/user_controller');

/* 显示登陆. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.post('/user/login', user.login);
router.post('/user/login-with-db', user.loginWithDb);
router.get('/user/admin', user.admin);

module.exports = router;
