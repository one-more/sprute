'use strict';

app.serverSide(() => {
    let process = require('process'),
        conf = require(process.cwd()+'/configuration/connections');
    module.exports = require('./base')({
        client: 'pg',
        connection: conf.pg
    });
});

app.clientSide(() => {
    module.exports = require('./base')({
        client: 'pg'
    });
});