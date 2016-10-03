var should = require('should/as-function');
var calculator = require('./calculator');

describe('Calculator', function() {
  describe('#add()', function() {
    it('should get 3 when 1 add 2', function() {
      should(calculator.add(1,2)).be.exactly(3).and.be.a.Number();
    });
  });
});