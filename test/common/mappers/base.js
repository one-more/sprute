'use strict';

let process = require('process'),
    KnexMapper = require(process.cwd()+'/common/mappers/knex-mapper'),
    configuration = require(process.cwd()+'/configuration/connections'),
    mysqlConf = {
        client: 'mysql',
        connection: configuration.mysql
    },
    mysqlAdapter = require('knex')(mysqlConf),
    pgConf = {
        client: 'pg',
        connection: configuration.pg
    },
    pgAdapter = require('knex')(pgConf),
    assert = require('assert'),
    crypto = require('crypto');

let tableName = 'test';

class TestModel {}

class MysqlMapper extends KnexMapper {
    constructor() {
        super(mysqlConf)
    }

    get tableName() {
        return tableName
    }

    get model() {
        return TestModel
    }

    beforeCreateTable(table) {
        table.comment('table for running tests')
    }

    addColumns(table) {
        table.increments('id').primary();
        table.string('field1');
        table.integer('field2');
        table.string('field3')
    }
}

class PGMapper extends KnexMapper {
    constructor() {
        super(pgConf)
    }

    get tableName() {
        return tableName
    }

    get model() {
        return TestModel
    }

    beforeCreateTable(table) {
        table.comment('table for running tests')
    }

    addColumns(table) {
        table.increments('id').primary();
        table.string('field1');
        table.integer('field2');
        table.string('field3')
    }
}

describe('TestMapper', function() {
    describe('mysql mapper constructor', function() {
        it(`create mysql table`, function() {
            return checkCreateTable(mysqlAdapter, MysqlMapper)
        })
    });
    describe('pg mapper constructor', function() {
        it(`create pg table`, function() {
            return checkCreateTable(pgAdapter, PGMapper)
        })
    });

    describe(`mysql mapper #find()`, function() {
        it('has to return model(s)', function() {
            return checkSelect(MysqlMapper)
        })
    });
    describe(`pg mapper #find()`, function() {
        it('has to return model(s)', function() {
            return checkSelect(PGMapper)
        })
    });
});

function checkCreateTable(adapter, mapperClass) {
    return new Promise(resolve => {
        adapter.schema.dropTableIfExists(tableName).then(() => {
            let mapper = new mapperClass;
            mapper.on('table created', () => {
                adapter.schema.hasTable(tableName).then(exists => {
                    assert(exists, `table ${tableName} does not exist`);
                    adapter.schema.hasColumn(tableName, 'id').then(res => {
                        assert(res, 'columns id does not exist')
                    });
                    adapter.schema.hasColumn(tableName, 'field1').then(res => {
                        assert(res, 'columns field1 does not exist')
                    });
                    adapter.schema.hasColumn(tableName, 'field2').then(res => {
                        assert(res, 'columns field2 does not exist')
                    });
                    adapter.schema.hasColumn(tableName, 'field3').then(res => {
                        assert(res, 'columns field3 does not exist');

                        addData(adapter).then(resolve)
                    })
                })
            })
        })
    })
}

function addData(adapter) {
    return adapter.insert({
        field1: crypto.randomBytes(12).toString('hex'),
        field2: Math.round(Math.random() * (1 - 99) + 1),
        field3: crypto.randomBytes(12).toString('hex')
    }).into(tableName).then()
}

function checkSelect(mapperClass) {
    return new Promise(resolve => {
        let mapper = new mapperClass;
        mapper.find().where({id: 1}).then(data => {
            assert(data.length == 1 && data[0] instanceof TestModel)
        });
        mapper.find().where({id: 0}).then(data => {
            assert(!data.length)
        });
        mapper.findOne().where({id: 1}).then(data => {
            assert(data instanceof TestModel)
        });
        mapper.findOne().where({id: 0}).then(data => {
            assert(!data);
            resolve()
        });
    })
}