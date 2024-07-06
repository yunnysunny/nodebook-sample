const http = require('http');
const url = require('url');
const qs = require('querystring');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    const query = url.parse(req.url, true).query;
    let postStr = '';
    req.on('data', function (data) {
        postStr += data;
    });
    req.on('end', function () {
        const post = qs.parse(postStr);
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Hello ${post.name} World from ${query.source || 'unknown'}\n`);
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});