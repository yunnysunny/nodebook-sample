const mongoose = require('mongoose');
require('./conn');//代码6.2.2.1对应的代码

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    name: String,
    content: String,
    comments: [{ body: String, date: Date }],
    create_at: { type: Date, default: Date.now }
});

const Article = mongoose.model('article', articleSchema);

new Article({
    name: 'chapter5',
    content: 'Node 中使用数据库',
    comments: [
        { body: '写的不多', date: new Date('2016-10-11') },
        { body: '我顶', date: new Date('2017-01-01') }
    ],
    create_at: new Date('2016/07/03')
}).save(function (err, item) {
    console.log(err, item);
});

Article.insertMany([
    { name: 'chapter1', content: 'Node.js 简介1', create_at: new Date('2016/07/01') },
    { name: 'chapter1', content: 'Node.js 简介2', create_at: new Date('2016/07/01') },
    { name: 'chapter2', content: 'Node.js 简介3', create_at: new Date('2016/07/01') },
    { name: 'chapter2', content: 'Node.js 基础4', create_at: new Date('2016/07/02') },
    { name: 'chapter3', content: 'Node.js 基础5', create_at: new Date('2016/07/02') }
], function (err, ret) {
    console.log('插入数组', err, ret);
});

Article.update({ name: 'chapter2' }, {
    $set: { content: 'Node.js 入门' }
}, function (err, ret) {
    console.log('更新单条数据', err, ret);
});
Article.update({ name: 'chapter2' }, {
    $set: { content: 'Node.js 入门' }
}, { multi: true }, function (err, ret) {
    console.log('更新多条数据', err, ret);
});

Article.findOne({ name: 'chapter1' }).remove().exec(function (err, ret) {
    console.log('删除一条数据', err, ret);
});
Article.remove({ name: 'chapter1' }, function (err, ret) {
    console.log('删除多条数据', err, ret);
});

// db.article.findItems({},function(err, items) {
//     console.log('查询多条数据',err,items);
// });
// db.article.findOne({name:'chapter2'},function(err,item) {
//     console.log('查询单条数据',err,item);
// });