'use strict';

const server = app.get('server').httpServer,
    io = require('socket.io').listen(server),
    _ = require('underscore'),
    process = require('process'),
    config = require(process.cwd()+'/configuration/socket-server');

io.on('connection', socket => {
    config.events(socket)
});

const FindSomeSocket = new Promise(resolve => {
    if(_.pairs(io.sockets.connected).length) {
        resolve(_.pairs(io.sockets.connected)[0][1])
    } else {
        io.on('connection', socket => {
            resolve(socket)
        })
    }
}).catch(err => {
    console.log(err);
    throw err
});

module.exports = Object.setPrototypeOf({
    emit() {
        FindSomeSocket.then(socket => {
            socket.emit.apply(socket, arguments);
            socket.broadcast.emit.apply(socket.broadcast, arguments)
        })
    },

    get broadcast() {
        return this
    },

    on() {
        _.pairs(this.sockets.connected).forEach(pair => {
            pair[1].on.apply(pair[1], arguments)
        });
        io.on('connection', socket => {
            socket.on.apply(socket, arguments)
        })
    }
}, io);