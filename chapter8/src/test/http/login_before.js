const request = require('supertest');
const app = require('../../app');
let cookie = exports.cookie = '';

before(function (done) {
    request(app)
        .post('/user/login')
        .send({ username: 'admin', password: 'admin' })
        .expect(200, { code: 0 })
        .end(function (err, res) {
            if (err) {
                return done(err);
            }
            const header = res.header;
            const setCookieArray = header['set-cookie'];

            for (let i = 0, len = setCookieArray.length; i < len; i++) {
                const value = setCookieArray[i];
                const result = value.match(/^express_chapter7=([a-zA-Z0-9%\.\-_]+);\s/);
                if (result && result.length > 1) {
                    exports.cookie = cookie = result[1];
                    break;
                }
            }
            if (!cookie) {
                return done(new Error('查找cookie失败'));
            }
            done();
        });
});
