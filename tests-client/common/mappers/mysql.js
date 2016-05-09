'use strict';

(() => {
    const process = require('process'),
        TestMapper = require(process.cwd()+'/tests-client/common/mappers/test');

    class MysqlModel {}

    class MysqlMapper extends TestMapper {
        constructor() {
            let conf = {
                client: 'mysql'
            };
            app.serverSide(() => {
                conf.connection = require(process.cwd()+'/configuration/connections').mysql
            });
            super(conf)
        }

        get fileName() {
            return 'mysql'
        }

        get model() {
            return MysqlModel
        }
    }

    if(typeof module != 'undefined') {
        module.exports = MysqlMapper
    }
})();