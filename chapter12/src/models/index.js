const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('../lib/string');
const shemasPath = path.join(__dirname, '../schemas');

const models = {};
fs.readdirSync(shemasPath).filter(function (filename) {
    return filename.endsWith('_schema.js');
}).forEach(function (filename) {
    const key = filename.replace('_schema.js', 'Model').firstUpperCase();
    const name = key.slice(0, -5).toLowerCase();
    models[key] = mongoose.model(name, require(path.join(shemasPath, filename)));
});

/**
 * @namespace
 * @property {Model} UserModel
 * @property {Model} ArticalModel
 */
module.exports = models;