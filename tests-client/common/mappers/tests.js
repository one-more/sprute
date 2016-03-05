'use strict';

let mapper = new MysqlMapper();

describe('TestMapper', function() {
    describe('find', function() {
        it('should return model(s)', function() {
            mapper.find().where({id: 1}).then(data => {
                expect(data).to.have.length(1)
            })
        })
    })
});