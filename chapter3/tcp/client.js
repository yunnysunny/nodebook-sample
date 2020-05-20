'use strict';
const net = require('net');
const slogger = require('node-slogger');
// const Parser = require('./parser');
const EventEmitter = require('events');
// const EventUtil = require('./EventUtil');
const { getSocketPath, EVENT_NEW_MESSAGE } = require('./common_util');
/**
 * 0字节 option
 * 1-4 字节 msg_id
 * 5-8字节 消息长度
 */
const HEAD_LEN = 4;
const MAX_PACKET_ID = Math.pow(2, 30);
const defaultOptions = {
    noDelay: true,
    responseTimeout: 20000,
    reConnectTimes: 0,
    reConnectInterval: 1000,
};
/**
 * @typedef SendPacket
 * 
 * @description 发送请求数据包结构
 * 
 * @param {Number} [timeout=20000] 请求超时时间
 * @param {Number} id 请求ID，内部生成
 * @param {Boolean} [oneway=false] - 是否单向
 * @param {Boolean} [isResponse=false] 是否是响应，现在系统中暂时没有启用这个字段，其值目前恒为 false
 * @param {Object} data
 * @param {String} data.action 请求动作
 * @param {Object} data.data 请求数据
 */

/**
 * @typedef SendCallback
 * 
 * @description send 函数发送回调函数
 * 
 * @param {Error=} err 错误信息
 * @param {Object} res 响应内容
 */

/**
 * @typedef ClientOption
 * 
 * @description Client 类构造参数
 * 
 * @param {Boolean} [noDelay=true] - 是否开启 Nagle 算法，默认：true，不开启
 * @param {Boolean} [unref=false] - socket.unref，默认不 false
 * @param {Number} [concurrent=0] - 并发请求数，默认：0，不控制并发
 * @param {Number} [responseTimeout=20000] - 请求超时
 * @param {Number} [reConnectTimes=0] - 自动最大重连次数，默认：0，不自动重连，当重连次数超过此值时仍然无法连接就触发close error事件
 * @param {Number} [reConnectInterval=1] - 重连时间间隔，默认： 1s，当reConnectTimes大于0时才有效
 * @param {String} sockPath 服务器端的 socket file 地址
 * @param {Boolean} [reConnectAtFirstTime=false] 第一次出错就重连，默认为false，也就是说默认如果第一次连接出错，就不再重连
 * @param {String} [name=midway.sock] 如果调用的时候没有指定 `sockPath`,则在内部会根据 `name` 拼接出来一个socket 地址，如果 name 没有指定则会使用默认值 `midway.sock`
 */

/**
 * tcp 客户端的基类
 * 
 * @class Client
 * @extends {EventEmitter}
 */
class Client extends EventEmitter {
    /**
     * @param {ClientOption} options
     * 
     * @constructor
     */
    constructor(options) {
        super();
        options = Object.assign({}, defaultOptions, options);

        this._unref = !!options.unref;
        this._reConnectTimes = options.reConnectTimes;
        this.sockPath = options.sockPath || getSocketPath(options.name);
        if (options.socket) {
            this._socket = options.socket;
            this._bind();
        } else {
            this._connect();
        }
        
        this.options = options;
        this._queue = [];
        this._header = null;
        this._bodyLength = null;
        this._packetId = 0;

    }
    ready(callback) {
        this._eventUtil.ready(callback);
    }
    /**
   * 从socket缓冲区中读取n个buffer
   * @param {Number} n - buffer长度
   * @return {Buffer} - 读取到的buffer
   */
    read(n) {
        return this._socket.read(n);
    }
    /**
   * 读取 packet 的头部
   * @return {Buffer} header
   */
    getHeader() {
        return this.read(HEAD_LEN);
    }

    getBodyLength(header) {
        return header.readInt32BE();
    }



    /**
     * 反序列化
     * @param {Buffer} buf - 二进制数据
     * @return {SendPacket} 对象
     */
    decode(buf, header) {


        return {
            oneway: !!(first & 0x80),//是否单向
            isResponse: !(first & 0x40),//是否是响应
            id,//消息id
            data,//消息数据
        };
    }

    /**
     * 序列化消息
     * @param {SendPacket} message - 二进制数据
     * @return {Buffer} 对象
     */
    encode(message) {
        /*
         *  header 8byte
         * 1byte 8bit用于布尔判断 是否双向通信|响应还是请求|后面6bit保留
         * 4byte packetId 包id最大4位
         * 4byte 消息长度 最大长度不要超过4个字节
         * body
         * nbyte 消息内容
         * */
        let first = 0;
        if (message.oneway) {
            first = first | 0x80;
        }
        if (message.isResponse === false) {
            first = first | 0x40;
        }
        const header = new Buffer(9);
        const data = JSON.stringify(message.data/*, replaceErrors*/);
        const body = new Buffer(data);
        header.fill(0);
        header.writeUInt8(first, 0);
        header.writeUInt32BE(message.id, 1);
        header.writeUInt32BE(Buffer.byteLength(data), 5);
        return Buffer.concat([header, body]);
    }
    /**
     * 读取服务器端数据，反序列化成对象
     * 
     * @fires Client~EVENT_NEW_MESSAGE
     */
    _readPacket() {
        if (!(this._bodyLength)) {
            this._header = this.getHeader();
            if (!this._header) {
                return false;
            }
            // 通过头部信息获得body的长度
            this._bodyLength = this.getBodyLength(this._header);
        }

        let body;
        // body 可能为空
        if (this._bodyLength > 0) {
            body = this.read(this._bodyLength);
            if (!body) {
                return false;
            }
        }
        this._bodyLength = null;
        let entity = this.decode(body, this._header);
        setImmediate(() => {
            this.emit(EVENT_NEW_MESSAGE, entity.data, (res) => {
                const id = entity.id;
                this.send(`response_callback_${id}`, res);
            });
        });
        return true;
    }

