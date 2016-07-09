
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.showSign = function(req, res) {
	res.render('user/sign');
}

exports.doSign = function(req, res) {
	var name = req.query.name;
	var email = req.query.email;
	res.send('恭喜' + name +'注册成功，你的邮箱为:'+email);
}

exports.showSign2 = function(req, res) {
	res.render('user/sign2');
}

exports.doSign2 = function(req, res) {
	var name = req.body.name;
	var result = {};
	if (!name) {
		result.code = 1;
		result.msg = '账号不能为空';
		res.send(result);
		return;
	}
	var email = req.body.email;
	if (!email) {
		result.code = 2;
		result.msg = '邮箱不能为空';
		res.send(result);
		return;
	}
	res.send({code : 0});
}