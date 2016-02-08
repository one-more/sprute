'use strict';

app.serverSide(() => {
    let process = require('process'),
        conf = require(process.cwd()+'/configuration/connections');
    module.exports = require('./knex-builder')({
        client: 'mysql',
        connection: conf.mysql
    });
});

app.clientSide(() => {
    module.exports = require('./knex-builder')({
        client: 'mysql'
    });
});