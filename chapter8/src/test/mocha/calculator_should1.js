var assert = require('should');
var calculator = require('./calculator');

describe('Calculator', function() {
  describe('#add()', function() {
    it('should get 3 when 1 add 2', function() {
      (calculator.add(1,2)).should.be.exactly(3).and.be.a.Number();
    });
  });
});