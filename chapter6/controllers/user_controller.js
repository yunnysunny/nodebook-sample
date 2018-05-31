
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
	if (!name) {
		res.send({code:1,msg:'账号不能为空'});
		return;
	}
	var email = req.body.email;
	if (!email) {
		res.send({code:2,msg:'邮箱不能为空'});
		return;
	}
	res.send({code : 0});
}