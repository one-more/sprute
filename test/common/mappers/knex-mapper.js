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
    crypto = require('crypto'),
    _ = require('underscore');

let tableName = 'test';

class TestModel {}

class TestMapper extends KnexMapper {
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

class MysqlMapper extends TestMapper {
    constructor() {
        super(mysqlConf)
    }
}

class PGMapper extends TestMapper {
    constructor() {
        super(pgConf)
    }
}

describe('MysqlMapper', function() {
    describe('constructor', function() {
        it(`create table`, function() {
            return checkCreateTable(mysqlAdapter, MysqlMapper)
        })
    });
    describe(`#find()`, function() {
        it('has to return model(s)', function() {
            return checkSelect(MysqlMapper)
        })
    });
    describe(`#save()`, function() {
        it('has to create and update model(s)', function() {
            return checkSave(MysqlMapper)
        })
    });
});

describe('PGMapper', function() {
    describe('constructor', function() {
        it(`create table`, function() {
            return checkCreateTable(pgAdapter, PGMapper)
        })
    });
    describe(`#find()`, function() {
        it('has to return model(s)', function() {
            return checkSelect(PGMapper)
        })
    });
    describe(`#save()`, function() {
        it('has to create and update model(s)', function() {
            return checkSave(PGMapper)
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
    let rows = [
        {
            field1: crypto.randomBytes(12).toString('hex'),
            field2: Math.round(Math.random() * (1 - 99) + 1),
            field3: crypto.randomBytes(12).toString('hex')
        },
        {
            field1: crypto.randomBytes(12).toString('hex'),
            field2: Math.round(Math.random() * (1 - 99) + 1),
            field3: crypto.randomBytes(12).toString('hex')
        },
        {
            field1: crypto.randomBytes(12).toString('hex'),
            field2: Math.round(Math.random() * (1 - 99) + 1),
            field3: crypto.randomBytes(12).toString('hex')
        }
    ];
    return adapter.insert(rows).into(tableName).then()
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

function checkSave(mapperClass) {
    return new Promise(resolve => {
        let mapper = new mapperClass;

        Promise.all([checkInsert(mapper), checkUpdate(mapper)]).then(resolve)
    })
}

function checkInsert(mapper) {
    return new Promise(resolve => {
        let validData = {
            field1: crypto.randomBytes(12).toString('hex'),
            field2: Math.round(Math.random() * (1 - 99) + 1),
            field3: crypto.randomBytes(12).toString('hex')
        };
        let invalidData = {
            field1: Math.round(Math.random() * (1 - 99) + 1),
            field2: crypto.randomBytes(12).toString('hex'),
            field3: Math.round(Math.random() * (1 - 99) + 1)
        };

        mapper.queryBuilder.count().then(count => {
            let countBefore = _.values(count[0])[0];
            mapper.save(validData).then(insertId => {
                mapper.queryBuilder.count().then(count => {
                    let countAfter = _.values(count[0])[0];
                    assert(+countAfter == (+countBefore+1));

                    try {
                        mapper.save(invalidData);
                    } catch(e) {
                        assert(e);
                        resolve()
                    }
                })
            })
        });
    })
}

function checkUpdate(mapper) {
    return new Promise(resolve => {
        mapper.findOne().where({id:1}).then(model => {
            let newVal = crypto.randomBytes(12).toString('hex');
            model.field1 = newVal;
            mapper.save(model).then(affectedRows => {
                mapper.findOne().where({id:1}).then(model => {
                    assert(model.field1 == newVal);

                    model.field2 = newVal;
                    try {
                        mapper.save(model)
                    } catch(e) {
                        assert(e);
                        resolve()
                    }
                })
            });
        })
    })
}