'use strict';

module.exports = (client, connection) => {
    let knex = require('knex')({
        client
    });

    let builderProto = {
        then: {
            value: function(onFulfilled, onRejected) {
                let query = this.toSQL(); console.log(this.toSQL());
                return new Promise((resolve, reject) => {
                    connection.query(query.sql, query.bindings, (err, results) => {
                        if(err) {
                            return reject(err)
                        }
                        resolve(this.parser(results))
                    });
                }).then(onFulfilled, onRejected)
            }
        },
        dataParser: {
            value: function(parser) {
                this.parser = parser;
                return this
            }
        }
    };
    function Builder() {
        this.parser = data => data;
        Object.setPrototypeOf(this, Object.create(knex.queryBuilder(), builderProto))
    }
    return Builder
};