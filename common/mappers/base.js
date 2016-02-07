'use strict';

let _ = require('underscore'),
    queryBuilder;

require('../query-builders/pg').then(builder => {
    queryBuilder = builder
});

module.exports = class {
    constructor() {
        app.serverSide(this.checkTable.bind(this))
    }

    get queryBuilder() {
        return queryBuilder
    }

    get schemaBuilder() {
        return require(app.get('classPath')+'/schema-builders/pg')
    }

    checkTable() {
        if(this.schemaBuilder) {
            let schemaBuilder = new this.schemaBuilder;
            schemaBuilder.hasTable(this.tableName).then(exists => {
                if(!exists) {
                    return schemaBuilder.createTable(this.tableName, t => {
                        this.afterTableCreated(t);
                        this.addColumns(t)
                    })
                }
            })
        }
    }

    get collection() {
        return Array
    }

    afterTableCreated(table) {}

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