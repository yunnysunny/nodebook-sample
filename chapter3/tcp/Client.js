'use strict';
const net = require('net');
const slogger = require('node-slogger');
// const Parser = require('./parser');
const EventEmitter = require('events');
const EventUtil = require('./EventUtil');
const { getSocketPath, EVENT_NEW_MESSAGE } = require('./common_util');

const HEAD_LEN = 5;
const defaultOptions = {
    noDelay: true,
    responseTimeout: 200000,
    reConnectTimes: 0,
    reConnectInterval: 1000,
};
const DATA_TYPE_JSON = 0b00000000;
const DATA_TYPE_BINARY = 0b00100000;
/**
 * @typedef {Object} SendPacket 发送请求数据包结构
 *
 * @property {Number} [timeout=20000] 请求超时时间
 * @property {Number} [dataType=0] 0b000 json 数据 0b001 二进制数据
 * @property {Object} data
 * @property {Number} data.seq 请求序列号
 * @property {String} data.action 请求动作
 * @property {Object} data.data 请求数据
 */

/**
 * @typedef SendCallback send 函数发送回调函数
 *
 * @property {Error=} err 错误信息
 * @property {Object} res 响应内容
 */

/**
 * @typedef ClientOption Client 类构造参数
 *
 * @property {Boolean} [noDelay=true] - 是否开启 Nagle 算法，默认：true，不开启
 * @property {Boolean} [unref=false] - socket.unref，默认不 false
 * @property {Number} [concurrent=0] - 并发请求数，默认：0，不控制并发
 * @property {Number} [responseTimeout=20000] - 请求超时
 * @property {Number} [reConnectTimes=0] - 自动最大重连次数，默认：0，不自动重连，当重连次数超过此值时仍然无法连接就触发close error事件
 * @property {Number} [reConnectInterval=1] - 重连时间间隔，默认： 1s，当reConnectTimes大于0时才有效
 * @property {String} sockPath 服务器端的 socket file 地址
 * @property {Boolean} [reConnectAtFirstTime=false] 第一次出错就重连，默认为false，也就是说默认如果第一次连接出错，就不再重连
 * @property {String} [name=midway.sock] 如果调用的时候没有指定 `sockPath`,则在内部会根据 `name` 拼接出来一个socket 地址，如果 name 没有指定则会使用默认值 `midway.sock`
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
    constructor (options) {
        super();
        options = Object.assign({}, defaultOptions, options);

        this._unref = !!options.unref;
        this._reConnectTimes = options.reConnectTimes;
        this.sockPath = options.sockPath || getSocketPath(options.name);
        if (options.socket) {
            this._socket = options.socket;
            this._bindEvents();
        } else {
            this._connect();
        }

        this.options = options;
        this._queue = [];
        this._header = null;
        this._bodyLength = null;
        this._eventUtil = new EventUtil(this);
        if (options.noDelay) {
            this._socket.setNoDelay(true);
        }
    }

    ready (callback) {
        this._eventUtil.ready(callback);
    }

    /**
   * 从socket缓冲区中读取n个buffer
   * @param {Number} n - buffer长度
   * @return {Buffer} - 读取到的buffer
   */
    read (n) {
        return this._socket.read(n);
    }

    /**
     *
     * @param {Buffer} header
     * @returns {Number}
     */
    getHeaderMeta (header) {
        return header.readUInt8();
    }

    /**
     *
     * @param {Buffer} header
     * @returns {Number}
     */
    getBodyLength (header) {
        return header.readInt32BE(1);
    }

    /**
     * 反序列化
     * @param {Buffer} body - 二进制数据
     * @return {SendPacket} 对象
     */
    decode (body, header) {
        const meta = this.getHeaderMeta(header);
        const dataType = meta >> 5;
        let data = null;
        if (dataType === 0) {
            try {
                data = JSON.parse(body.toString('utf-8'));
            } catch (e) {
                slogger.error('反序列化json失败', e);
                throw e;
            }
        } else if (dataType === 1) {
            data = body;
        }

        return {
            data, //消息数据
            dataType,
        };
    }

    /**
     * 序列化消息
     * @param {SendPacket} message
     * @return {Buffer} 对象
     */
    encode (message) {
        /*
         *  header 8byte
         * 1byte 8bit用于布尔判断 高位 3 bit 代表数据类型，000 json 数据 ，001 二进制数据
         * 4byte 消息长度 最大长度不要超过4个字节
         * body
         * nbyte 消息内容
         * */
        let first = 0;
        if (message.dataType == 1) {
            first = first | DATA_TYPE_BINARY;
        } else {
            first = first | DATA_TYPE_JSON;
        }

        const header = Buffer.alloc(HEAD_LEN);
        const data = JSON.stringify(message.data);
        const body = Buffer.from(data);
        header.fill(0);
        header.writeUInt8(first, 0);
        header.writeUInt32BE(Buffer.byteLength(data), 1);
        return Buffer.concat([header, body]);
    }

    /**
     * 读取服务器端数据，反序列化成对象
     *
     * @fires Client~EVENT_NEW_MESSAGE
     */
    _readPacket () {
        if (!(this._bodyLength)) {
            this._header = this.read(HEAD_LEN);
            if (!this._header) {
                console.log('头部数据尚不完整');
                return false;
            }
            // 通过头部信息获得body的长度
            this._bodyLength = this.getBodyLength(this._header);
        }
        console.log('正文长度' + this._bodyLength);
        let body;
        if (this._bodyLength > 0) {
            body = this.read(this._bodyLength);
            if (!body) {
                slogger.info('正文数据尚不完整');
                return false;
            }
        }
        this._bodyLength = null;
        const entity = this.decode(body, this._header);
        // console.log(entity)
        setImmediate(() => {
            this.emit(EVENT_NEW_MESSAGE, entity.data, (res) => {
                this.send(res);
            }, this);
        });
        return true;
    }

    /**
     * 连接是否正常
     * @property {Boolean}
     */
    get isOK () {
        return this._socket && this._socket.writable;
    }

    _getResEventName (seq) {
        return `response_callback_${seq}`;
    }

    /**
     * 给服务器端发送数据
     *
     * @param {Object} data 要发送的数据
     * @param {SendCallback} [callback=function(){}]
     * @param {Number} [timeout=0]
     * @memberof Client
     */
    send (data, callback = function () { }, timeout = 0) {
        return this._send({
            timeout,
            data,
        }, callback);
    }

    /**
     * 发送数据
     * @param {SendPacket} packet
     * @param {SendCallback=} [callback] - 回调函数，可选
     */
    _send (packet, callback) {
        // 如果有设置并发，不应该再写入，等待正在处理的请求已完成；
        // 或者当前没有可用的socket，等待重新连接后再继续send
        if (!this.isOK) {
            this._queue.push([packet, callback]);
            // 如果设置重连的话还有可能挽回这些请求
            if (!this._socket && !this._reConnectTimes) {
                this._cleanQueue();
            }
            slogger.debug('socket还未准备好');
            return;
        }

        if (callback) {
            const timeout = packet.timeout || this.options.responseTimeout;
            const callbackEvent = this._getResEventName(packet.data.seq);
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
    _cleanQueue () {
        this._queue = [];
    }

    // 缓冲区空闲，重新尝试写入
    _resume () {
        const args = this._queue.shift();
        if (args) {
            this._send(args[0], args[1]);
        }
    }

    /**
     * 主动关闭连接
     * @return {void}
     */
    close () {
        this._reConnectTimes = 0;
        this._close();
    }

    /**
     * 关闭连接
     * @param {Error} err - 导致关闭连接的异常
     * @return {void}
     */
    _close (err) {
        if (!this._socket) {
            return;
        }
        this._socket.destroy();
        this._handleClose(err);
    }

    _handleClose (err) {
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
    _connect (done) {
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
        this._bindEvents();
    }

    /**
     * socket事件监听
     */
    _bindEvents () {
        const socket = this._socket;

        socket.on('readable', () => {
            try {
                // 在这里循环读，避免在 _readPacket 里嵌套调用，导致调用栈过长
                let remaining = false;
                do {
                    console.time('readPacket');
                    remaining = this._readPacket();
                    console.timeEnd('readPacket');
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
        this.on(EVENT_NEW_MESSAGE, (message) => {
            if (message.seq && message.action) {
                this.emit(this._getResEventName(message.seq), message);
            }
        });
    }
}

module.exports = Client;