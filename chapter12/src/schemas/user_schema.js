const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema =  new Schema({
    account:{type:String,required:true,unique:true},
    passwd:{type:String,required:true}
},{
    timestamps: {
        createdAt: 'created_at',updatedAt : 'updated_at'
    }
});

module.exports = userSchema;