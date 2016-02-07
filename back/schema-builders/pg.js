'use strict';

let process = require('process'),
    config = require(process.cwd()+'/configuration/connections'),
    knex = require('knex')({
        client: 'pg',
        connection: config.pg
    });

function schemaBuilder() {}
schemaBuilder.prototype = Object.create(knex.schema);
module.exports = schemaBuilder;
