const os = require('os');
const path = require('path');
const tmpDir = os.tmpDir();
const WIN_PIPE_PERFIX = '\\\\.\\pipe\\';
const DEFAULT_SOCKET_FILENAME = exports.DEFAULT_SOCKET_FILENAME = 'demo.sock';
// var STR_RAND = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const getSocketPath = exports.getSocketPath = function(filename=DEFAULT_SOCKET_FILENAME) {
  let sockPath = path.join(tmpDir, filename);

  if (process.platform === 'win32') {
      sockPath = sockPath.replace(/^\//, '');
      sockPath = sockPath.replace(/\//g, '-');
      sockPath = WIN_PIPE_PERFIX + sockPath;
  }
  return sockPath;
};