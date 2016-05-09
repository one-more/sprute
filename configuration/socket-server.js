'use strict';

module.exports = {
    get host() {
        return `${location.protocol}//${location.hostname}`
    },

    get port() {
        return location.port || 8000
    },

    events(socket) {
        socket.on('query', (data, cb) => {
            let mapper = data.mapper,
                path, paths = [app.get('commonPath'), app.get('classPath')],
                fs = require('fs');

            while(path = paths.shift()) {
                const dir = fs.readdirSync(path),
                    mappersDir = dir.find(el => el == 'mappers'),
                    files = mappersDir && fs.readdirSync(`${path}/mappers`),
                    file = files && files.find(el => el.includes(mapper));
                if(file) {
                    const mapperClass = new (require(`${path}/mappers/${mapper}`));
                    try {
                        return mapperClass.fromQueryObject(data.queryObject).then(result => {
                            cb(null, result)
                        })
                    } catch(e) {
                        cb({
                            message: e.message,
                            stack: e.stack
                        })
                    }
                }
            }
            cb(new Error(`mapper ${mapper} does not exist`))
        })
    }
};