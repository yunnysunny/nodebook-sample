var expect = require('expect.js');
var calculator = require('./calculator');

describe('Calculator', function() {
  describe('#add()', function() {
    it('should get 3 when 1 add 2', function() {
      expect(calculator.add(1,2)).to.be(3);
    });
  });
});