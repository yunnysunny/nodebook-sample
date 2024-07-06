/**
 * User: sunny
 * Date: 14-9-5
 * Time: 上午10:44
 */
const fs = require('fs');
const path = require('path');
require('./string');

function exitProcess (reason) {
    console.error.apply(console, arguments);
    setTimeout(function () {
        process.exit();
    }, 20000);
}

module.exports = {
    init: function (configObj) {
        this.configObj = configObj;
        return this;
    },
    loadVar: function (key) {
        let value;
        if (key.indexOf('.') == -1) {
            value = this.configObj[key];
        } else {
            const keyArray = key.split('.');
            let keyStr = keyArray[0];
            value = this.configObj[keyStr];
            for (let i = 1, len = keyArray.length; i < len; i++) {
                if (!value && i < len - 1) {
                    exitProcess('the var [' + keyStr + '] is empty.');
                    return undefined;
                }
                const keyNow = keyArray[i];
                keyStr += '.' + keyNow;
                value = value[keyNow];
            }
        }
        console.log('load var [' + key + '],value:', value);
        return value;
    },
    loadNecessaryVar: function (key) {
        const value = this.loadVar(key);
        if (typeof (value) === 'undefined') {
            exitProcess('the value of ' + key + ' is necessary , but now is undefined');
            return false;
        }
        return value;
    },
    loadNecessaryString: function (key) {
        const str = this.loadVar(key);
        if (typeof (str) !== 'string') {
            exitProcess('the value of ' + key + ' is a necessary string, but get ' + str);
            return false;
        }
        return str;
    },
    loadNecessaryInt: function (key) {
        const num = parseInt(this.loadVar(key));
        if (isNaN(num)) {
            exitProcess('the value of ' + key + ' is a necessary int ,but get ' + num);
            return false;
        }
        return num;
    },
    loadNecessaryObject: function (key) {
        const obj = this.loadVar(key);
        if (!obj || typeof (obj) !== 'object') {
            exitProcess('the value of ' + key + ' is a necessary object ,but get ', obj);
            return false;
        }
        return obj;
    },
    loadNecessaryFile: function (key, onlyCheckDirectory) {
        const filePath = this.loadVar(key);
        if (!onlyCheckDirectory) {
            if (!fs.existsSync(filePath)) {
                exitProcess('the value of ' + key + ' is a necessary file ,but not exists in ' + filePath);
                return false;
            }
        } else {
            const dirname = path.dirname(filePath);
            if (!fs.lstatSync(dirname).isDirectory()) {
                exitProcess('the path ' + dirname + ' must exist and be a directory');
                return false;
            }
        }

        return filePath;
    },
    loadNecessaryDirectory: function (key, endWithSeparator) {
        const filepath = this.loadNecessaryFile(key);
        if (!fs.lstatSync(filepath).isDirectory()) {
            exitProcess('the path ' + filepath + ' must be a directory');
            return false;
        }
        if (endWithSeparator && !filepath.endWith(path.sep)) {
            exitProcess('the path ' + filepath + ' must be end with a separator');
            return false;
        }
        return filepath;
    },
    loadNecessaryUrl: function (key, endWithSeparator) {
        const url = this.loadNecessaryString(key);
        if (!url.startWith('http://') && !url.startWith('https://')) {
            exitProcess('invalid url');
            return false;
        }
        if (endWithSeparator && !url.endWith('/')) {
            exitProcess('the url[' + url + '] must be end with /');
            return false;
        }
        if (!endWithSeparator && url.endWith('/')) {
            exitProcess('the url[' + url + '] must not be end with /');
            return false;
        }
        return url;
    }
};