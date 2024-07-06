const mongoose = require('mongoose');
require('./conn');//代码6.2.2.1对应的代码

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    name: String,
    content: String,
    comments: [{ body: String, date: Date }],
    create_at: { type: Date, default: Date.now }
});
articleSchema.pre('validate', function (next) {
    if (/<script>/.test(this.content)) {
        return next(new Error('文章内容非法'));
    }
    next();
});
articleSchema.pre('save', function (next) {
    this.content = this.name + '\n' + this.content;
    next();
});

articleSchema.post('save', function (doc) {
    console.log('%s has been saved', doc._id);
});

const Article = mongoose.model('article', articleSchema);

new Article({
    name: 'chapter5',
    content: 'Node 中使用数据库',
    comments: [
        { body: '写的不多', date: new Date('2016-10-11') },
        { body: '我顶', date: new Date('2017-01-01') }
    ],
    create_at: '2017-02-11'
}).save(function (err, item) {
    console.log(err, item);
});

new Article({
    name: 'chapter5',
    content: 'Node 中使用数据库<script>alert(document.cookie)</script>',
}).save(function (err, item) {
    console.log(err, item);
});
