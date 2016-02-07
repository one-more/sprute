'use strict';

let process = require('process'),
    configuration = require(process.cwd()+'/configuration/connections'),
    mysql = require('mysql');



module.exports = mysql.createConnection(configuration.mysql);