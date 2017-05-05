var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/live", {native_parser:false});
db.bind('comment');

db.comment.findAndModify({
    articleId:mongo.helper.toObjectID("5792288c0c0c422b282f2f93")
},{'createTime':-1},{$set:{content:'评论已被删除'}},{
    fields:{author:1,content:1},new:true,upsert:false,remove:false
},function(err, result) {
    console.log('修改后数据',err,result);
});
// db.comment.findAndModify({
//     articleId:mongo.helper.toObjectID("5792288c0c0c422b282f2f93")
// },{'createTime':-1},{$set:{author:'she'}},{
//     fields:{author:1,content:1},new:true,upsert:false,remove:false
// },function(err, result) {
//     console.log('修改后数据',err,result);
// });
// db.comment.findOne({
//     articleId:mongo.helper.toObjectID("5792288c0c0c422b282f2f93")
// },{sort:{'createTime':-1}},function(err,item) {
//     console.log('有屏蔽词的评论',err,item);
// });