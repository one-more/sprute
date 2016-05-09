'use strict';

module.exports = {
    init() {
        let socket;
        app.clientSide(() => {
            socket = require('./lib/client-socket')
        });
        app.serverSide(() => {
            socket = require('./lib/server-socket')
        });
        return socket
    }
};