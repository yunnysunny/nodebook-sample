const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    name: {
        type: String,
        required: [true, '必须提供文章标题'],
        maxlength: [50, '文章标题不能多于50个字符']
    },
    _author: { type: Schema.Types.ObjectId, ref: 'user' },
    isbn: {
        type: String,
        unique: [true, 'isbn号不能重复'],
        sparse: true
    },
    content: {
        type: String,
        validate: {
            validator: function () {
                return !(/<script>/.test(this.content));
            },
            message: '文章内容非法'
        }
    },
    starts: {
        type: Number,
        min: 0,
        max: [5, '最多只能给5颗星'],
        default: 0
    },
    level: {
        type: String,
        enum: ['专家推荐', '潜力无限', '家有作家初长成', '我只是个小学生']
    },
    category: {
        type: String,
        enum: {
            values: ['诗歌', '散文', '杂文', '议论文', '小说'],
            message: '当前标签不支持'
        }
    },
    cover_url: {
        type: String,
        match: [/^http(s?):\/\//, '封面图格式非法']
    },
    comments: [{ body: String, date: Date }],
    create_at: { type: Date, default: Date.now }
});

articleSchema.pre('save', function (next) {
    this.content = this.name + '\n' + (this.content || '');
    next();
});

articleSchema.post('save', function (doc) {
    console.log('%s has been saved', doc._id);
});

module.exports = articleSchema;