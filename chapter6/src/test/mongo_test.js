var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/live", {native_parser:false});
db.bind('article');
db.article.findItems(function(err, items) {
    console.log(err,items);    
    db.close();
});