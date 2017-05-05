var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/live", {native_parser:false});
exports.users = db.bind('users');