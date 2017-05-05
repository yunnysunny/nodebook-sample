var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/live", {native_parser:false});
db.bind('article');

db.article.findItems({
    createTime:{$gte:new Date(2016,6,1),$lt:new Date(2016,6,2)}
},{
    fields:{name:1,createTime:1},skip:1,limit:1,sort:{createTime:-1}
},function(err, items) {
    console.log('查询多条数据',err,items);
});
// db.article.findOne({name:'chapter2'},{
//     fields:{name:1,createTime:1}
// },function(err,item) {
//     console.log('查询单条数据',err,item);
// });