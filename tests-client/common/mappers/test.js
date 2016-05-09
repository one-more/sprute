'use strict';

const KnexMapper = require(app.get('commonPath')+'/mappers/knex-mapper');

class TestMapper extends KnexMapper {
    get tableName() {
        return 'test'
    }

    beforeQuery() {
        app.get('socketConnection').emit('changeClassPath');
        return Promise.resolve()
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

module.exports = TestMapper;