    /**
     * 连接是否正常
     * @property {Boolean} 
     */
    get isOK() {
        return this._socket && this._socket.writable;
    }
    /**
     * 给服务器端发送数据
     * 
     * @param {String} action 发送动作
     * @param {Object} data 要发送的数据
     * @param {SendCallback} [callback=function(){}] 
     * @param {Number} [timeout=0] 
     * @memberof Client
     */
    send(action, data, callback = function () { }, timeout = 0) {
        return this._send({
            timeout,
            data: {
                action,
                data,
            },
        }, callback);
    }

    /**
     * 发送数据
     * @param {SendPacket} packet
     * @param {SendCallback=} [callback] - 回调函数，可选
     */
    _send(packet, callback) {
        // 如果有设置并发，不应该再写入，等待正在处理的请求已完成；或者当前没有可用的socket，等待重新连接后再继续send
        if (!this.isOK) {
            this._queue.push([packet, callback]);
            // 如果设置重连的话还有可能挽回这些请求
            if (!this._socket && !this._reConnectTimes) {
                this._cleanQueue();
            }
            return;
        }

        packet.id = this.createPacketId();
        if (callback) {
            const timeout = packet.timeout || this.options.responseTimeout;
            const callbackEvent = `response_callback_${packet.id}`;
            const timer = setTimeout(() => {
                this.removeAllListeners(callbackEvent);
                const err = new Error(`target no response in ${timeout}ms`);
                err.name = 'MessengerRequestTimeoutError';
                callback(err);
            }, timeout);
            this.once(callbackEvent, (message) => {
                clearTimeout(timer);
                callback(null, message);
            });
        }

        this._socket.write(this.encode(packet));
        this._resume();
    }

    // 清理未发出的请求
    _cleanQueue() {
        this._queue = [];
    }

    // 缓冲区空闲，重新尝试写入
    _resume() {
        let args = this._queue.shift();
        if (args) {
            this._send(args[0], args[1]);
        }
    }

    /**
     * 主动关闭连接
     * @return {void}
     */
    close() {
        this._reConnectTimes = 0;
        this._close();
    }

    /**
     * 关闭连接
     * @param {Error} err - 导致关闭连接的异常
     * @return {void}
     */
    _close(err) {
        if (!this._socket) {
            return;
        }
        this._socket.destroy();
        this._handleClose(err);
    }

    _handleClose(err) {
        if (!this._socket) {
            return;
        }

        this._socket.removeAllListeners();
        this._socket = null;

        if (err) {
            this._eventUtil.emitError(err);
        }

        // 自动重连接
        if (this._reConnectTimes && (this._eventUtil.getReadyState()/*之前成功过*/ || this.options.reConnectAtFirstTime)) {
            const timer = setTimeout(() => {
                this._reConnectTimes--;
                this._connect(() => {
                    // 连接成功后重新设置可重连次数
                    this._reConnectTimes = this.options.reConnectTimes;
                    // 继续处理由于socket断开遗留的请求
                    slogger.debug('[client] reconnected to the server, process pid is %s', process.pid);
                });
            }, this.options.reConnectInterval);
            if (this.shouldUnref) {
                (timer).unref();
            }
            return;
        }
        this._cleanQueue();
        // 触发 close 事件，告诉使用者连接被关闭了，需要重新处理
        this.emit('close');
        this.removeAllListeners();
    }

    // 连接
    _connect(done) {
        this._socket = net.connect(this.sockPath);
        this._socket.once('connect', () => {
            this._eventUtil.setResult(true);
            done && done();
            if (this.shouldUnref) {
                this._socket.unref();
            }
            this._resume();
            this.emit('connect');
        });
        this._bind();
    }
    /**
     * socket事件监听
     */
    _bind() {
        const socket = this._socket;

        socket.on('readable', () => {
            try {
                // 在这里循环读，避免在 _readPacket 里嵌套调用，导致调用栈过长
                let remaining = false;
                do {
                    remaining = this._readPacket();
                }
                while (remaining);
            } catch (err) {
                slogger.error('', err);
                err.name = 'PacketParsedError';
                this._close(err);
            }
        });

        socket.once('close', () => this._handleClose());
        socket.once('error', err => {
            this._close(err);
        });
    }


}

module.exports = Client;