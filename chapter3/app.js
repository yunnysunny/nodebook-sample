const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;
const imageDir = __dirname + '/images';

const server = http.createServer((req, res) => {
    const url = req.url;
    if (url === '/') {
        return res.end('home page');
    }
    const _path = path.join(imageDir, url);

    fs.exists(_path, function (exists) {
        if (exists) {
            res.statusCode = 200;
            res.setHeader('Content-Type', `image/${path.extname(url).replace('.', '')}`);
            fs.createReadStream(_path).pipe(res);
        } else {
            res.statusCode = 404;
            res.end('Not Found');
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});