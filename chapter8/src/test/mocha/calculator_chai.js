const chai = require('chai');
const calculator = require('./calculator');
const assert = chai.assert;//use assert
const should = chai.should();//use should
const expect = chai.expect;//use expect

describe('Calculator', function () {
    describe('#add() test use assert', function () {
        it('assert get 3 when 1 add 2', function () {
            assert.equal(3, calculator.add(1, 2));
        });
    });

    describe('#add() test use should', function () {
        it('should get 3 when 1 add 2', function () {
            (calculator.add(1, 2)).should/*.be.a('number').and*/.be.equal(3);
        });
    });

    describe('#add() test use expect', function () {
        it('expect get 3 when 1 add 2', function () {
            expect(calculator.add(1, 2)).to.equal(3);
        });
    });
});