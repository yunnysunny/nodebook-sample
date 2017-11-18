const http = require('http');
const ccap = require('ccap')();//Instantiated ccap class 
const cache = require('./lib/cache');
const rand = require('./lib/rand');

http.createServer(function (request, response) {
    const url = request.url;
    if(url === '/favicon.ico')return response.end('');//Intercept request favicon.ico
    if (url === '/cache-test') {
        return response.end(cache.queryWithCache(rand.create(3))||'__');
    }
    const ary = ccap.get();
    const txt = ary[0];
    const buf = ary[1];
    response.end(buf);
    // response.end('ok');
    //console.log(txt);
}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');