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

    afterTableCreated(table) {}

    addColumns(table) {}

    select() {
        return this.adapter.select().from(this.tableName)
    }
};