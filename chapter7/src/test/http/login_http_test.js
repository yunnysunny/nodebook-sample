var request = require('supertest');
var app = require('../../app');
var cookie = '';

before(function(done) {
    request(app)
      .post('/user/login')
      .send({username:'admin', password:'admin'})
      .expect(200,{code:0})
      .end(function(err,res) {
          if (err) {
              return done(err);
          }
          var header = res.header;
          var setCookieArray = header['set-cookie'];

          for (var i=0,len=setCookieArray.length;i<len;i++) {
              var value = setCookieArray[i];
              var result = value.match(/^express_chapter7=([a-zA-Z0-9%\.\-_]+);\s/);
              if (result && result.length > 1) {
                  cookie = result[1];
                  break;
              }
          }
          if (!cookie) {
              return done(new Error('查找cookie失败'));
          }
          done();
      });
});
describe('Backend',function() {

    it('first test',function(done) {
        request(app)
        .get('/user/admin')
        .set('Cookie','express_chapter7='+cookie)
        .expect(200,/<title>admin<\/title>/,done);
    });
});