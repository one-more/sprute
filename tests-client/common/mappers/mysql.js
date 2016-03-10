'use strict';

var KnexMapper = require(app.get('commonPath')+'/mappers/knex-mapper'),
    process = require('process');

class MysqlModel {}

class MysqlMapper extends KnexMapper {
    constructor() {
        let conf = {
            client: 'mysql'
        };
        app.serverSide(() => {
            conf.connection = require(process.cwd()+'/configuration/connections').mysql
        });
        super(conf)
    }

    get tableName() {
        return 'test'
    }

    get fileName() {
        return 'mysql'
    }

    get model() {
        return MysqlModel
    }

    get validator() {
        if(!this._validator) {
            let vE = app.get('validationEngine');
            this._validator = new vE({
                field1: 'not_empty',
                field2: 'integer',
                field3: 'not_empty'
            })
        }
        return this._validator
    }

    validateModel(model) {
        return this.validator.validate(model)
    }

    get validationErrors() {
        return this.validator.getErrors()
    }
}

if(typeof module != 'undefined') {
    module.exports = MysqlMapper
}