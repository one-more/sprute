'use strict';

const server = app.get('server').httpServer,
    io = require('socket.io').listen(server),
    process = require('process'),
    config = require(process.cwd()+'/configuration/socket-server');

io.on('connection', socket => {
    config.events(socket)
});

module.exports = Object.setPrototypeOf({
    init() {
        io.on('connection', socket => {
            this.events.forEach(event => {
                socket.on.apply(socket, event)
            })
        });
        return this
    },

    events: [],

    on() {
        this.events.push(arguments);
        io.sockets.on.apply(io.sockets, arguments)
    }
}, io.sockets);