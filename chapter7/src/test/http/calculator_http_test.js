var request = require('supertest');
var app = require('../../app');

describe('POST /calculator/add', function() {
  it('respond with json', function(done) {
    request(app)
      .post('/calculator/add')
      .send({a: 1,b:2})
      .expect(200, {
          code:0,data:3
      },done);
  });
});