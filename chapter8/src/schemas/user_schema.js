const {Schema} = require('mongoose');

const userSchema =  new Schema({
    account : {type:String,required:true,unique:true},
    passwd : {type:String}
},{ 
    timestamps: { 
        createdAt: 'created_at',updatedAt : 'update_at' 
    } 
});
