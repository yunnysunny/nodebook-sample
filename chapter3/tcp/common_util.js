const os = require('os');
const path = require('path');
const tmpDir = os.tmpdir();
const WIN_PIPE_PERFIX = '\\\\.\\pipe\\';
const DEFAULT_SOCKET_FILENAME = exports.DEFAULT_SOCKET_FILENAME = 'midway.sock';
const STR_RAND = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const getSocketPath = exports.getSocketPath = function (filename = DEFAULT_SOCKET_FILENAME) {
    let sockPath = path.join(tmpDir, filename);

    if (process.platform === 'win32') {
        sockPath = sockPath.replace(/^\//, '');
        sockPath = sockPath.replace(/\//g, '-');
        sockPath = WIN_PIPE_PERFIX + sockPath;
    }
    return sockPath;
};

const randomStr = exports.randomStr = function (len) {
    len = len || 4;
    let resultStr = '';
    const length = STR_RAND.length;
    let random = null;
    for (let i = 0; i < len; i++) {
        random = Math.floor(Math.random() * length);
        resultStr += STR_RAND.substring(random - 1, random);
    }
    return resultStr;
};

exports.getRandomSocketPath = function () {
    return getSocketPath(randomStr());
};

exports.defaultSockPath = getSocketPath();
exports.EVENT_NEW_MESSAGE = 'eventNewMessage';
