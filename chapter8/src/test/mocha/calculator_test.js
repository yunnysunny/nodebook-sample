const assert = require('assert');
const calculator = require('./calculator');

describe('Calculator', function () {
    describe('#add()', function () {
        it('should get 3 when 1 add 2', function () {
            assert.strictEqual(3, calculator.add(1, 2));
        });
    });
});