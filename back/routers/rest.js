'use strict';

let BaseRouter = require('./base');

module.exports = class extends BaseRouter {
    query(req, res) {
        let mapper = req.mapper;
        try {
            let mapperClass = new require(app.get('commonPath')+`/mappers/${mapper}`);
            res.send(mapperClass.fromQueryObject(req.queryObject))
        } catch(e) {
            res.status(400).send('bad request')
        }
    }
};