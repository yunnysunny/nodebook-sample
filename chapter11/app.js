var http = require('http');
var ccap = require('ccap')();//Instantiated ccap class 

http.createServer(function (request, response) {
    if(request.url == '/favicon.ico')return response.end('');//Intercept request favicon.ico
    var ary = ccap.get();
    var txt = ary[0];
    var buf = ary[1];
    response.end(buf);
    // response.end('ok');
    //console.log(txt);
}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');