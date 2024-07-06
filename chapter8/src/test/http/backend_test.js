const request = require('supertest');
const app = require('../../app');
const before = require('./login_before');

describe('Backend', function () {
    it('first test', function (done) {
        request(app)
            .get('/user/admin')
            .set('Cookie', 'express_chapter7=' + before.cookie)
            .expect(200, /<title>admin<\/title>/, done);
    });
});