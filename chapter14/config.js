const { name } = require('./package.json');
exports.commonLabels = {
    serverName: name,
    namespace: 'default',
};
exports.commonLabelNames = Object.keys(exports.commonLabels);