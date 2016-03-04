'use strict';

let KnexMapper = require('/common/mappers/knex-mapper');

class TestModel {}

class TestMapper extends KnexMapper {
    constructor() {
        super({
            client: 'mysql'
        })
    }

    get tableName() {
        return 'test'
    }

    get model() {
        return TestModel
    }
}

let mapper = new TestMapper();

describe('TestMapper', function() {
    describe('find', function() {
        it('should return model(s)', function() {
            mapper.find().where({id: 1}).then(data => {
                expect(data).to.have.length(1)
            })
        })
    })
});