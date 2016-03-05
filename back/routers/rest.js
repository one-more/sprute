'use strict';

let BaseRouter = require('./base');

module.exports = class extends BaseRouter {
    query(req, res) {
        let mapper = req.mapper;

        let path, paths = [app.get('commonPath'), app.get('classPath')];
        while(path = paths.shift()) { console.log(path);
            try {
                let mapperClass = new require(`${path}/mappers/${mapper}`);
                return mapperClass.fromQueryObject(req.queryObject).then(data => res.send(data))
            } catch(e) {}
        }
        return res.status(400).send('bad request')
    }
};