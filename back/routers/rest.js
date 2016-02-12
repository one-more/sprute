'use strict';

let BaseRouter = require('./base'),
    QueryBuilder = require(app.get('classPath')+'/query-builders/mysql');

module.exports = class extends BaseRouter {
    mysqlQuery(req, res) {
        let queryBuilder = new QueryBuilder, query;
        if(query = queryBuilder.validateQuery(req.query)) {
            queryBuilder.fromQuery(query).then(data => res.send(data))
        } else {
            res.status(400)
        }
    }
};