var assert = require('assert');
var sinon = require('sinon');
var calculator = require('./calculator');

describe('Calculator sinon', function () {
    describe('#add()', function () {
        it('should call console.log in add function', function () {
            var spy = sinon.spy(console, 'log');
            calculator.add(1, 2);
            assert(spy.calledWith(1, 2));
            console.log.restore();
        });
        it('restore all the hook operation', function () {
            var spy = sinon.spy(console, 'log');
            calculator.add(1, 2);
            assert(spy.calledOnce);
            assert(spy.calledWith(1, 2));
            console.log.restore();
            sinon.restore();
        });
    });
});