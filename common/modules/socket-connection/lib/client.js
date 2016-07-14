'use strict';

const socket = require('socket.io-client/socket.io'),
    process = require('process'),
    config = require(process.cwd()+'/configuration/socket-server');

module.exports = Object.setPrototypeOf({
    init() {
        this.registerEvents();
        return this
    },

    registerEvents() {
        config.events(this);
    },

    emit(event, data, cb) {
        const events = require(app.get('commonPath')+'/events/common');
        if(typeof cb == 'function' || typeof data == 'function') {
            events.emit('SocketRequestStart', {
                event
            });
            const oldCB = typeof cb == 'function' ? cb : data;
            const cbWrapper = function() {
                events.emit('SocketRequestEnd', arguments);
                oldCB.apply(null, arguments)
            };
            if(typeof data == 'function') {
                data = cbWrapper
            } else {
                cb = cbWrapper
            }
        }
        const proto = Object.getPrototypeOf(this);
        if(typeof data == 'function') {
            proto.emit(event, data)
        } else {
            proto.emit(event, data, cb)
        }
    }
}, new socket(`${config.host}:${config.port}`, {'forceNew':true}));