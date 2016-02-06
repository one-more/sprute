'use strict';

let _ = require('underscore');

module.exports = class {
    constructor() {
        this.checkTable()
    }

    checkTable() {
        this.adapter.schema.hasTable(this.tableName).then(exists => {
            if(!exists) {
                return this.adapter.schema.createTable(this.tableName, t => {
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

    find(asOne) {
        let _this = this;
        return Object.setPrototypeOf({
            then(cb) {
                Object.getPrototypeOf(this).then(data => {
                    if(asOne) {
                        if(data.length) {
                            cb(_this.populateModel(data[0]))
                        } else {
                            cb()
                        }
                    } else {
                        cb(_this.getCollection(data.map(_this.populateModel, _this)))
                    }
                })
            }
        }, this.adapter.select().from(this.tableName))
    }

    findOne() {
        return this.find(true)
    }

    populateModel(data) {
        return _.extend(new this.model, data)
    }

    getCollection(data) {
        return new (this.collection.bind.apply(this.collection, [null].concat(data)))
    }
};