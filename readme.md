### 6.6 模板引擎 ###
express作为一个mvc框架，肯定不能仅仅是处理静态页，作为MVC中的V（视图），是其的有机组成部分。谈到视图，则不得不谈模板引擎，C（控制器）处理完请求后需要将处理后的数据发挥给视图层，这就没法回避从控制器中传递参数到视图层的问题，而在视图层解析这些参数正式模板引擎所要完成的任务。express中是没有内置的模板引擎的，他所使用的都是第三方的模板引擎，比如ejs、jade等。
下面通过命令行来快速生成一个express项目：
`express -e ejs myapp`
命令会在当前执行目录下创建一个myapp文件夹，进入myapp目录下，会发现我们熟悉的pagekage.json文件，很明显里面含有对于express、ejs依赖的说明，但是目录下却没有文件夹，运行
`npm install`
来安装所有所需的依赖。
接着打开文件夹中的app.js，会发现生成的代码如下：
	
	/**
	 * Module dependencies.
	 */
	
	var express = require('express');
	var routes = require('./routes');
	var user = require('./routes/user');
	var http = require('http');
	var path = require('path');
	
	var app = express();
	
	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
	
	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}
	
	app.get('/', routes.index);
	app.get('/users', user.list);
	
	http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
**代码片段 6.6.1**    
注意这两行： 
  
	app.set('views', __dirname + '/views');   
	app.set('view engine', 'ejs');      

它代表使用的模板引擎为ejs，并且把所有的模板文件都放到了当前文件夹下的views目录中。
然后看一下：
   
	app.use(express.static(path.join(__dirname, 'public')));

这代表将静态页放到了当前文件夹下的public目录中。
最后看一下路由设置：

	app.get('/', routes.index);

我们找到routes.index文件的定义（位于routes目录下index.js文件中）：

	exports.index = function(req, res){
	  res.render('index', { title: 'Express' });
	};

这里面遇到了一个render函数，这个函数就是express中用于加载模板的函数。通过代码也可以大体看出，第一个参数是模板的名字，它所代表的文件位于视图文件夹views目录下的index.ejs（ejs文件后缀是ejs模板引擎的默认后缀）；而第二个参数即为传递给这个模板的参数。
接着看一下在模板中，是怎样使用刚才传递的那个titile参数的，打开views文件夹下的index.ejs：

	<!DOCTYPE html>
	<html>
	  <head>
	    <title><%= title %></title>
	    <link rel='stylesheet' href='/stylesheets/style.css' />
	  </head>
	  <body>
	    <h1><%= title %></h1>
	    <p>Welcome to <%= title %></p>
	  </body>
	</html>

可以看到使用<%=titile%>的方式就可以把之前render函数中传递的title参数读取出来。
扩展一下在ejs中还有两个常见的标签：
<%- %>:读取变量中的值且对于变量中的html特殊符号（比如<、>、&、”等）不进行转义，如果使用<%=%>就会把特殊符号转义，
<%%>:写在这个标签里的语句会直接当成代码来解析，如果说如下代码：

	<% if (status == 0) { %>
	<input  type=”button” value=”启用” />
	<% } else { %>
	<input  type=”button” value=”禁用” />
	<% } %>


### 6.7  Express 中的GET和POST ###

接下来的内容来讲一下express中怎样使用get和post，首先我们在views文件夹下新建目录user,然后在user目录下新建文件sign.ejs(当然你也可以把它当成静态页，放到public中；但是正常环境下，对于html一般都是通过视图的方式来加载)。

	<!DOCTYPE html>
	<html>
	<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Node.js注册演示</title>
	</head>
	<body>
	<h1>注册</h1>
	<form id="signup" method="get" action="/users/do/sign">
	<label>   帐号：</label><input type="text" name="username" />
	<label>   Email：</label><input type="text" name="email" />
	<input type="submit" value="注册" /><br>
	</form>
	</body>
	</html>

**代码6.7.1 sign.ejs代码**

这里表单method是get（虽然一般情况下网服务器添加数据都是用post方式，但是这里为了演示方便，现将其写成get）。接下来看一下express中怎样在GET方式下获取表单中的数据。
为了演示用户注册这个流程，我们在routes/user.js中添加两个方法：

	exports.showSign = function(req, res) {
		res.render('user/sign');
	}
	
	exports.doSign = function(req, res) {
		var name = req.query.name;
		var email = req.query.email;
		res.send('恭喜' + name +'注册成功，你的邮箱为:'+email);
	}

**代码6.7.2 新增user.js文件中处理函数**

然后在app.js中添加相应的路由如下：

	app.get('/users/sign', user.showSign);
	app.get('/users/do/sign', user.doSign);

**代码6.7.3 新增app.js中路由配置**

运行`node app.js`，即可查看效果，打开http://localhost:3000/users/sign ，可看到如下界面：

![注册显示界面](https://raw.github.com/yunnysunny/expressdemo/master/show.png)

输入数据后，点击注册，显示提示信息：

![注册成功显示界面](https://raw.github.com/yunnysunny/expressdemo/master/do.png)

这就完成了get操作，但是前面提到了类似于这种注册操作一般都是用post的，将上面的代码改成post是很简单的，只需在代码代码6.7.1 中将表单的method改成post，代码6.7.2中获取请求数据是这么写的：

	var name = req.query.name;
	var email = req.query.email;

如果改成post，只需将其改为

	var name = req.body.name;
	var email = req.body.email;

### 6.8  Express AJAX 应用示例 ###
还是上面的例子，只不过这次换成用ajax来提交数据，我们在views/user文件夹下再新建文件sign2.ejs：

	<!DOCTYPE html>
	<html>
	<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Node.js注册演示</title>
	<script language="javascript" src="/javascripts/jquery-1.10.2.js"></script>
	</head>
	<body>
	<h1>注册</h1>
	<form id="signup" method="post" action="/users/sign2">
	<label>帐号：</label><input type="text" name="name" /><br />
	<label>Email：</label><input type="text" name="email" /><br />
	<input type="submit" value="注册" /><br>
	</form>
	<script language="javascript">
		$(document).ready(function() {
			$('#signup').submit(function() {
				$.post($(this).attr('action'),$(this).serialize(),function(result) {
					if (result.code == 0) {
						alert('注册成功');
					} else {
						if (result.msg) {
							alert(result.msg);
						} else {
							alert('服务器异常');
						}
					}
				},'json')
				return false;
			});
		});
	</script>
	</body>
	</html>

**代码6.8.1 sign2.ejs**

为了使用ajax，我们引入了jquery，并将jquery-1.10.2.js放到了public/javascripts文件夹下，为了演示ajax和普通请求处理的区别，这里仅仅给出处理post请求的代码：

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

**代码6.8.2 ajax后台处理代码**

express中res的send函数中传一个json对象，则发送给浏览器的时候会自动序列化成json字符串。