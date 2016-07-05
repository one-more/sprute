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

    beforeQuery(query) {
        query.where({deleted: 0});
        return Promise.resolve()
    }

    afterQuery(data) {
        if(data instanceof Array) {
            data.forEach(el => {
                if(el.id) {
                    el.afterQueryCreatedField = 1
                }
            })
        } else if(data && data.id) {
            data.afterQueryCreatedField = 1
        }
        return Promise.resolve(data)
    }

    addColumns(table) {
        table.increments('id').primary();
        table.string('field1');
        table.integer('field2');
        table.string('field3');
        table.boolean('deleted').defaultTo(0).notNullable()
    }

    get validator() {
        if(!this._validator) {
            let vE = app.get('validationEngine');
            this._validator = new vE({
                id: 'integer',
                field1: 'not_empty',
                field2: 'integer',
                field3: 'not_empty',
                deleted: 'trim'
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
        });
        it('has to add model(s) field after query', function() {
            return checkAfterQuery(MysqlMapper)
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
        });
        it('has to add model(s) field after query', function() {
            return checkAfterQuery(PGMapper)
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
            mapper.findOne().then(() => {
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
            field3: crypto.randomBytes(12).toString('hex'),
            deleted: 0
        },
        {
            field1: crypto.randomBytes(12).toString('hex'),
            field2: Math.round(Math.random() * (1 - 99) + 1),
            field3: crypto.randomBytes(12).toString('hex'),
            deleted: 0
        },
        {
            field1: crypto.randomBytes(12).toString('hex'),
            field2: Math.round(Math.random() * (1 - 99) + 1),
            field3: crypto.randomBytes(12).toString('hex'),
            deleted: 0
        },
        {
            field1: crypto.randomBytes(12).toString('hex'),
            field2: Math.round(Math.random() * (1 - 99) + 1),
            field3: crypto.randomBytes(12).toString('hex'),
            deleted: 1
        }
    ];
    return adapter.insert(rows).into(tableName).then()
}

function checkSelect(mapperClass) {
    return new Promise(resolve => {
        let mapper = new mapperClass;
        mapper.find().where({id: 1}).then(data => {
            assert(data.length == 1 && data[0] instanceof TestModel);
            data.forEach(model => {
                assert(model.deleted == 0)
            })
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

function checkAfterQuery(mapperClass) {
    const mapper = new mapperClass;
    return Promise.resolve().then(() => {
        return mapper.find().where({id: 1})
    }).then(data => {
        assert(data.length == 1 && data[0].afterQueryCreatedField);
        return mapper.findOne().where({id: 1})
    }).then(model => {
        assert(model && model.afterQueryCreatedField)
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

        mapper.queryBuilder.count('id as id').then(count => {
            const countBefore = +count[0]['id'];
            mapper.save(validData).then(insertId => {
                assert(+insertId > countBefore);
                mapper.queryBuilder.count('id as id').then(count => {
                    assert(+count[0]['id'] == countBefore+1);

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
    var newVal;
    return Promise.resolve().then(() => {
        return mapper.findOne().where({id:1})
    }).then(model => {
        newVal = crypto.randomBytes(12).toString('hex');
        model.field1 = newVal;
        return mapper.save(model)
    }).then(affectedRows => {
        assert.equal(affectedRows, 1);
        return mapper.findOne().where({id:1})
    }).then(model => {
        assert(model.field1 == newVal);

        model.field2 = newVal;
        try {
            mapper.save(model)
        } catch(e) {
            assert(e)
        }
    }).catch(err => {
        console.log(err);
        console.log(mapper.validator.getErrors());
        throw err
    })
}