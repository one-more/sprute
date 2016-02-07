'use strict';

let _ = require('underscore'),
    knex = require('knex')({
        client: 'mysql'
    }),
    connection = require(app.get('classPath')+'/connections/mysql');

module.exports = class {
    constructor() {
        //this.checkTable()
    }

    get queryBuilder() {
        let connection = this.connection;
        let parseResults = this.parseResults.bind(this);

        function BuilderProto() {}
        BuilderProto.prototype = Object.create(knex(this.tableName));
        function Builder() {}
        Builder.prototype = Object.create(BuilderProto.prototype);
        Builder.prototype.then = function(onFulfilled, onRejected) {
            let query = this.toSQL();
            return new Promise((resolve, reject) => {
                connection.query(query.sql, query.bindings, (err, results) => {
                    if(err) {
                        return reject(err)
                    }
                    resolve(parseResults(results))
                });
            }).then(onFulfilled, onRejected)
        };
        Builder.prototype.fetchMode = function(mode) {
            this._fetchMode = mode
        };
        Builder.prototype.fetchModes = {};
        return new Builder
    }

    get schemaBuilder() {

    }

    get connection() {
        return connection
    }

    checkTable() {
        this.queryBuilder.schema.hasTable(this.tableName).then(exists => {
            if(!exists) {
                return this.queryBuilder.schema.createTable(this.tableName, t => {
                    this.afterTableCreated(t);
                    this.addColumns(t)
                })
            }
        })
    }

    get collection() {
        return Array
    }

    afterTableCreated(table) {}

    addColumns(table) {}

    parseResults(data) {
        if(asOne) {
            if(data.length) {
                cb(_this.populateModel(data[0]))
            } else {
                cb()
            }
        } else {
            cb(_this.getCollection(data.map(_this.populateModel, _this)))
        }
    }

    find() {
        return this.queryBuilder.select()
    }

    findOne() {
        return this.queryBuilder.select()
    }

    populateModel(data) {
        return _.extend(new this.model, data)
    }

    getCollection(data) {
        return new (this.collection.bind.apply(this.collection, [null].concat(data)))
    }
};