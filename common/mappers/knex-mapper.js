'use strict';

let BaseMapper = require('./base'),
    EventEmitter = require('events');

module.exports = class extends BaseMapper {
    constructor(knexConfig) {
        super();

        this.knex = require('knex')(knexConfig);
        this.schemaBuilder = this.knex.schema;
        this.emitter = new EventEmitter;
        
        app.serverSide(this.checkTable.bind(this));
    }

    get queryBuilder() {
        return new QueryBuilder(this.knex, this)
    }
    
    checkTable() {
        this.schemaBuilder.hasTable(this.tableName).then(exists => {
            if(!exists) {
                return this.schemaBuilder.createTableIfNotExists(this.tableName, t => {
                    this.beforeCreateTable(t);
                    this.addColumns(t)
                }).then(() => {
                    this.emit('table created')
                })
            }
        })
    }
    
    beforeCreateTable(table) {}

    addColumns(table) {}

    on() {
        return this.emitter.on.apply(this.emitter, arguments)
    }
    once() {
        return this.emitter.once.apply(this.emitter, arguments)
    }

    emit() {
        return this.emitter.emit.apply(this.emitter, arguments)
    }

    get tableName() {
        throw new Error('mapper should specify table name')
    }

    find() {
        return this.queryBuilder.select().dataParser(this.parseAsCollection.bind(this))
    }

    findOne() {
        return this.queryBuilder.select().dataParser(this.parseAsModel.bind(this))
    }

    fromQueryObject(queryObject) {
        return this.queryBuilder.fromQueryObject(queryObject)
    }

    insert(data) {
        if(data = this.validateModel(data)) {
            return this.queryBuilder.insert(data).then(data => data).catch(err => err)
        } else {
            throw new Error('invalid data')
        }
    }

    update(model) {
        let data;
        if(data = this.validateModel(model)) {
            return this.queryBuilder.update(data).where({id: model.id})
                .then(data => data).catch(err => err)
        } else {
            throw new Error('invalid data')
        }
    }

    validateModel() {
        throw new Error('mapper should specify validateModel method')
    }

    get validationErrors() {
        throw new Error('mapper should specify getter for validation errors')
    }
};

class QueryBuilder {
    constructor(knex, mapper) {
        this.knex = knex;
        this.queryBuilder = knex(mapper.tableName);
        this.mapper = mapper
    }

    parser(data) {
        return data
    }

    dataParser(parser) {
        this.parser = parser;
        return this
    }

    select() {
        this.queryBuilder.select.apply(this.queryBuilder, arguments);
        return this
    }

    as() {
        this.queryBuilder.as.apply(this.queryBuilder, arguments);
        return this
    }

    column() {
        this.queryBuilder.column.apply(this.queryBuilder, arguments);
        return this
    }

    from() {
        this.queryBuilder.from.apply(this.queryBuilder, arguments);
        return this
    }

    withSchema() {
        this.queryBuilder.withSchema.apply(this.queryBuilder, arguments);
        return this
    }

    where() {
        this.queryBuilder.where.apply(this.queryBuilder, arguments);
        return this
    }

    whereNot() {
        this.queryBuilder.whereNot.apply(this.queryBuilder, arguments);
        return this
    }

    whereIn() {
        this.queryBuilder.whereIn.apply(this.queryBuilder, arguments);
        return this
    }

    whereNotIn() {
        this.queryBuilder.whereNotIn.apply(this.queryBuilder, arguments);
        return this
    }

    whereNull() {
        this.queryBuilder.whereNull.apply(this.queryBuilder, arguments);
        return this
    }

    whereNotNull() {
        this.queryBuilder.whereNotNull.apply(this.queryBuilder, arguments);
        return this
    }

    whereExists() {
        this.queryBuilder.whereExists.apply(this.queryBuilder, arguments);
        return this
    }

    whereNotExists() {
        this.queryBuilder.whereNotExists.apply(this.queryBuilder, arguments);
        return this
    }

    whereBetween() {
        this.queryBuilder.whereBetween.apply(this.queryBuilder, arguments);
        return this
    }

    whereNotBetween() {
        this.queryBuilder.whereNotBetween.apply(this.queryBuilder, arguments);
        return this
    }

    whereRaw() {
        this.queryBuilder.whereRaw.apply(this.queryBuilder, arguments);
        return this
    }

    innerJoin() {
        this.queryBuilder.innerJoin.apply(this.queryBuilder, arguments);
        return this
    }

    leftJoin() {
        this.queryBuilder.leftJoin.apply(this.queryBuilder, arguments);
        return this
    }

    leftOuterJoin() {
        this.queryBuilder.leftOuterJoin.apply(this.queryBuilder, arguments);
        return this
    }

    rightJoin() {
        this.queryBuilder.rightJoin.apply(this.queryBuilder, arguments);
        return this
    }

    rightOuterJoin() {
        this.queryBuilder.rightOuterJoin.apply(this.queryBuilder, arguments);
        return this
    }

    outerJoin() {
        this.queryBuilder.outerJoin.apply(this.queryBuilder, arguments);
        return this
    }

    fullOuterJoin() {
        this.queryBuilder.fullOuterJoin.apply(this.queryBuilder, arguments);
        return this
    }

    crossJoin() {
        this.queryBuilder.crossJoin.apply(this.queryBuilder, arguments);
        return this
    }

    joinRaw() {
        this.queryBuilder.joinRaw.apply(this.queryBuilder, arguments);
        return this
    }

