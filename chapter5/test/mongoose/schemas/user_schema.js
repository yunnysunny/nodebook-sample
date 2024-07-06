const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    nickname: { type: String },
    avavtar_url: { type: String }
});

module.exports = userSchema;