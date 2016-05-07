'use strict';

const EventEmitter = require('events'),
    event = new EventEmitter;

if(typeof window != 'undefined') {
    window.addEventListener('error', e => {
        event.emit('error', e)
    });

    window.onerror = e => event.emit('error', e)
}

module.exports = event;