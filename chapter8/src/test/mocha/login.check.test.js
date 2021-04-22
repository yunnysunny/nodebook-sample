const {expect} = require('chai');
const sinon = require('sinon');
const {UserModel} = require('../../models');
const user = require('../../models/user_model');

describe('user check sinon', function() {
    it('错误处理', function(done) {
        const myFake = sinon.stub(UserModel, 'findOne').callsFake(function(filter, fields, option, callback) {
            callback(new Error('error from sinon'));
        });
        user.loginCheck('','', function(err) {
            expect(err).not.be.null;
            myFake.restore();
            done();
        });
    });
});