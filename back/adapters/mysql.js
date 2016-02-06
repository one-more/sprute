'use strict';

let process = require('process'),
    configuration = require(process.cwd()+'/configuration/connections'),
    knex = require('knex')({
        client: 'mysql',
        connection: configuration.mysql
    });

module.exports = knex;