var express = require('express');
var router = express.Router();
var user = require('../controllers/user_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function(req, res) {
  res.render('index', { title: 'about' });
});

/* GET users listing. */
router.get('/user', function(req, res) {
	console.log(noneExistVar.pp);
	res.send('respond with a resource');	
});
router.get('/user-crash', function(req, res) {
	setTimeout(function(){
		console.log(noneExistVar.pp);
		res.send('respond with a resource');
	},0);
	
});

router.get('/users/sign', user.showSign);
router.get('/users/do/sign', user.doSign);
router.get('/users/sign2', user.showSign2);
router.post('/users/sign2', user.doSign2);

module.exports = router;
