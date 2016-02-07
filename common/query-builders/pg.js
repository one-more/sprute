'use strict';

module.exports = new Promise(resolve => {
    require(app.get('classPath')+'/connections/pg').then(connection => {
        resolve(require('./knex-builder')('pg', connection))
    })
});