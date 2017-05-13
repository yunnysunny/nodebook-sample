var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    nickname:{type:String},
    avavtar_url : {type:String}
});

module.exports = userSchema;