    distinct() {
        this.queryBuilder.distinct.apply(this.queryBuilder, arguments);
        return this
    }

    groupBy() {
        this.queryBuilder.groupBy.apply(this.queryBuilder, arguments);
        return this
    }

    groupByRaw() {
        this.queryBuilder.groupByRaw.apply(this.queryBuilder, arguments);
        return this
    }

    orderBy() {
        this.queryBuilder.orderBy.apply(this.queryBuilder, arguments);
        return this
    }

    orderByRaw() {
        this.queryBuilder.orderByRaw.apply(this.queryBuilder, arguments);
        return this
    }

    having() {
        this.queryBuilder.having.apply(this.queryBuilder, arguments);
        return this
    }

    offset() {
        this.queryBuilder.offset.apply(this.queryBuilder, arguments);
        return this
    }

    limit() {
        this.queryBuilder.limit.apply(this.queryBuilder, arguments);
        return this
    }

    union() {
        this.queryBuilder.union.apply(this.queryBuilder, arguments);
        return this
    }

    unionAll() {
        this.queryBuilder.unionAll.apply(this.queryBuilder, arguments);
        return this
    }

    insert() {
        this.queryBuilder.insert.apply(this.queryBuilder, arguments);
        return this
    }

    returning() {
        this.queryBuilder.returning.apply(this.queryBuilder, arguments);
        return this
    }

    update() {
        this.queryBuilder.update.apply(this.queryBuilder, arguments);
        return this
    }

    del() {
        this.queryBuilder.del.apply(this.queryBuilder, arguments);
        return this
    }

    transaction() {
        this.queryBuilder.transaction.apply(this.queryBuilder, arguments);
        return this
    }

    transacting() {
        this.queryBuilder.transacting.apply(this.queryBuilder, arguments);
        return this
    }

    forUpdate() {
        this.queryBuilder.forUpdate.apply(this.queryBuilder, arguments);
        return this
    }

    forShare() {
        this.queryBuilder.forShare.apply(this.queryBuilder, arguments);
        return this
    }

    count() {
        this.queryBuilder.count.apply(this.queryBuilder, arguments);
        return this
    }

    min() {
        this.queryBuilder.min.apply(this.queryBuilder, arguments);
        return this
    }

    max() {
        this.queryBuilder.max.apply(this.queryBuilder, arguments);
        return this
    }

    sum() {
        this.queryBuilder.sum.apply(this.queryBuilder, arguments);
        return this
    }

    increment() {
        this.queryBuilder.increment.apply(this.queryBuilder, arguments);
        return this
    }

    decrement() {
        this.queryBuilder.decrement.apply(this.queryBuilder, arguments);
        return this
    }

    truncate() {
        this.queryBuilder.truncate.apply(this.queryBuilder, arguments);
        return this
    }

    pluck() {
        this.queryBuilder.pluck.apply(this.queryBuilder, arguments);
        return this
    }

    first() {
        this.queryBuilder.first.apply(this.queryBuilder, arguments);
        return this
    }

    clone() {
        this.queryBuilder.clone.apply(this.queryBuilder, arguments);
        return this
    }

    modify() {
        this.queryBuilder.modify.apply(this.queryBuilder, arguments);
        return this
    }

    columnInfo() {
        this.queryBuilder.columnInfo.apply(this.queryBuilder, arguments);
        return this
    }

    debug() {
        this.queryBuilder.debug.apply(this.queryBuilder, arguments);
        return this
    }

    connection() {
        this.queryBuilder.connection.apply(this.queryBuilder, arguments);
        return this
    }

    options() {
        this.queryBuilder.options.apply(this.queryBuilder, arguments);
        return this
    }

    then(callback) {
        return new Promise((resolve, reject) => {
            app.serverSide(() => {
                this.queryBuilder.then(data => {
                    resolve(callback(this.parser(data)))
                })
            });

            app.clientSide(() => {
                let $ = require('jquery');
                let options = {
                    mapper: this.mapper.fileName,
                    queryObject: this.toQueryObject()
                };
                $.post('/rest/query', options, null, 'json')
                    .error((xhr, status, err) => {
                        reject(xhr)
                    })
                    .then(data => {
                        resolve(callback(this.parser(data)))
                    })
            })
        }).then(data => data)
    }

    toQueryObject() {
        let obj = {};
        Object.keys(this.queryBuilder).filter(key => key[0] == '_')
            .forEach(key => obj[key] = this.queryBuilder[key]);
        return obj
    }

    toString() {
        return this.queryBuilder.toString()
    }

    boolify(obj) {
        for(let key in obj) {
            if(obj.hasOwnProperty(key)) {
                if(typeof obj[key] == 'object') {
                    this.boolify(obj[key]);
                }
                if(obj[key] === 'false') {
                    obj[key] = false;
                }
                if(obj[key] === 'true') {
                    obj[key] = true;
                }
            }
        }
    }
    
    fromQueryObject(queryObject) {
        this.boolify(queryObject);
        Object.assign(this.queryBuilder, queryObject);
        let queryStr = this.queryBuilder.toString();
        if(this.validateQuery(queryStr)) {
            return this.queryBuilder.then(data => data)
        } else {
            throw new Error('invalid query')
        }
    }

    validateQuery(queryStr) {
        if(this.mapper.validateQuery) {
            return this.mapper.validateQuery(queryStr)
        } else {
            return !/join|union|insert|update|delete/.test(queryStr)
                && new RegExp(`from\\s+\\S*${this.mapper.tableName}\\S*`).test(queryStr)
        }
    }
}