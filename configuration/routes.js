'use strict';

module.exports = {
    'get': {
        '/': 'index'
    },
    rest: {
        '/rest/mysql/query': 'mysqlQuery',
        '/rest/pg/query': 'pgQuery'
    }
};