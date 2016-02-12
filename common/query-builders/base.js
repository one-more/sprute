'use strict';

module.exports = configuration => {
    let knex = require('knex')(configuration);

    return class {
        constructor() {
            this.parser = data => data;

            this.knex = knex.queryBuilder()
        }

        dataParser(parser) {
            this.parser = parser;
            return this
        }

        select() {
            this.knex.select.apply(this.knex, arguments);
            return this
        }

        as() {
            this.knex.as.apply(this.knex, arguments);
            return this
        }

        column() {
            this.knex.column.apply(this.knex, arguments);
            return this
        }

        from() {
            this.knex.from.apply(this.knex, arguments);
            return this
        }

        withSchema() {
            this.knex.withSchema.apply(this.knex, arguments);
            return this
        }

        where() {
            this.knex.where.apply(this.knex, arguments);
            return this
        }

        whereNot() {
            this.knex.whereNot.apply(this.knex, arguments);
            return this
        }

        whereIn() {
            this.knex.whereIn.apply(this.knex, arguments);
            return this
        }

        whereNotIn() {
            this.knex.whereNotIn.apply(this.knex, arguments);
            return this
        }

        whereNull() {
            this.knex.whereNull.apply(this.knex, arguments);
            return this
        }

        whereNotNull() {
            this.knex.whereNotNull.apply(this.knex, arguments);
            return this
        }

        whereExists() {
            this.knex.whereExists.apply(this.knex, arguments);
            return this
        }

        whereNotExists() {
            this.knex.whereNotExists.apply(this.knex, arguments);
            return this
        }

        whereBetween() {
            this.knex.whereBetween.apply(this.knex, arguments);
            return this
        }

        whereNotBetween() {
            this.knex.whereNotBetween.apply(this.knex, arguments);
            return this
        }

        whereRaw() {
            this.knex.whereRaw.apply(this.knex, arguments);
            return this
        }

        innerJoin() {
            this.knex.innerJoin.apply(this.knex, arguments);
            return this
        }

        leftJoin() {
            this.knex.leftJoin.apply(this.knex, arguments);
            return this
        }

        leftOuterJoin() {
            this.knex.leftOuterJoin.apply(this.knex, arguments);
            return this
        }

        rightJoin() {
            this.knex.rightJoin.apply(this.knex, arguments);
            return this
        }

        rightOuterJoin() {
            this.knex.rightOuterJoin.apply(this.knex, arguments);
            return this
        }

        outerJoin() {
            this.knex.outerJoin.apply(this.knex, arguments);
            return this
        }

        fullOuterJoin() {
            this.knex.fullOuterJoin.apply(this.knex, arguments);
            return this
        }

        crossJoin() {
            this.knex.crossJoin.apply(this.knex, arguments);
            return this
        }

        joinRaw() {
            this.knex.joinRaw.apply(this.knex, arguments);
            return this
        }

        distinct() {
            this.knex.distinct.apply(this.knex, arguments);
            return this
        }

        groupBy() {
            this.knex.groupBy.apply(this.knex, arguments);
            return this
        }

        groupByRaw() {
            this.knex.groupByRaw.apply(this.knex, arguments);
            return this
        }

        orderBy() {
            this.knex.orderBy.apply(this.knex, arguments);
            return this
        }

        orderByRaw() {
            this.knex.orderByRaw.apply(this.knex, arguments);
            return this
        }

        having() {
            this.knex.having.apply(this.knex, arguments);
            return this
        }

        offset() {
            this.knex.offset.apply(this.knex, arguments);
            return this
        }

        limit() {
            this.knex.limit.apply(this.knex, arguments);
            return this
        }

        union() {
            this.knex.union.apply(this.knex, arguments);
            return this
        }

        unionAll() {
            this.knex.unionAll.apply(this.knex, arguments);
            return this
        }

        insert() {
            this.knex.insert.apply(this.knex, arguments);
            return this
        }

        returning() {
            this.knex.returning.apply(this.knex, arguments);
            return this
        }

        update() {
            this.knex.update.apply(this.knex, arguments);
            return this
        }

        del() {
            this.knex.del.apply(this.knex, arguments);
            return this
        }

        transaction() {
            this.knex.transaction.apply(this.knex, arguments);
            return this
        }

        transacting() {
            this.knex.transacting.apply(this.knex, arguments);
            return this
        }

        forUpdate() {
            this.knex.forUpdate.apply(this.knex, arguments);
            return this
        }

        forShare() {
            this.knex.forShare.apply(this.knex, arguments);
            return this
        }

        count() {
            this.knex.count.apply(this.knex, arguments);
            return this
        }

        min() {
            this.knex.min.apply(this.knex, arguments);
            return this
        }

        max() {
            this.knex.max.apply(this.knex, arguments);
            return this
        }

        sum() {
            this.knex.sum.apply(this.knex, arguments);
            return this
        }

        increment() {
            this.knex.increment.apply(this.knex, arguments);
            return this
        }

        decrement() {
            this.knex.decrement.apply(this.knex, arguments);
            return this
        }

        truncate() {
            this.knex.truncate.apply(this.knex, arguments);
            return this
        }

        pluck() {
            this.knex.pluck.apply(this.knex, arguments);
            return this
        }

        first() {
            this.knex.first.apply(this.knex, arguments);
            return this
        }

        clone() {
            this.knex.clone.apply(this.knex, arguments);
            return this
        }

        modify() {
            this.knex.modify.apply(this.knex, arguments);
            return this
        }

        columnInfo() {
            this.knex.columnInfo.apply(this.knex, arguments);
            return this
        }

        debug() {
            this.knex.debug.apply(this.knex, arguments);
            return this
        }

        connection() {
            this.knex.connection.apply(this.knex, arguments);
            return this
        }

        options() {
            this.knex.options.apply(this.knex, arguments);
            return this
        }

        then(callback) {
            return new Promise(resolve => { this.toSQL();
                app.serverSide(() => {
                    this.knex.then(data => {
                        resolve(callback(this.parser(data)))
                    })
                });

                app.clientSide(() => {
                    let $ = require('jquery');
                    let options = {
                        query: this.toQuery()
                    };
                    $.post(`/rest/${this.knex.client.config.client}/query`, options, null, 'json')
                        .then(data => {
                            resolve(callback(this.parser(data)))
                        })
                })
            }).then(data => data)
        }

        toQuery() {
            return {
                method: this.knex._method,
                statements: this.knex._statements,
                options: this.knex._options
            }
        }

        validateQuery(queryObj) {
            let validateEngine = app.get('validateEngine');
            let validator = validateEngine.Validator({

            });
            return validator.validate(queryObj)
        }

        fromQuery(queryObj) {

        }
    }
};