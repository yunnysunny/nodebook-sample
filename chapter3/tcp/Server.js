'use strict';
const fs = require('fs');
const net = require('net');
const slogger = require('node-slogger');
const EventEmitter = require('events');
const EventUtil = require('./EventUtil');
const Client = require('./Client');

const {getSocketPath,EVENT_NEW_MESSAGE} = require('./common_util');
/** 
 * @typedef ServerOption 构造服务器类的选项
 * 
 * @param {String=} sockPath 服务器端的 socket 地址
 * @param {String} [name==midway.sock]
 */

/**
 * TCP服务器端基类
 * 
 * @class Server
 * @extends {EventEmitter}
 */
class Server extends EventEmitter{
  /**
   * 
   * @param {ServerOption} options 
   */
  constructor(options) {
    super();
    this.options = options;
    this.sockPath = options.sockPath ||  getSocketPath(options.name);
    this.clients = new Map();
    this.server = net.createServer(this._handleConnection.bind(this));
    const _this = this;
    this.server.on('error', function(error) {
      _this.emit('error', error);
    });
    // this.on(EVENT_NEW_MESSAGE, (message, replyFun, client) => {
      
    // });
    this._eventUtil = new EventUtil(this);
    this.listen();
  }
  /**
   * 添加服务器端初始化成功回调函数
   * 
   * @param {Function} callback 
   */
  ready(callback) {
    this._eventUtil.ready(callback);
  }
  /**
   * 注册监听服务器端
   * 
   * @param {Function} [callback=function() {}] 
   * @returns 
   */
  listen(callback=function() {}) {
    const sockPath = this.sockPath;
    if (fs.existsSync(sockPath)) {
      try {
        fs.unlinkSync(sockPath);
      } catch (e) {
        slogger.error(e)
      }
      
    }
    this.server.listen(sockPath, () => {
      slogger.debug(`[server] pandora messenger server is listening, socket path is ${this.sockPath}!`);
      setImmediate(() => {
        this._eventUtil.setResult(true);
        
        callback();
        
      });
    });
    return this;
  }
  /**
   * 对所有客户端广播消息
   * 
   * @param {String} action 
   * @param {Object} data 
   * @returns 
   */
  broadcast(action, data) {
    return this._broadcast({
      action: action,
      data: data,
    });
  }

  _broadcast(info) {
    if (this.clients.size === 0) {//尚未有客户端连接
      if (!this.pending) {
        this.pending = [];//初始化待发送数据
        this.on('connected', (client) => {
          this.pending.forEach((msg) => {
            client.send(msg);
          });
        });
      }
      this.pending.push(info);//添加待发送数据
      return this;
    }
    for (const sock of this.clients.keys()) {
      this.clients.get(sock).send(info);
    }
    return this;
  }
  /**
   * 关闭服务器端
   * 
   * @param {Function} callback 
   * @returns 
   * @memberof Server
   */
  close(callback) {
    for (const sock of this.clients.keys()) {
      const client = this.clients.get(sock);
      client.close();
      this.clients.delete(sock);
    }
    this.server.removeAllListeners();
    this.server.close(callback);
    return this;
  }
  // /**
  //  * @fires Server~EVENT_NEW_MESSAGE
  //  * 
  //  * @param {Object} message 
  //  * @param {ResponseFunction} reply 
  //  * @param {Client} client 
  //  */
  // _handleMessage(message, reply, client) {
  //   this.emit(EVENT_NEW_MESSAGE, message, reply, client);
  // }

  _handleDisconnect(socket) {
    slogger.debug(`[server] server lost a connection!`);
    const client = this.clients.get(socket);
    this.clients.delete(socket);
    this.emit('disconnected', client);
  }

  _handleConnection(socket) {
    slogger.debug(`[server] server got a connection!`);
    const client = new Client({
      socket: socket,
      name: this.options.name,
    });
    this.clients.set(socket, client);
    client.on(EVENT_NEW_MESSAGE, (message, replyFun) => {
      // this._handleMessage(message, reply, client);
      if (message && typeof message.action === 'string') {
        this.emit(message.action, message, replyFun);
      }
    });
    const _this = this;
    client.on('error', function(err) {
      _this._eventUtil.emitError(err);
    });
    socket.on('close', this._handleDisconnect.bind(this, socket));
    this.emit('connected', client);
  }
}

module.exports = Server;