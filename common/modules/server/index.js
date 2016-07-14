'use strict';

module.exports = {
    init() {
        let module;
        app.serverSide(() => {
            module = require('./lib/server')
        });
        app.clientSide(() => {
            module = require('./lib/client')
        });
        return module.init()
    }
};