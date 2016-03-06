'use strict';

let mysqlMapper = new MysqlMapper,
    pgMapper = new PGMapper,
    expect = require('chai').expect;

describe('MysqlMapper', function() {
    describe('#find', function() {
        it('should return model(s)', function(done) {
            checkSelect(mysqlMapper, done)
        })
    });
    describe('#save', function() {
        it('should not save model', function(done) {
            checkSave(mysqlMapper, done)
        })
    })
});

describe('PGMapper', function() {
    describe('#find', function() {
        it('should return model(s)', function(done) {
            checkSelect(pgMapper, done)
        })
    });
    describe('#save', function() {
        it('should not save model', function(done) {
            checkSave(pgMapper, done)
        })
    })
});

function checkSelect(mapper, done) {
    mapper.find().where({id: 1}).then(data => {
        expect(data).to.have.length(1);
        expect(data[0]).to.be.an.instanceof(mapper.model)
    });
    mapper.find().where({id: 0}).then(data => {
        expect(data).to.have.length(0);
    });
    mapper.findOne().where({id: 1}).then(data => {
        expect(data).to.be.an.instanceof(mapper.model)
    });
    mapper.findOne().where({id: 0}).then(data => {
        expect(data).to.be.null;
        done()
    });
}

function checkSave(mapper, done) {
    let data = {
        field1: 'asd',
        field2: Math.round(Math.random() * (1 - 99) + 1),
        field3: 'asd'
    };


    mapper.save(data).catch(err => {
        mapper.findOne({id:1}).then(model => {
            model.field1 = 'dfg';
            mapper.save(data).catch(err => {
                done()
            })
        })
    })
}