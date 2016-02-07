'use strict';

let process = require('process'),
    configuration = require(process.cwd()+'/configuration/connections'),
    pg = require('pg');

module.exports = new Promise(resolve => {
    pg.connect(configuration.pg, (err, client, done) => {
        resolve(client)
    });
});