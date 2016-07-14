'use strict';

module.exports = {
    init() {
        let module;
        app.clientSide(() => {
            module = require('./lib/client')
        });
        app.serverSide(() => {
            module = require('./lib/server')
        });
        return module.init()
    }
};