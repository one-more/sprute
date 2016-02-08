'use strict';

module.exports = configuration => {
    let knex = require('knex')(configuration);

    return class {
        constructor() {
            this.dataParser = parser => {
                this.parser = parser;
                return this
            };

            this.super = knex.queryBuilder();
            Object.setPrototypeOf(this, this.super)
        }
    }
};