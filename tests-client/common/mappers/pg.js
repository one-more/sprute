'use strict';

var KnexMapper = require(app.get('commonPath')+'/mappers/knex-mapper'),
    process = require('process');

class PGModel {}

class PGMapper extends KnexMapper {
    constructor() {
        let conf = {
            client: 'pg'
        };
        app.serverSide(() => {
            conf.connection = require(process.cwd()+'/configuration/connections').pg
        });
        super(conf)
    }

    get tableName() {
        return 'test'
    }

    get fileName() {
        return 'pg'
    }

    get model() {
        return PGModel
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
}

if(typeof module != 'undefined') {
    module.exports = PGMapper
}