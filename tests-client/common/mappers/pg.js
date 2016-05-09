'use strict';

(() => {
    const process = require('process'),
        TestMapper = require(process.cwd()+'/tests-client/common/mappers/test');

    class PGModel {}

    class PGMapper extends TestMapper {
        constructor() {
            let conf = {
                client: 'pg'
            };
            app.serverSide(() => {
                conf.connection = require(process.cwd()+'/configuration/connections').pg
            });
            super(conf)
        }

        get fileName() {
            return 'pg'
        }

        get model() {
            return PGModel
        }
    }

    if(typeof module != 'undefined') {
        module.exports = PGMapper
    }
})();