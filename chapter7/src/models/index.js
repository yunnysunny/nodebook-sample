const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/nodebook');
exports.UserModel = mongoose.model('user', require('../schemas/user_schema'));
/**
 * 往users表插入数据，则产生一条用户名和密码都为admin的数据
 *
 * db.getCollection('users').insert({
    account:'admin',
    passwd:'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg='
    })
 */
