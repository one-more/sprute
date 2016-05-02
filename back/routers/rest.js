'use strict';

let BaseRouter = require('./base');

module.exports = class extends BaseRouter {
    query(req, res) {
        let mapper = req.body.mapper;

        let path, paths = [app.get('commonPath'), app.get('classPath')];
        while(path = paths.shift()) {
            try {
                let mapperClass = new (require(`${path}/mappers/${mapper}`));
                return mapperClass.fromQueryObject(req.body.queryObject)
                    .then(data => res.send(JSON.stringify(data)))
            } catch(e) {
                //console.error(e)
            }
        }
        return res.status(400).send('bad request')
    }
};