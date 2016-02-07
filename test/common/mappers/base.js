'use strict';

let process = require('process'),
    BaseMapper = require(process.cwd()+'/common/mappers/base'),
    configuration = require(process.cwd()+'/configuration/connections'),
    adapter = require('knex')({
        client: 'pg',
        connection: configuration.pg
    }),
    assert = require('assert'),
    EventEmitter = require('events'),
    emitter = new EventEmitter,
    crypto = require('crypto');

class TestModel {}

class TestMapper extends BaseMapper {
    get tableName() {
        return 'test'
    }

    get model() {
        return TestModel
    }

    afterTableCreated(table) {
        table.comment('table for running tests')
    }

    addColumns(table) {
        table.increments('id').primary();
        table.string('field1');
        table.integer('field2');
        table.string('field3');

        emitter.emit('columns created')
    }
}

let mapper;

describe('TestMapper', function() {
    describe('constructor', function() {
        it('should create table', function(done) {
            adapter.schema.hasTable('test').then(exists => {
                if(!exists) {
                    mapper = new TestMapper;
                    emitter.on('columns created', () => {
                        adapter.schema.hasTable('test').then(exists => {
                            assert(exists, 'table test does not exist');
                            adapter.schema.hasColumn('test', 'id').then(res => {
                                assert(res, 'columns id does not exist')
                            });
                            adapter.schema.hasColumn('test', 'field1').then(res => {
                                assert(res, 'columns field1 does not exist')
                            });
                            adapter.schema.hasColumn('test', 'field2').then(res => {
                                assert(res, 'columns field2 does not exist')
                            });
                            adapter.schema.hasColumn('test', 'field3').then(res => {
                                assert(res, 'columns field3 does not exist');

                                addData();
                                done()
                            })
                        })
                    })
                } else {
                    mapper = new TestMapper;
                    done()
                }
            })
        });
    });

    checkSelect()
});

function addData() {
    adapter.insert({
        field1: crypto.randomBytes(12).toString('hex'),
        field2: Math.round(Math.random() * (1 - 99) + 1),
        field3: crypto.randomBytes(12).toString('hex')
    }).into('test').then()
}

function checkSelect() {
    describe('#find()', function() {
        it('has to return model(s)', function(done) {
            mapper.find().where({id: 1}).then(data => {
                assert(data.length == 1)
            });
            mapper.find().where({id: 0}).then(data => {
                assert(!data.length)
            });
            mapper.findOne().where({id: 1}).then(data => {
                assert(!data.length)
            });
            mapper.findOne().where({id: 0}).then(data => {
                assert(!data);
                done()
            });
        })
    })
}