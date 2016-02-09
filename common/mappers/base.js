'use strict';

let _ = require('underscore'),
    process = require('process'),
    conf = require(process.cwd()+'/configuration/components'),
    queryBuilder = require(`../query-builders/${conf.db.defaultConnection}`),
    EventEmitter = require('events');

module.exports = class extends EventEmitter {
    constructor() {
        super();

        app.serverSide(this.checkTable.bind(this))
    }

    get queryBuilder() {
        return queryBuilder
    }

    get schemaBuilder() {
        try {
            return require(app.get('classPath')+`/schema-builders/${conf.db.defaultConnection}`)
        } catch(e) {
            return null
        }
    }

    checkTable() {
        if(this.schemaBuilder) {
            let schemaBuilder = new this.schemaBuilder;
            schemaBuilder.hasTable(this.tableName).then(exists => {
                if(!exists) {
                    return schemaBuilder.createTableIfNotExists(this.tableName, t => {
                        this.beforeCreateTable(t);
                        this.addColumns(t)
                    }).then(() => {
                        this.emit('table created')
                    })
                }
            })
        }
    }

    get collection() {
        return Array
    }

    beforeCreateTable(table) {}

    addColumns(table) {}

    find() {
        return (new this.queryBuilder).select().from(this.tableName)
            .dataParser(this.parseAsCollection.bind(this))
    }

    findOne() {
        return (new this.queryBuilder).select().from(this.tableName)
            .dataParser(this.parseAsModel.bind(this))
    }

    populateModel(data) {
        return _.extend(new this.model, data)
    }

    parseAsModel(data) {
        if(data.length) {
            return this.populateModel(data[0])
        } else {
            return null
        }
    }

    parseAsCollection(data) {
        data = data.map(this.populateModel.bind(this));
        return new (this.collection.bind.apply(this.collection, [null].concat(data)))
    }
};