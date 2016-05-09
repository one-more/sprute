'use strict';

const socket = require('socket.io-client/socket.io'),
    process = require('process'),
    config = require(process.cwd()+'/configuration/socket-server');

module.exports = new socket(`${config.host}:${config.port}`, {'forceNew':true});