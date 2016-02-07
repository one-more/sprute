'use strict';

let connection = require(app.get('classPath')+'/connections/mysql');

module.exports = Promise.resolve(require('./knex-builder')('mysql', connection));