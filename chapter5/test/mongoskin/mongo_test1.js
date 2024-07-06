const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/live', { native_parser: false });
db.bind('article');

db.article.insert([
    { name: 'chapter1', content: 'Node.js 简介', createTime: new Date('2016/07/01') },
    { name: 'chapter1', content: 'Node.js 简介', createTime: new Date('2016/07/01') },
    { name: 'chapter1', content: 'Node.js 简介', createTime: new Date('2016/07/01') },
    { name: 'chapter2', content: 'Node.js 基础', createTime: new Date('2016/07/02') },
    { name: 'chapter2', content: 'Node.js 基础', createTime: new Date('2016/07/02') }
], function (err, ret) {
    console.log('插入数组', err, ret);
});
db.article.insert({
    name: 'chapter5', content: 'Express.js 基础', createTime: new Date('2016/07/03')
}, function (err, ret) {
    console.log('单条插入', err, ret);
});
db.article.update({ name: 'chapter2' }, {
    $set: { content: 'Node.js 入门' }
}, function (err, ret) {
    console.log('更新单条数据', err, ret);
});
db.article.update({ name: 'chapter2' }, {
    $set: { content: 'Node.js 入门' }
}, { multi: true }, function (err, ret) {
    console.log('更新多条数据', err, ret);
});
db.article.remove({ name: 'chapter1' }, { justOne: true }, function (err, ret) {
    console.log('删除单条数据', err, ret);
});
// db.article.remove({name:'chapter1'},function(err,ret) {
//         console.log('删除数据',err,ret);
//     });

db.article.findItems({}, function (err, items) {
    console.log('查询多条数据', err, items);
});
db.article.findOne({ name: 'chapter2' }, function (err, item) {
    console.log('查询单条数据', err, item);
});