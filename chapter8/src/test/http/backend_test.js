var request = require('supertest');
var app = require('../../app');
var before = require('./login_before');

describe('Backend',function() {

    it('first test',function(done) {
        request(app)
        .get('/user/admin')
        .set('Cookie','express_chapter7=' + before.cookie)
        .expect(200,/<title>admin<\/title>/,done);
    });
});