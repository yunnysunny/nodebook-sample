const request = require('supertest');

describe('agent 测试', function () {
    it('get agent', function (done) {
        const agent = request.agent();
        console.log(agent);
        agent.get('http://baidu.com').end(function (err, res) {
            if (err) {
                return done(err);
            }
            console.log(agent);
        });
    });
});