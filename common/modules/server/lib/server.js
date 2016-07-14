'use strict';

module.exports = {
    init() {
        const express = require('express'),
            server = express(),
            process = require('process'),
            configuration = require(process.cwd()+'/configuration/server');

        configuration.middleware(server);
        const port = configuration.port,
            host = configuration.host;
        server.httpServer = server.listen(port, host, () => {
            console.log(`start listening ${host}:${port}`)
        });
        server.use(express.static(process.cwd()+'/static'));
        return server
    }
};